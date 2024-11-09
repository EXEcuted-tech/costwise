"use client"
import React, { useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import useOutsideClick from '@/hooks/useOutsideClick';
import { BiFoodTag } from "react-icons/bi";

interface CustomGoodsSelectProps {
  options: { value: number, label: string }[];
  placeholder: string;
  onChange: (selectedValue: { name: string, id: number }) => void;
  disabledOptions: { name: string, id: number }[];
}

const CustomGoodsSelect: React.FC<CustomGoodsSelectProps> = ({ options, placeholder, onChange, disabledOptions }) => {
  const [selectedOption, setSelectedOption] = useState<{ name: string, id: number } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [width, setWidth] = useState('27%');
  const ref = useOutsideClick(() => setIsDropdownOpen(false));

  const numberDisabledOptions = disabledOptions.map(option => option.id);

  const handleOptionClick = (option: { value: number, label: string }) => {
    const newSelectedValue = { name: option.label, id: option.value };
    setSelectedOption(newSelectedValue);
    const textLength = option.label.length;
    const newWidth = Math.max(27, Math.min(29, textLength * 1.1));
    setWidth(`${newWidth}%`);
    onChange(newSelectedValue);
    setInputValue('');
    setIsDropdownOpen(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsDropdownOpen(true);
  };

  const filteredOptions = options.filter(
    (option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={ref} className={`relative font-lato z-[1000]`} style={{ width }}>
      <div
        title="Click to open dropdown or type to search"
        className="w-full rounded-lg px-3 text-white bg-primary cursor-pointer hover:bg-white hover:text-[#6B6B6B] hover:animate-pull-down group transition-colors duration-200 ease-in-out dark:bg-[#3C3C3C]"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center w-full">
          <input
            type="text"
            className={`${selectedOption ? 'w-[calc(100%-20px)] text-white group-hover:text-[#6B6B6B]' : 'w-full text-white hover:text-[#6B6B6B] placeholder:text-white group-hover:placeholder:text-[#d1d1d1]'} bg-transparent  outline-none focus:ring-0 border-none pr-4  dark:bg-[#3C3C3C] dark:text-[#d1d1d1] dark:placeholder:text-[#d1d1d1]`}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`🔍 ${placeholder}`}
            value={selectedOption ? `📋 ${selectedOption.name}` : inputValue}
          />
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <AiOutlineDown className="text-white text-[15px] group-hover:text-[#6B6B6B] transition-colors duration-200 ease-in-out" />
        </div>
      </div>

      {isDropdownOpen && (
        <div className="animate-pull-down absolute min-w-full w-max text-[17px] text-[#6B6B6B] bg-white dark:bg-[#3C3C3C] z-10 mt-1 border border-[#B6B6B6] dark:border-[#5C5C5C] dark:text-[#d1d1d1] drop-shadow-lg rounded-l-[10px] rounded-r-[5px] max-h-[180px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center p-2 pl-4 pt-2 hover:bg-gray-100 dark:hover:bg-[#4c4c4c] whitespace-nowrap ${
                  numberDisabledOptions.includes(option.value) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !numberDisabledOptions.includes(option.value) && handleOptionClick(option)}
              >
                <span>{option.label}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-[#6B6B6B] whitespace-nowrap dark:text-[#d1d1d1]">No options found for the month year.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomGoodsSelect;