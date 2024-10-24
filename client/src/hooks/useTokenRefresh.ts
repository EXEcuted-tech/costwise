import { useEffect } from 'react';
import { setupPeriodicTokenRefresh } from '@/utils/expirationCheck';

export const useTokenRefresh = (intervalMinutes: number = 5) => {
  useEffect(() => {
    const clearPeriodicRefresh = setupPeriodicTokenRefresh(intervalMinutes);
    return () => {
      clearPeriodicRefresh();
    };
  }, [intervalMinutes]);
};