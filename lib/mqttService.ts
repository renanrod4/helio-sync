import mqtt from 'mqtt';
import { connectToDatabase } from '@/lib/db';
import { UserDashboardDataModel } from '@/lib/models/userDashboardData';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL 
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

const TOPICS = {
  telemetryBase: 'heliosync/monitor/dados',
  commandBase: 'heliosync/monitor/comandos',
};

type IncomingTelemetryPayload = {
  elev?: number;
  azi?: number;
  volt?: number;
  amp?: number;
  time?: number | string;
};

type IncomingCommandPayload = {
  lat?: number;
  lon?: number;
  [key: string]: unknown;
};

type DashboardPanelLike = {
  _id?: unknown;
  serialId?: string;
  status?: string;
  currentAngleAzimuth?: number;
  currentAngleElevation?: number;
  lastSyncAt?: string;
  latitude?: number;
  longitude?: number;
};

let client: mqtt.MqttClient | null = null;

export function isMqttServiceRunning() {
  return Boolean(client?.connected);
}

export function publishPanelCommand(serialId: string, payload: Record<string, unknown>) {
  if (!client?.connected) {
    console.warn('Nao foi possivel publicar comando: MQTT desconectado.');
    return false;
  }

  const topic = `${TOPICS.commandBase}/${serialId}`;
  client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) {
      console.error('Erro ao publicar comando MQTT:', err);
    }
  });
  return true;
}

function extractSerialId(topic: string, topicBase: string): string | null {
  const prefix = `${topicBase}/`;
  if (!topic.startsWith(prefix)) return null;
  const serialId = topic.slice(prefix.length).trim();
  if (!serialId || serialId.includes('/')) return null;
  return serialId;
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toIsoTimestamp(value: unknown): string {
  const now = new Date();
  const n = toNumberOrNull(value);
  if (n === null) return now.toISOString();

  // Considera epoch em segundos para valores de 10 digitos e milissegundos para 13.
  const millis = n < 1e12 ? n * 1000 : n;
  const date = new Date(millis);
  if (Number.isNaN(date.getTime())) return now.toISOString();
  return date.toISOString();
}

function parseJsonPayload<T>(raw: Buffer): T | null {
  try {
    return JSON.parse(raw.toString()) as T;
  } catch {
    return null;
  }
}

async function persistTelemetry(serialId: string, payload: IncomingTelemetryPayload) {
  const voltageV = toNumberOrNull(payload.volt);
  const currentA = toNumberOrNull(payload.amp);
  const azimuth = toNumberOrNull(payload.azi);
  const elevation = toNumberOrNull(payload.elev);
  const timestamp = toIsoTimestamp(payload.time);

  if (voltageV === null || currentA === null || azimuth === null || elevation === null) {
    console.warn('Telemetria ignorada por payload incompleto:', { serialId, payload });
    return;
  }

  const powerW = voltageV * currentA;

  await connectToDatabase();
  const dashboard = await UserDashboardDataModel.findOne({ 'panels.serialId': serialId });
  if (!dashboard) {
    console.warn('Painel nao encontrado para serialId:', serialId);
    return;
  }

  const panel = (dashboard.panels as DashboardPanelLike[]).find((p) => p.serialId === serialId);
  if (!panel?._id) {
    console.warn('Painel encontrado sem _id para serialId:', serialId);
    return;
  }

  panel.currentAngleAzimuth = azimuth;
  panel.currentAngleElevation = elevation;
  panel.status = 'online';
  panel.lastSyncAt = timestamp;

  dashboard.telemetry.unshift({
    panelId: panel._id,
    timestamp,
    voltageV,
    powerW,
    angleDeg: azimuth,
  });

  if (dashboard.telemetry.length > 1000) {
    dashboard.telemetry = dashboard.telemetry.slice(0, 1000);
  }

  await dashboard.save();
}

async function persistCommand(serialId: string, payload: IncomingCommandPayload) {
  const lat = toNumberOrNull(payload.lat);
  const lon = toNumberOrNull(payload.lon);

  if (lat === null || lon === null) {
    console.warn('Comando recebido sem lat/lon validos:', { serialId, payload });
    return;
  }

  await connectToDatabase();
  const dashboard = await UserDashboardDataModel.findOne({ 'panels.serialId': serialId });
  if (!dashboard) {
    console.warn('Painel nao encontrado para comando do serialId:', serialId);
    return;
  }

  const panel = (dashboard.panels as DashboardPanelLike[]).find((p) => p.serialId === serialId);
  if (!panel) return;

  panel.latitude = lat;
  panel.longitude = lon;
  panel.lastSyncAt = new Date().toISOString();
  await dashboard.save();
}

export function startMqttService() {
  if (client) return; 
  if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD) {
    console.error('Configurações MQTT ausentes. Verifique as variáveis de ambiente.');
    return;
  }
  client = mqtt.connect(MQTT_BROKER_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    protocol: 'mqtts',
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    console.log('MQTT conectado');
    client?.subscribe([`${TOPICS.telemetryBase}/+`, `${TOPICS.commandBase}/+`], (err) => {
      if (err) console.error('Erro ao inscrever tópicos:', err);
    });
  });

  client.on('message', async (topic, message) => {
    const telemetrySerialId = extractSerialId(topic, TOPICS.telemetryBase);
    const commandSerialId = extractSerialId(topic, TOPICS.commandBase);

    if (telemetrySerialId) {
      const payload = parseJsonPayload<IncomingTelemetryPayload>(message);
      if (!payload) {
        console.warn('Payload de telemetria invalido:', topic, message.toString());
        return;
      }
      await persistTelemetry(telemetrySerialId, payload);
      return;
    }

    if (commandSerialId) {
      const payload = parseJsonPayload<IncomingCommandPayload>(message);
      if (!payload) {
        console.warn('Payload de comando invalido:', topic, message.toString());
        return;
      }
      await persistCommand(commandSerialId, payload);
      return;
    }

    console.warn('Mensagem em topico nao mapeado:', topic);
  });

  client.on('error', (err: Error) => {
    console.error('Erro MQTT:', err);
  });
}

export function stopMqttService() {
  if (client) {
    client.end();
    client = null;
  }
}
