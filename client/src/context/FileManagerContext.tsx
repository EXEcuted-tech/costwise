import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// type FileType = '0' | '1' | '2';

interface FileManagerContextType {
  fileType: number;
  setFileType: React.Dispatch<React.SetStateAction<number>>;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

export function FileManagerProvider({ children }: { children: ReactNode }) {
  const [fileType, setFileType] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <FileManagerContext.Provider value={{ fileType, setFileType, deleteModal, setDeleteModal }}>
      {children}
    </FileManagerContext.Provider>
  );
}

export function useFileManagerContext() {
  const context = useContext(FileManagerContext);
  if (context === undefined) {
    throw new Error('useFileManager must be used within a FileManagerProvider');
  }
  return context;
}