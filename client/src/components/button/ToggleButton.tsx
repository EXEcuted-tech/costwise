import React, { useState } from 'react';

interface ToggleButtonProps {
  initialState?: boolean;
  onToggle?: (state: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ initialState = false, onToggle }) => {
  const [isOn, setIsOn] = useState(initialState);

  const toggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div
      onClick={toggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isOn ? 'bg-[#077B5A]' : 'bg-gray-300 dark:bg-[#3C3C3C]'
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? 'translate-x-6' : ''
        }`}
      />
    </div>
  );
};

export default ToggleButton;
