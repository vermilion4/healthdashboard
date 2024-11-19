import axios from 'axios';

const API_BASE_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';

// Create base64 encoded credentials
const encodeCredentials = () => {
    const username = 'coalition';
    const password = 'skills-test';
    return btoa(`${username}:${password}`);
};

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Basic ${encodeCredentials()}`,
        'Content-Type': 'application/json',
    }
});

export const getPatients = async () => {
    try {
        const response = await api.get('/');
        // Filter for Jessica Taylor's data only
        const jessicaData = response.data.find(patient => 
            patient.name.toLowerCase() === 'jessica taylor'
        );
        return jessicaData;
    } catch (error) {
        console.error('Error fetching patient data:', error);
        throw error;
    }
};
