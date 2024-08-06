import { createContext, useContext, useState, ReactNode } from 'react';

const DrawerContext = createContext<LayoutProps | undefined>(undefined);

export interface LayoutProps {
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  drawerOpen?: boolean;
}

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawerContext must be used within a DrawerProvider');
  }
  return context;
};

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ drawerOpen, setDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};