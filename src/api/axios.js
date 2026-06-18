import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 50000,
  withCredentials: true
});

let sessionExpiredFired = false;

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!sessionExpiredFired) {
        sessionExpiredFired = true;
        window.dispatchEvent(new Event('session-expired'));
        setTimeout(() => {
          sessionExpiredFired = false;
        }, 3000);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
