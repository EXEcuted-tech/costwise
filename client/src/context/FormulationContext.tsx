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

  return (
    <FormulationContext.Provider value={{ edit, setEdit, add, setAdd, viewFormulas, setViewFormulas, setViewBOM, viewBOM }}>
      {children}
    </FormulationContext.Provider>
  );
};
