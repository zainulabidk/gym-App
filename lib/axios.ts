import axios from 'axios';

// Create a global axios instance
// Uses VITE_API_URL env var if available, otherwise falls back to localhost
const api = axios.create({
  // Cast import.meta to any to avoid TS error: Property 'env' does not exist on type 'ImportMeta'
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
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