import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const UserContext = createContext<UserProps | undefined>(undefined);

export type User = {
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

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const parsedUser = JSON.parse(userString);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
