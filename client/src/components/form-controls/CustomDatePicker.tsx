import React, { useRef, useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { IoCalendarSharp } from "react-icons/io5";

const CustomDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={dateInputRef}
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="absolute top-[25px] opacity-0 w-0 h-0"
        required
      />
      <div className="relative">
        <input
          type="text"
          value={selectedDate}
          placeholder="Date/Period"
          className="w-full pl-10 pr-10 bg-white border border-[#868686] text-[#5C5C5C] placeholder-[#B0B0B0] text-[15px] rounded-[5px] py-[3px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
          readOnly
          onClick={openDatePicker}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IoCalendarSharp className="text-[#868686] text-[22px]" />
        </div>
        <div
          onClick={openDatePicker}
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        >
          <AiOutlineDown className="text-[#868686] text-[15px]" />
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;
