import axios from 'axios';
import config from '@/server/config';

const api = axios.create({
  baseURL: `${config.API}/api`,
});

api.interceptors.request.use((config:any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: any) => {
  return Promise.reject(error);
});

export default api;