import React, { useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import useOutsideClick from '@/hooks/useOutsideClick';

interface CustomCompareSelectProps {
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOptions: string[];
}

const CustomCompareSelect: React.FC<CustomCompareSelectProps> = ({ setSelectedOptions, selectedOptions }) => {
  const ref = useOutsideClick(() => setIsDropdownOpen(false));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const options = [
    { number: '34-222-V', description: 'HOTDOG1K' },
    { number: '34-223-V', description: 'HOTDOG1K' },
    { number: '34-224-V', description: 'HOTDOG1K' },
    { number: '35-111-V', description: 'BEEF LOAF 100g' },
    { number: '35-112-V', description: 'BEEF LOAF 100g' },
    { number: '35-113-V', description: 'BEEF LOAF 100g' },
  ];

  const handleOptionClick = (option: { number: string; description: string }) => {
    setSelectedOptions(prevOptions => [...prevOptions, `${option.description} ${option.number}`]);
    setInputValue('');
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const currentText = e.target.textContent || '';
    console.log(currentText);
    setInputValue(currentText);
    setIsDropdownOpen(true);
  };

    const filteredOptions = options.filter(option =>
        option.description.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.number.toLowerCase().includes(inputValue.toLowerCase())
    );

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="w-full rounded-[20px] border border-[#868686] bg-white text-[#5C5C5C] cursor-pointer p-3"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onInput={handleInputChange}
        contentEditable
        suppressContentEditableWarning={true}
      >
        {selectedOptions.join(', ') + (inputValue ? `, ${inputValue}` : '') || (
          <span className="text-[#B0B0B0]">Select or type the formulas you want to compare...</span>
        )}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <AiOutlineDown className="text-[#868686] text-[15px]" />
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute w-full bg-white z-10 mt-1 border border-[#868686] rounded-[20px] max-h-[200px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(`${option.description} (${option.number})`)}
                  readOnly
                  className="mr-2"
                />
                <span>{option.description} ({option.number})</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCompareSelect;
