require('dotenv').config();
const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT_BROKER_ADDRESS);

client.on('connect', () => {
  console.log('Connected to MQTT broker.');
});

function toggleLight(lightId, on) {
  const topic = `SmartHomeDashboard/lights/${lightId}/toggle`;
  const message = JSON.stringify({ on });
  client.publish(topic, message);
}

function adjustBrightness(lightId, brightness) {
  const topic = `SmartHomeDashboard/lights/${lightId}/brightness`;
  const message = JSON.stringify({ brightness });
  client.publish(topic, message);
}

function setSchedule(lightId, schedule, on) {
  const topic = `SmartHomeDashboard/lights/${lightId}/schedule`;
  const message = JSON.stringify({ schedule, on });
  client.publish(topic, message);
}

module.exports = { toggleLight, adjustAightness, setSchedule };