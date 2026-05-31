import mqtt from 'mqtt';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL 
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

const TOPICS = {
  telemetry: 'heliosync/monitor/dados',
  command: 'heliosync/monitor/comandos',
};

let client: mqtt.MqttClient | null = null;

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
    client?.subscribe([TOPICS.telemetry, TOPICS.command], (err) => {
      if (err) console.error('Erro ao inscrever tópicos:', err);
    });
  });

  client.on('message', (topic, message) => {
    
    console.log('Mensagem recebida:', topic, message.toString());
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
