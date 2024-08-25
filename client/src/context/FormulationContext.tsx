import { createContext, useContext, useState, ReactNode } from 'react';

const FormulationContext = createContext<FormulationContextProps | undefined>(undefined);

interface FormulationContextProps {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
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

  return (
    <FormulationContext.Provider value={{ edit, setEdit }}>
      {children}
    </FormulationContext.Provider>
  );
};
