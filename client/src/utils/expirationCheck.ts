import axios from 'axios';
import { parseISO, isAfter } from 'date-fns';
import config from '@/server/config';
import api from './api';
import { removeTokens } from './removeTokens';

export const isTokenExpired = (): boolean => {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    if (!expiresAt) return false;
    // console.log("Went Here", expiresAt, isAfter(new Date(), parseISO(expiresAt)));
    return isAfter(new Date(), parseISO(expiresAt));
};

export const refreshToken = async (): Promise<boolean> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${config.API}/api/refresh`, null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });
        if (response.data.status != 401) {
            const { access_token, refresh_token, access_token_expiration } = response.data;
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('tokenExpiresAt', access_token_expiration);
        } else {
            console.log("Log you out on Protected Route 3:");
            localStorage.clear();
            await removeTokens();
            window.location.href = '/'; 
        }

        return true;
    } catch (error) {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${config.API}/api/refresh`, null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });
        if (response.data.status != 401) {
            const { access_token, refresh_token, access_token_expiration } = response.data;
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('tokenExpiresAt', access_token_expiration);
        } 
        return true;
        // console.log("Log you out on Protected Route 4:");
        // localStorage.clear();
        // await removeTokens();
        // window.location.href = '/'; 
        // return false;
    }
};

export const setupPeriodicTokenRefresh = (intervalMinutes: number = 5) => {
    const checkAndRefreshToken = async () => {
      if (isTokenExpired()) {
        console.log("Periodic token refresh triggered");
        const refreshed = await refreshToken();
        if (!refreshed) {
          console.log("Periodic refresh failed, logging out");
          localStorage.clear();
          await removeTokens();
          window.location.href = '/';
        }
      }
    };
  
    // Initial check
    checkAndRefreshToken();
  
    // Set up interval for periodic checks
    const intervalId = setInterval(checkAndRefreshToken, intervalMinutes * 60 * 1000);
  
    // Return a function to clear the interval when needed
    return () => clearInterval(intervalId);
  };