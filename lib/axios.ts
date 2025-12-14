import axios from 'axios';

// Create a global axios instance
// You can set the baseURL to your backend URL here
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Default Node/Express port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;