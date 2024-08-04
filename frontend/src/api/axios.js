// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Change this to your backend's base URL if different
});

export default instance;
