import { createContext, useContext, useState, ReactNode } from 'react';

const FormulationContext = createContext<FormulationContextProps | undefined>(undefined);

interface FormulationContextProps {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  add: boolean;
  setViewFormulas: React.Dispatch<React.SetStateAction<boolean>>;
  viewFormulas: boolean;
  setViewBOM: React.Dispatch<React.SetStateAction<boolean>>;
  viewBOM: boolean;
  setSelectedBomId: React.Dispatch<React.SetStateAction<number>>;
  selectedBomId: number;
  selectedChoices: number[];
  setSelectedChoices: React.Dispatch<React.SetStateAction<number[]>>;
  bomName: string;
  setBomName: React.Dispatch<React.SetStateAction<string>>;
}

export const useFormulationContext = () => {
  const context = useContext(FormulationContext);
  if (!context) {
    throw new Error('useFormulationContext must be used within an FormulationContextProvider');
  }
  return context;
};

export const FormulationProvider = ({ children }: { children: ReactNode }) => {
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [viewFormulas, setViewFormulas] = useState(false);
  const [viewBOM, setViewBOM] = useState(false);
  const [selectedBomId, setSelectedBomId] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]);
  const [bomName, setBomName] = useState<string>('');

  return (
    <FormulationContext.Provider value={{ edit, setEdit, add, setAdd, viewFormulas, setViewFormulas, setViewBOM, viewBOM, setSelectedBomId, selectedBomId, selectedChoices, setSelectedChoices, bomName, setBomName }}>
      {children}
    </FormulationContext.Provider>
  );
};
