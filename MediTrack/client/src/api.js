import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ca-doctor-backend.onrender.com', // Deployed backend URL
});

export default api;
