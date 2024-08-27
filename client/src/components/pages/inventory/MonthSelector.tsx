import CustomMonthSelector from '@/components/form-controls/CustomMonthSelector';
import { useSidebarContext } from '@/context/SidebarContext';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";

interface ModalProps {
    months: string[];
    onClose: () => void;
    onMonthSelect: (month: string) => void;
};

const MonthSelector:React.FC<ModalProps> = ({months, onClose, onMonthSelect}) => {
    const {isOpen} = useSidebarContext();
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
    };

    const handleSelect = () => {
        if (selectedMonth) {
            onMonthSelect(selectedMonth);
        }
        
    };
    return (
        <div className={`${isOpen ? 'left-52 4xl:left-52 3xl:left-52 2xl:left-52 xl:left-40' : 'left-20'} flex justify-center items-center w-full h-full fixed top-0 left-0 backdrop-brightness-50 z-[1000]`}>
            <div className={`${isOpen ? '4xl:w-[860px] 3xl:w-[820px] 2xl:w-[800px] xl:w-[550px]' : '4xl:w-[860px] 3xl:w-[820px] 2xl:w-[800px] xl:w-[550px]'} px-[35px] mx-[50px] 2xl:mx-0 animate-pop-out bg-white w-[860px] min-h-[210px] mt-[-50px] rounded-[10px]`}>
                <div className='flex justify-between pt-[10px] mb-2'>
                    <div className='flex items-center'>
                        <MdCalendarMonth className='mr-[7px] text-[35px]' />
                        <h1 className='text-[30px] font-black'>Select Month</h1>
                    </div>
                    <IoClose 
                        onClick={onClose}
                        className='text-[40px] text-[#CECECE] cursor-pointer hover:brightness-90 p-0'
                    />
                </div>
                <hr />
                <div className='mt-[17px]'>
                    <CustomMonthSelector months={months} onMonthSelect={handleMonthChange} />
                    <div className='flex justify-end pt-[20px] pb-[20px]'>
                        <div className="relative bg-white overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all group">
                            <button 
                                onClick= {handleSelect}
                                className="text-[18px] font-bold before:ease relative px-[30px] py-[3px] h-full w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-52">        
                                <span className="relative z-10">Select</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonthSelector;