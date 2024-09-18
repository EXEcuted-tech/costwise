import { createContext, useContext, useState, ReactNode } from 'react';

const UserContext = createContext<UserProps | undefined>(undefined);

type User = {
    userId: number;
    empNum: string;
    name: string; // Can be full name if needed najud
    email: string;
    userType: 'Regular' | 'Admin';
    displayPicture: string;
}

export interface UserProps {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within an UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ currentUser,setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
