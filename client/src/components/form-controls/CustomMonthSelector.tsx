import React from 'react';

interface MonthOption {
    display: string;
    value: string;
}

interface CustomMonthSelectorProps {
    months: MonthOption[];
    onMonthSelect: (month: string) => void;
};

const CustomMonthSelector:React.FC<CustomMonthSelectorProps> = ({months, onMonthSelect}) => {

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = e.target.value;
        onMonthSelect(selectedMonth); 
    };

    return (
        <div className='relative w-full font-lato z-[1000]'>
            <div className='w-full rounded-[20px] border border-[#B6B6B6] bg-white dark:bg-[#3c3c3c] text-[#868686] cursor-pointer p-3'>
                <div className='flex text-[19px] flex-wrap items-center w-full'>
                    <select
                        onChange={handleMonthChange}
                        className='min-w-[150px] flex-grow outline-none focus:ring-0 border-none pr-4 pl-1 dark:bg-[#3c3c3c]'>
                            <option selected value="" disabled hidden>Choose month...</option>
                            {months.map((month, index) => (
                                <option key={index} value={month.value} className='dark:text-[#d1d1d1]'>{month.display}</option>
                            ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default CustomMonthSelector;