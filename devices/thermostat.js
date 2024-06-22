const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const DB_PATH = process.env.DB_PATH || './smartHomeDB.json';

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return {};
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

const setTemperature = (temp) => {
  const db = readDB();
  db.temperature = temp;
  writeDB(db);
  console.log(`Temperature set to ${temp} degrees`);
};

const adjustSchedule = (schedule) => {
  const db = readDB();
  db.schedule = schedule;
  writeDB(db);
  console.log("Schedule updated:", schedule);
};

const monitorEnergyUsage = () => {
  const db = readDB();
  if (!db.energyUsage) {
    console.log("No energy usage data available.");
    return;
  }
  console.log("Energy Usage:", db.energyUsage);
};

module.exports = {
  setTemperature,
  adjustSchedule,
  monitorEnergyUsage,
};