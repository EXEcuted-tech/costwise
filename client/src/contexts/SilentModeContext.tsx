"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';

export interface SilentProps {
    silentMode: boolean;
    setSilentMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SilentModeContext = createContext<SilentProps>(
    {
        silentMode: false,
        setSilentMode: () =>{}
    }
);

export const useSilentModeContext = () => {
    const context = useContext(SilentModeContext);
    if (!context) {
      throw new Error('useSilentModeContext must be used within an SilentModeProvider');
    }
    return context;
  };

export const SilentModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [silentMode, setSilentMode] = useState(false);

    useEffect(() => {
        const silentModeFromStorage = localStorage.getItem('silentMode') === 'true';
        setSilentMode(silentModeFromStorage);
    }, []);

    useEffect(() => {
        localStorage.setItem('silentMode', silentMode.toString());
    }, [silentMode]);

    return (
        <SilentModeContext.Provider value={{ silentMode, setSilentMode }}>
            {children}
        </SilentModeContext.Provider>
    );
};
