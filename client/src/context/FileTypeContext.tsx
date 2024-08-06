import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// type FileType = '0' | '1' | '2';

interface FileTypeContextType {
  fileType: number;
  setFileType: React.Dispatch<React.SetStateAction<number>>;
}

const FileTypeContext = createContext<FileTypeContextType | undefined>(undefined);

export function FileTypeProvider({ children }: { children: ReactNode }) {
  const [fileType, setFileType] = useState(0);

  return (
    <FileTypeContext.Provider value={{ fileType, setFileType }}>
      {children}
    </FileTypeContext.Provider>
  );
}

export function useFileType() {
  const context = useContext(FileTypeContext);
  if (context === undefined) {
    throw new Error('useFileType must be used within a FileTypeProvider');
  }
  return context;
}