import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 50000,
  withCredentials: true
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Session expired');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
