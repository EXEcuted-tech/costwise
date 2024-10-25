"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FaBoxOpen } from "react-icons/fa6";

interface CustomGoodsSelectProps {
  options: { value: number, label: string }[];
  placeholder: string;
  isOpen: boolean;
  onChange: (selectedValue: { name: string, id: number }) => void;
  disabledOptions: { name: string, id: number }[];
}

const CustomGoodsSelect: React.FC<CustomGoodsSelectProps> = ({ options, placeholder, isOpen, onChange, disabledOptions }) => {
  const [selectedOption, setSelectedOption] = useState<{ name: string, id: number } | null>(null);
  const [width, setWidth] = useState<number>(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const [previousSelectedOption, setPreviousSelectedOption] = useState<any>();

  const numberDisabledOptions = disabledOptions.map(option => option.id);
  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.offsetWidth);
    }

  }, [selectedOption]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    const selectedOption = options.find(option => option.value === selectedId);
    if (selectedOption) {
      const newSelectedValue = { name: selectedOption.label, id: selectedOption.value };
      setPreviousSelectedOption(selectedOption);
      setSelectedOption(newSelectedValue);
      onChange(newSelectedValue);
    }
  };

  const [filteredOptions, setFilteredOptions] = useState(numberDisabledOptions);

  useEffect(() => {
    const filtered = filteredOptions.filter(option => {
      return !numberDisabledOptions.includes(option) && !filteredOptions.includes(option);
    });
    setFilteredOptions(filtered);
  }, [])

  const xlWidth = isOpen ? width + 10 : width + 150;
  const defaultWidth = width + 150;
  // const computedWidth = window.innerWidth >= 1280 ? defaultWidth : xlWidth;
  const computedWidth = typeof window !== 'undefined' && window.innerWidth >= 1280 ? width + 150 : width + 10;
  return (
    <div className="relative flex items-center">
      <select
        value={selectedOption?.id || ''}
        onChange={handleChange}
        className={`
          ${isOpen ? 'pl-0 xl:text-[21px] 2xl:text-[26px] 3xl:text-[26px] 4xl:text-[26px]' : 'pl-2'}
          pr-2 bg-transparent uppercase cursor-pointer appearance-none truncate focus:outline-none
        `}
        style={{
          width: `${computedWidth}px`,
          minWidth: `${width}px`,
          transition: 'width 0.3s ease',
        }}
      >
        <option value="" disabled selected className='truncate bg-gray-200 text-gray-600 font-bold flex items-center'>
        📦 {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            className={`${numberDisabledOptions.includes(option.value) && 'font-medium bg-secondary text-gray-700'} text-[#ACACAC] truncate`}
            disabled={numberDisabledOptions.includes(option.value)}>
            {numberDisabledOptions.includes(option.value) && '📋'}{option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
      <span
        ref={textRef}
        className="absolute opacity-0 pointer-events-none whitespace-nowrap"
      >
        {selectedOption?.name || placeholder}
      </span>
    </div>
  );
};

export default CustomGoodsSelect;