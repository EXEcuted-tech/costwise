import React, { useState, useRef, useEffect } from 'react';

interface CustomGoodsSelectProps {
  options: string[];
  placeholder: string;
  isOpen: boolean;
  onChange: (selectedValue: string) => void;
}

const CustomGoodsSelect: React.FC<CustomGoodsSelectProps> = ({ options, placeholder, isOpen, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [width, setWidth] = useState<number>(0);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.offsetWidth);
    }

  }, [selectedOption]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    onChange(event.target.value);
  };

  const xlWidth = isOpen ? width + 10 : width + 150;
const defaultWidth = width + 150;
const computedWidth = window.innerWidth >= 1280 ? defaultWidth : xlWidth ;

  return (
    <div className="relative flex items-center">
      <select 
        value={selectedOption}
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
        <option value="" disabled selected className='truncate bg-gray-200'>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option} className='text-[#ACACAC] truncate'>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
      <span 
        ref={textRef} 
        className="absolute opacity-0 pointer-events-none whitespace-nowrap"
      >
        {selectedOption || placeholder}
      </span>
    </div>
  );
};

export default CustomGoodsSelect;