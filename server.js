const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

let devices = [];
let users = [];

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('SmartHomeDashboard Backend is running...');
});

app.route('/api/devices')
  .get((req, res) => {
    res.json(devices);
  })
  .post((req, res) => {
    const device = req.body;
    device.id = devices.length + 1;
    devices.push(device);
    res.status(201).send(device);
  });

app.route('/api/devices/:id')
  .get((req, res) => {
    const { id } = req.params;
    const device = devices.find(d => d.id == id);
    if (device) {
      res.json(device);
    } else {
      res.status(404).send({ message: 'Device not found' });
    }
  })
  .put((req, res) => {
    const { id } = req.params;
    let index = devices.findIndex(d => d.id == id);
    if (index > -1) {
      devices[index] = { ...devices[index], ...req.body };
      res.send(devices[index]);
    } else {
      res.status(404).send({ message: `Smart device with ID ${id} not found` });
    }
  })
  .delete((req, res) => {
    const { id } = req.params;
    let index = devices.findIndex(d => d.id == id);
    if (index > -1) {
      devices = devices.filter(d => d.id != id);
      res.send({ message: `Smart device with ID ${id} deleted successfully` });
    } else {
      res.status(404).send({ message: `Smart device with ID ${id} not found` });
    }
  });

app.post('/api/users/register', (req, res) => {
  const { username, password } = req.body;
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    res.status(400).send({ message: 'Username already exists' });
    return;
  }

  const user = { username, password, id: users.length + 1 };
  users.push(user);
  res.status(201).send({ message: 'User registered successfully', userId: user.id });
});

app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.send({ message: 'User logged in successfully', userId: user.id });
  } else {
    res.status(401).send({ message: 'Invalid username or password' });
  }
});

app.listen(PORT, () => {
  console.log(`SmartHomeDashboard Backend listening on port ${PORT}`);
});