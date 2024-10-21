import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// type FileType = '0' | '1' | '2';

interface FileManagerContextType {
  fileType: number;
  setFileType: React.Dispatch<React.SetStateAction<number>>;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  addedRowsCount: number;
  setAddedRowsCount: React.Dispatch<React.SetStateAction<number>>;
  fileToDelete: number;
  setFileToDelete: React.Dispatch<React.SetStateAction<number>>;
  fileSettings: string;
  setFileSettings: React.Dispatch<React.SetStateAction<string>>;
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

export function FileManagerProvider({ children }: { children: ReactNode }) {
  const [fileType, setFileType] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addedRowsCount, setAddedRowsCount] = useState(0);
  const [fileToDelete, setFileToDelete] = useState(0);
  const [fileSettings, setFileSettings] = useState('');
  return (
    <FileManagerContext.Provider value={{ fileType, setFileType, deleteModal, setDeleteModal, addedRowsCount, setAddedRowsCount, fileToDelete, setFileToDelete, fileSettings, setFileSettings }}>
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