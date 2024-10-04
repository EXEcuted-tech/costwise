import axios from 'axios';
import config from '@/server/config';
import { isTokenExpired, refreshToken } from './expirationCheck';

const api = axios.create({
  baseURL: `${config.API}/api`,
});

// const isTokenExpired = (): boolean => {
//   const expiresAt = localStorage.getItem('tokenExpiresAt');
//   if (!expiresAt) return true;
//   return isAfter(new Date(), parseISO(expiresAt));
// };

// api.interceptors.request.use((config:any) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error: any) => {
//   return Promise.reject(error);
// });

api.interceptors.request.use(
  async (config: any) => {
    const token = localStorage.getItem('accessToken');
    
    // console.log("In api.ts");
    // console.log(token && isTokenExpired());
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