import mqtt from 'mqtt';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const serialId = process.argv[2];
const topic = `heliosync/monitor/telemetry/${serialId}`;
if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD || !serialId) {
  console.error('Configurações MQTT ou serialId ausentes. Verifique as variáveis de ambiente e o argumento serialId.');
  if (!serialId) {
    console.error('Uso: ts-node sendTestTelemetry.ts <serialId>');
  }
  if (!MQTT_BROKER_URL) {
    console.error('Variável de ambiente MQTT_BROKER_URL não definida');
  }
  if (!MQTT_USERNAME) {
    console.error('Variável de ambiente MQTT_USERNAME não definida');
  }
  if (!MQTT_PASSWORD) {
    console.error('Variável de ambiente MQTT_PASSWORD não definida');
  }
  process.exit(1);
}
// Dados fictícios colocados ai só para teste
const payload = {
  elev: -15.42,
  azi: 120.55,
  volt: 18.5,
  amp: 450.0,
  time: Math.floor(Date.now() / 1000),
};

const client = mqtt.connect(MQTT_BROKER_URL, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  protocol: 'mqtts',
});

client.on('connect', () => {
  console.log('Conectado ao broker, enviando mensagem...');
  client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) {
      console.error('Erro ao publicar:', err);
    } else {
      console.log('Mensagem publicada com sucesso:', topic, payload);
    }
    client.end();
  });
});

client.on('error', (err) => {
  console.error('Erro MQTT:', err);
  client.end();
});
