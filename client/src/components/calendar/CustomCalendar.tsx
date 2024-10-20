import { useSidebarContext } from '@/contexts/SidebarContext';
import React, { useState } from 'react';
import { BsCalendarDateFill, BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import AddEventModal from '../modals/AddEventModal';

type CustomCalendarProps = {
    className?: string;
}

type Event = {
    date: Date;
    title: string;
    description: string;
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({ className }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { isOpen, isAdmin } = useSidebarContext();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handlePreviousMonth = () => {
        setCurrentDate(prevDate => {
            const prevMonth = prevDate.getMonth() - 1;
            return new Date(prevDate.getFullYear(), prevMonth, 1);
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => {
            const nextMonth = prevDate.getMonth() + 1;
            return new Date(prevDate.getFullYear(), nextMonth, 1);
        });
    };

    const handleDayClick = (day: number) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(clickedDate);
        setIsModalOpen(true);
    };

    const handleAddEvent = (event: Event) => {
        setEvents([...events, event]);
        
        setIsModalOpen(false);
    };

    const isEventDay = (day: number) => {
        return events.some(event =>
            event.date.getDate() === day &&
            event.date.getMonth() === currentMonth &&
            event.date.getFullYear() === currentYear
        );
    };

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const numberOfDays = daysInMonth(currentMonth, currentYear);
    const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

    return (
        <>
            <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
                <div className="bg-primary text-center p-[10px] flex justify-between items-center">
                    <span className={`${isOpen ? 'text-[12px] 2xl:text-[15px] 3xl:text-[22px]' : 'text-[16px] 2xl:text-[22px] 3xl:text-[28px]'} flex items-center ml-[15px] text-white font-bold`}>
                        <BsCalendarDateFill className='text-white mr-[6px]' />
                        {monthNames[currentMonth]} {currentYear}
                    </span>
                    <div className='flex gap-1 mr-[15px]'>
                        <button
                            onClick={handlePreviousMonth}
                            className="hover:animate-shake-tilt"
                        >
                            <MdOutlineKeyboardArrowLeft className={`${isOpen ? 'text-[12px] 2xl:text-[15px] 3xl:text-[30px]' : 'text-[16px] 2xl:text-[30px]'} text-white hover:brightness-90`} />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="hover:animate-shake-tilt"
                        >
                            <MdOutlineKeyboardArrowRight className={`${isOpen ? 'text-[12px] 2xl:text-[15px] 3xl:text-[30px]' : 'text-[16px] 2xl:text-[30px]'} text-white hover:brightness-90`} />
                        </button>
                    </div>
                </div>
                <div className={`${isOpen ? 'text-[10px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'} grid grid-cols-7 gap-2 text-center px-4 pt-4`}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <span key={day} className="font-bold text-gray-600">
                            {day}
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center p-4">
                    {daysArray.map((day) => (
                        <span
                            key={day}
                            className={`text-[12px] 2xl:text-[16px] py-2 hover:bg-gray-200 font-medium rounded-full transition-colors cursor-pointer
                            ${isEventDay(day) ? 'bg-blue-200 hover:bg-blue-300' : ''}`}
                            onClick={() => handleDayClick(day)}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <AddEventModal
                    date={selectedDate!}
                    onClose={() => setIsModalOpen(false)}
                    onAddEvent={handleAddEvent}
                />
            )}
        </>
    );
};

export default CustomCalendar;
