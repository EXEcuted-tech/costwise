import React, { useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import useOutsideClick from '@/hooks/useOutsideClick';

interface CustomCompareSelectProps {
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOptions: string[];
}

const CustomCompareSelect: React.FC<CustomCompareSelectProps> = ({
  setSelectedOptions,
  selectedOptions,
}) => {
  const ref = useOutsideClick(() => setIsDropdownOpen(false));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [edited, setEdited] = useState(false);

  const options = [
    { number: '34-222-V', description: 'HOTDOG1K' },
    { number: '34-223-V', description: 'HOTDOG1K' },
    { number: '34-224-V', description: 'HOTDOG1K' },
    { number: '35-111-V', description: 'BEEF LOAF 100g' },
    { number: '35-112-V', description: 'BEEF LOAF 100g' },
    { number: '35-113-V', description: 'BEEF LOAF 100g' },
  ];

  const handleOptionClick = (option: { number: string; description: string }) => {
    const optionText = `${option.description} (${option.number})`;
    if (!selectedOptions.includes(optionText)) {
      setSelectedOptions((prevOptions) => [...prevOptions, optionText]);
      setInputValue('');
    }
  };

  const handleInputChange = (value: string) => {
    // let currentText = e.target.textContent || '';

    // selectedOptions.forEach(option => {
    //   currentText = currentText.replace(option, '').trim();
    // });

    setInputValue(value);
    setEdited(true);
    setIsDropdownOpen(true);
  };

  const filteredOptions = options.filter(
    (option) =>
      option.description.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.number.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full font-lato z-[1000]">
      <div
        className="w-full rounded-[20px] border border-[#B6B6B6] bg-white text-[#5C5C5C] cursor-pointer p-3"
        onClick={() => {
          setEdited(true);
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        {!edited ? (
          <span className="text-[#AAAAAA] text-[20px]">Select or type the formulas you want to compare...</span>
        ) : (
          <div className='w-full'>
            {selectedOptions.length > 0 && `${selectedOptions.join(', ')}, `}
            <input type="text"
              className={`${selectedOptions.length > 0 ? 'w-fit' : 'w-full'} outline-none focus:ring-0 border-none pr-4`}
              onChange={(e) => handleInputChange(e.target.value)}
              value={inputValue} />
          </div>
        )}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <AiOutlineDown className="text-[#868686] text-[15px]" />
        </div>
      </div>
      {isDropdownOpen && (
        <div id="scroll-style" className="animate-pull-down absolute w-full bg-white z-10 mt-1 border border-[#868686] drop-shadow rounded-[10px] max-h-[200px] overflow-y-auto">
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
