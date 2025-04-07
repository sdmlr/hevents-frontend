import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // backend URL
  timeout: 5000,                    // optional: set a timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
