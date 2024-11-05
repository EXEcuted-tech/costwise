import axios from 'axios';
import config from '@/server/config';
import { isTokenExpired, refreshToken } from './expirationCheck';

const api = axios.create({
  baseURL: `${config.API}/api`,
});

api.interceptors.request.use(
  async (config: any) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && isTokenExpired()) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        throw new Error('Authentication failed');
      }
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;