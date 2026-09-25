import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically attach JWT token if present in localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('rajarata_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        console.error('Error parsing stored token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;