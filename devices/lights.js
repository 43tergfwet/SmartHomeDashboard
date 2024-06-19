require('dotenv').config();
const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT_BROKER_ADDRESS);

client.on('connect', () => {
  console.log('Connected to MQTT broker.');
});

client.on('error', (error) => {
  console.error('Connection error:', error);
});

function toggleLight(lightId, on) {
  if (!lightId) {
    console.error('toggleLight: lightId cannot be null or undefined.');
    return;
  }
  if (typeof on !== 'boolean') {
    console.error('toggleLight: on must be a boolean.');
    return;
  }
  
  const topic = `SmartHomeDashboard/lights/${lightId}/toggle`;
  const message = JSON.stringify({ on });
  publishMessage(topic, message);
}

function adjustBrightness(lightId, brightness) {
  if (!lightId) {
    console.error('adjustBrightness: lightId cannot be null or undefined.');
    return;
  }
  if (typeof brightness !== 'number' || brightness < 0 || brightness > 100) {
    console.error('adjustBrightness: brightness must be a number between 0 and 100.');
    return;
  }
  
  const topic = `SmartHomeDashboard/lights/${lightId}/brightness`;
  const message = JSON.stringify({ brightness });
  publishMessage(topic, message);
}

function setSchedule(lightId, schedule, on) {
  if (!lightId) {
    console.error('setSchedule: lightId cannot be null or undefined.');
    return;
  }
  if (typeof on !== 'boolean') {
    console.error('setSchedule: on must be a boolean.');
    return;
  }
  
  const topic = `SmartHomeDashboard/lights/${lightId}/schedule`;
  const message = JSON.stringify({ schedule, on });
  publishMessage(topic, message);
}

function publishMessage(topic, message) {
  client.publish(topic, message, (error) => {
    if (error) {
      console.error('Publish error:', error);
    }
  });
}

module.exports = { toggleLight, adjustBrightness, setSchedule };