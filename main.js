import axios from 'axios';
import { Auth } from "./auth";

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

class DeviceSettings {
    constructor() {
        this.devices = [];
        this.refreshInterval = null;
    }

    async fetchDevices() {
        try {
            const response = await axios.get(`${API_BASE_URL}/devices`);
            this.devices = response.data;
            console.log('Devices fetched successfully:', this.devices);
            this.displayDevices();
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    }

    displayDevices() {
        const devicesElement = document.getElementById('devices');
        devicesElement.innerHTML = '';
        this.devices.forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.textContent = `Device: ${device.name}, Status: ${device.status}`;
            devicesElement.appendChild(deviceElement);
        });
    }

    async updateDeviceStatus(deviceId, newStatus) {
        try {
            await axios.put(`${API_BASE_URL}/devices/${deviceId}`, { status: newStatus });
            console.log(`Device ${deviceId} status updated to ${new/LStatus}`);
            this.fetchDevices();
        } catch (error) {
            console.error('Error updating device status:', error);
        }
    }

    startAutoRefresh() {
        this.fetchDevices(); // Initial fetch
        this.refreshInterval = setInterval(() => this.fetchDevices(), REFRESH_INTERVAL);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

class User {
    constructor(auth) {
        this.auth = auth;
    }

    async login(email, password) {
        try {
            const response = await this.auth.login(email, password);
            console.log('Login successful:', response);
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    async updateUserDetails(userId, details) {
        try {
            await axios.put(`${API_BASE_URL}/users/${userId}`, details);
            console.log(`User ${userId} details updated.`);
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    }
}

window.onload = () => {
    const deviceSettings = new DeviceSettings();
    const userAuth = new Auth();
    const user = new User(userAuth);

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        await user.login(email, password);
    });

    deviceSettings.startAutoRefresh();

    document.getElementById('updateDeviceForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const deviceId = event.target.deviceId.value;
        const newStatus = event.target.newStatus.value;
        await deviceSettings.updateDeviceStatus(deviceId, newStatus);
    });
};