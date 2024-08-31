import React, { useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { FaFile } from 'react-icons/fa';
import useOutsideClick from '@/hooks/useOutsideClick';

interface CustomSelectProps {
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
    selectedOption: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ setSelectedOption, selectedOption }) => {
    const ref = useOutsideClick(() => setIsDropdownOpen(false));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLabel, setShowLabel] = useState('');

    const options = [
        { value: 'all', label: 'All Files' },
        { value: 'masterfile', label: 'Master Files' },
        { value: 'transactions', label: 'Transactional Files' }
    ];

    const handleOptionClick = (option: { value: string; label: any; }) => {
        setSelectedOption(option.value);
        setShowLabel(option.label);
        setIsDropdownOpen(false);
    };

    return (
        <div ref={ref} className="relative w-full">
            <div
                className="w-full rounded-[5px] border border-[#868686] pl-[30px] pr-[30px] py-[2.5px] bg-white text-[#5C5C5C] cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <span className={selectedOption ? "" : "text-[#B0B0B0]"}>
                    {showLabel || "All Files"}
                </span>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaFile className="text-[#868686] text-[15px]" />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <AiOutlineDown className="text-[#868686] text-[15px]" />
                </div>
            </div>
            {isDropdownOpen && (
                <div className="animate-pull-down absolute w-full mt-1 rounded-[5px] border border-[#868686] bg-white z-10">
                    {options.map((option, index) => (
                        <div
                            key={option.value}
                            onClick={() => handleOptionClick(option)}
                            className={`
                                text-[#5C5C5C] px-4 py-[8px] hover:bg-gray-100 cursor-pointer
                                ${index !== options.length - 1 && 'border-b-1 border-[#B0B0B0]'}
                                `}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
