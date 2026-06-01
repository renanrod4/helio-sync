import mqtt from 'mqtt';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const serialId = process.argv[2];
const topic = `heliosync/monitor/comandos/${serialId}`;

if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD || !serialId) {
  console.error('Configurações MQTT ou serialId ausentes. Verifique as variáveis de ambiente e o argumento serialId.');
  console.error('Uso: ts-node scripts/sendTestCommand.ts <serialId>');
  process.exit(1);
}

const payload = {
  lat: -23.5505,
  lon: -46.6333,
  time: Math.floor(Date.now() / 1000),
};

const client = mqtt.connect(MQTT_BROKER_URL, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  protocol: 'mqtts',
});

client.on('connect', () => {
  console.log('Conectado ao broker, enviando comando de teste...');
  client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) {
      console.error('Erro ao publicar comando:', err);
    } else {
      console.log('Comando publicado com sucesso:', topic, payload);
    }
    client.end();
  });
});

client.on('error', (err) => {
  console.error('Erro MQTT:', err);
  client.end();
});
