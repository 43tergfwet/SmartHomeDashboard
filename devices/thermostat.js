const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const DATABASE_FILE_PATH = process.env.DB_PATH || './smartHomeDB.json';

const readDatabase = () => {
  try {
    const data = fs.readFileSync(DATABASE_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return {};
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DATABASE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
   console.error("Error writing to database:", error);
  }
};

const updateTemperatureSetting = (temperature) => {
  const database = readDatabase();
  database.temperature = temperature;
  writeDatabase(database);
  console.log(`Temperature set to ${temperature} degrees`);
};

const updateSchedule = (newSchedule) => {
  const database = readDatabase();
  database.schedule = newSchedule;
  writeDatabase(database);
  console.log("Schedule updated:", newSchedule);
};

const updateEnergyUsage = (energyUsage) => {
  const database = readDatabase();
  database.energyUsage = energyUsage;
  writeDatabase(database);
  console.log("Energy Usage updated:", energyUsage);
};

const logCurrentEnergyUsage = () => {
  const database = readDatabase();
  if (!database.energyStudio) {
    console.log("No energy usage data available.");
    return;
  }
  console.log("Energy Usage:", database.energyUsage);
};

module.exports = {
  updateTemperatureSetting,
  updateSchedule,
  updateEnergyUsage,
  logCurrentEnergyView,
};