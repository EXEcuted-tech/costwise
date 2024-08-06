import { useState } from 'react';

export default function ClientWrapper({ children }: { children: (props: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return <>{children({ isOpen, setIsOpen })}</>;
}
