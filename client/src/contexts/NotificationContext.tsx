import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  hasNewNotifications: boolean;
  setHasNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [hasNewNotifications, setHasNewNotifications] = useState(false);

  return (
    <NotificationContext.Provider value={{ hasNewNotifications, setHasNewNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}