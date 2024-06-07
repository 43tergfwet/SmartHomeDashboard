const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('SmartHomeDashboard Backend is running...');
});

app.get('/api/devices', (req, res) => {
    res.json({ message: 'Fetching all smart devices...' });
});

app.post('/api/devices', (req, res) => {
    res.status(201).send({ message: 'Smart device added successfully' });
});

app.put('/api/devices/:id', (req, res) => {
    const { id } = req.params;
    res.send({ message: `Smart device with ID ${id} updated successfully` });
});

app.delete('/api/devices/:id', (req, res) => {
    const { id } = req.params;
    res.send({ message: `Smart device with ID ${id} deleted successfully` });
});

app.post('/api/users/register', (req, res) => {
    res.status(201).send({ message: 'User registered successfully' });
});

app.post('/api/users/login', (req, res) => {
    res.send({ message: 'User logged in successfully' });
});

app.listen(PORT, () => {
    console.log(`SmartHomeDashboard Backend listening on port ${PORT}`);
});