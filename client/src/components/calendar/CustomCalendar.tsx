import { useSidebarContext } from '@/contexts/SidebarContext';
import React, { useState, useEffect } from 'react';
import { BsCalendarDateFill, BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import AddEventModal from '../modals/AddEventModal';
import ViewEditEventModal from '../modals/ViewEditEventModal';
import api from '@/utils/api';
import { useUserContext } from '@/contexts/UserContext';

type CustomCalendarProps = {
    className?: string;
}

type Event = {
    id: number;
    date: Date;
    title: string;
    description: string;
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({ className }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [todayDate, setTodayDate] = useState<Date>(new Date());
    const [handleToday, setHandleToday] = useState(false);
    const { isOpen, isAdmin } = useSidebarContext();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const { currentUser, setError } = useUserContext();
    const sysRoles = currentUser?.roles;

    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInCurrentMonth = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());


        const calendarArray: (number | null)[] = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarArray.push(null);
        }

        for (let i = 1; i <= daysInCurrentMonth; i++) {
            calendarArray.push(i);
        }

        setCalendarDays(calendarArray);

        setTodayDate(new Date());

        const fetchEvents = async () => {
            try {
                const response = await api.get('/events/retrieve_all');
                if (response.data.status === 200) {
                    setEvents(response.data.data.map((event: any) => {
                        return {
                            id: event.event_id,
                            date: new Date(event.event_date),
                            title: event.title,
                            description: event.description
                        };
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };
        fetchEvents();
    }, [isModalOpen, currentDate]);

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

    const handleDayClick = (day: number | null) => {
        if (day !== null) {
            const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            setSelectedDate(clickedDate);
            const existingEvent = events.find(event => {
                return event.date.getDate() === day &&
                       event.date.getMonth() === currentDate.getMonth() &&
                       event.date.getFullYear() === currentDate.getFullYear();
            });

            if (existingEvent) {
                if (!sysRoles?.includes(13)) {
                    setError('You are not authorized to view this event.');
                    return;
                }
                setSelectedEvent(existingEvent);
                setIsModalOpen(true);
            } else {
                if (clickedDate < today) {
                    setError('Cannot create events for past dates');
                    return;
                }
                if (!sysRoles?.includes(14)) {
                    setError('You are not authorized to create an event.');
                    return;
                }
                setSelectedEvent(null);
                setIsModalOpen(true);
            }
        }
    };

    const handleAddEvent = (event: Event) => {
        setEvents([...events, event]);
        const user = localStorage.getItem('currentUser');
        const parsedUser = JSON.parse(user || '{}');
        
        const formattedDate = event.date.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });

        const auditData = {
            userId: parsedUser?.userId,
            action: 'general',
            act: 'events_create',
            event: event.title,
            date: formattedDate
        };

        api.post('/auditlogs/logsaudit', auditData)
            .then(response => {
            })
            .catch(error => {
            });
        setIsModalOpen(false);
    };

    const isEventDay = (day: number | null) => {
        if (day === null) return false;
        return events.some(event =>
            event.date.getDate() === day &&
            event.date.getMonth() === currentDate.getMonth() &&
            event.date.getFullYear() === currentDate.getFullYear()
        );
    };

    const handleTodayDate = () => {
        setCurrentDate(new Date());
    }

    return (
        <>
            <div className={`bg-white dark:bg-[#3C3C3C] rounded-lg shadow-lg overflow-hidden ${className}`}>
                <div className="bg-primary dark:bg-[#8B0000] text-center p-[10px] flex justify-between items-center">
                    <span className={`${isOpen ? 'text-[12px] 2xl:text-[15px] 3xl:text-[22px]' : 'text-[16px] 2xl:text-[22px] 3xl:text-[28px]'} flex items-center ml-[15px] text-white font-bold`}>
                        <div 
                            title="Click to view today's date."
                            onClick={() => handleTodayDate()}
                            className="flex items-center justify-center w-8 h-8 mr-2 text-[21px] bg-primary border-3 border-white rounded-lg cursor-pointer hover:animate-border-pulse hover:bg-white hover:text-red-600  transition-colors duration-250 ease-in-out"
                        >
                            {todayDate.getDate()}
                        </div>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <div className='flex gap-1 mr-[5px]'>
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
                        <span key={day} className="font-bold text-gray-600 dark:text-gray-200">
                            {day}
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center p-4">
                    {calendarDays.map((day, index) => (
                        <span
                            key={index}
                            title={day !== null ? "Click to view or create an event." : ""}
                            className={`text-[12px] 2xl:text-[16px] py-2 font-medium rounded-full transition-colors cursor-pointer
                            ${day === null ? 'invisible' : ''}
                            ${isEventDay(day) ? 'bg-[#fffbb6] border-secondary border-2 text-black hover:bg-secondary dark:bg-[#fffbb6] dark:text-[#030303] dark:hover:bg-secondary dark:hover:text-black' : ''}
                            ${day === new Date().getDate() && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear() ? 'bg-[#fcbdbd] border-primary border-2 dark:bg-brightness-50 dark:text-black text-black hover:bg-primary hover:text-white' : 'dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            onClick={() => handleDayClick(day)}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </div>
            {isModalOpen && selectedDate && (
                selectedEvent ? (
                    <ViewEditEventModal
                        event={{
                            id: selectedEvent.id,
                            title: selectedEvent.title
                        }}
                        onClose={() => setIsModalOpen(false)}
                    />
                ) : (
                    <AddEventModal
                        date={selectedDate}
                        onClose={() => setIsModalOpen(false)}
                        onAddEvent={(event) => handleAddEvent({
                            ...event,
                            id: 0
                        })}
                    />
                )
            )}
        </>
    );
};

export default CustomCalendar;
