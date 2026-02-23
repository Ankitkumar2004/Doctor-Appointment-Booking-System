import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Local backend
});

export default api;
