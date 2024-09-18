import { createContext, useContext, useState, ReactNode } from 'react';

const SidebarContext = createContext<LayoutProps | undefined>(undefined);

export interface LayoutProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
}

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within an SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isAdmin, setIsAdmin }}>
      {children}
    </SidebarContext.Provider>
  );
};
