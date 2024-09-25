import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired, refreshToken } from '@/utils/expirationCheck';
import { removeTokens } from '@/utils/removeTokens';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkAuthAndRedirect = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        removeTokens();
        router.push('/');
        return;
      }

      if (isTokenExpired()) {
        try {
          const refreshed = await refreshToken();
          if (!refreshed) {
            removeTokens();
            router.push('/');
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
      }
    };

    checkAuthAndRedirect();
  }, [router]);
  return children;
}
