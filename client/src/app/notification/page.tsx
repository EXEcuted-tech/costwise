"use client"
import ToggleButton from '@/components/button/ToggleButton'
import Header from '@/components/header/Header'
import { DateSection } from '@/components/pages/notification/DateSection';
import { NotificationItemProps } from '@/components/pages/notification/NotificationItem';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { useNotificationContext } from '@/contexts/NotificationContext';
import api from '@/utils/api';
import { format, formatDistanceToNow, isThisWeek, isToday, isYesterday, parseISO, subMonths } from 'date-fns';
import { SetStateAction, useEffect, useState } from 'react';
import { FaBell } from "react-icons/fa";
import Spinner from '@/components/loaders/Spinner'; // Added import for Spinner component

const NotificationPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const [notifications, setNotifications] = useState({});
    const { hasNewNotifications, setHasNewNotifications } = useNotificationContext();
    const [isOnlyShowUnread, setIsOnlyShowUnread] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Added isLoading state

    const getIconForAction = (action: string | number) => {
        const actionIcons = {
            general: 'general',
            crud: 'crud',
            import: 'import',
            export: 'export'
        } as Record<string, string>;
        return actionIcons[action as keyof typeof actionIcons] || 'bell';
    };

    const getMainTextForAction = (action: string | number) => {
        const actionTexts = {
            general: 'General |',
            crud: 'CRUD |',
            import: 'Import |',
            export: 'Export |'
        } as Record<string, string>;
        return actionTexts[action as keyof typeof actionTexts] || 'Notification';
    };

    const formatTime = (date: Date) => {
        if (isToday(date)) {
            return formatDistanceToNow(date, { addSuffix: true });
        }
        return format(date, 'MMM d, h:mm a');
    };

    useEffect(() => {
        setIsLoading(true); // Set loading to true at the start of data fetching
        const categorizeNotifications = (notifications: any[]) => {
            const categorized: Record<string, any[]> = {};

            const categories = ['TODAY', 'YESTERDAY', 'THIS WEEK', 'THIS MONTH', 'A MONTH AGO', 'OLDER'];
            categories.forEach(category => categorized[category] = []);

            notifications.forEach(notification => {
                const date = parseISO(notification.timestamp);
                let category;

                if (isToday(date)) {
                    category = 'TODAY';
                } else if (isYesterday(date)) {
                    category = 'YESTERDAY';
                } else if (isThisWeek(date)) {
                    category = 'THIS WEEK';
                } else if (date > subMonths(new Date(), 1)) {
                    category = 'THIS MONTH';
                } else if (date > subMonths(new Date(), 2)) {
                    category = 'A MONTH AGO';
                } else {
                    category = 'OLDER';
                }

                categorized[category].push({
                    id: notification.log_id,
                    icon: getIconForAction(notification.action),
                    mainText: getMainTextForAction(notification.action),
                    subText: notification.description,
                    time: formatTime(date),
                    timestamp: date,
                    isRead: notification.read
                });
            });

            Object.keys(categorized).forEach(key => {
                if (categorized[key].length === 0) {
                    delete categorized[key];
                }
            });

            return categorized;
        };

        const fetchNotifications = async () => {
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    const response = await api.get('/notifications/retrieve', {
                        params: {
                            col: 'user_id',
                            val: parsedUser.userId
                        }
                    });
                    const categorizedNotifications = categorizeNotifications(response.data.data);
                    setNotifications(categorizedNotifications);
                    setHasNewNotifications(false);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setIsLoading(false); // Set loading to false after data fetching
            }
        };

        fetchNotifications();
    }, []);

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: SetStateAction<number>) => {
        setCurrentPage(page);
    };

    const dateEntries = Object.entries(notifications);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDateSections = dateEntries.slice(indexOfFirstItem, indexOfLastItem)

    const handleToggle = async (state: boolean) => {
        setIsOnlyShowUnread(!state);

        const categorizeNotifications = (notifications: any[]) => {
            const categorized: Record<string, any[]> = {};

            const categories = ['TODAY', 'YESTERDAY', 'THIS WEEK', 'THIS MONTH', 'A MONTH AGO', 'OLDER'];
            categories.forEach(category => categorized[category] = []);

            notifications.forEach(notification => {
                const date = parseISO(notification.timestamp);
                let category;

                if (isToday(date)) {
                    category = 'TODAY';
                } else if (isYesterday(date)) {
                    category = 'YESTERDAY';
                } else if (isThisWeek(date)) {
                    category = 'THIS WEEK';
                } else if (date > subMonths(new Date(), 1)) {
                    category = 'THIS MONTH';
                } else if (date > subMonths(new Date(), 2)) {
                    category = 'A MONTH AGO';
                } else {
                    category = 'OLDER';
                }

                categorized[category].push({
                    id: notification.log_id,
                    icon: getIconForAction(notification.action),
                    mainText: getMainTextForAction(notification.action),
                    subText: notification.description,
                    time: formatTime(date),
                    timestamp: date,
                    isRead: notification.read
                });
            });

            Object.keys(categorized).forEach(key => {
                if (categorized[key].length === 0) {
                    delete categorized[key];
                }
            });

            return categorized;
        };

        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (state) {
                    const response = await api.get('/notifications/retrieve_unread', {
                        params: {
                            col1: 'user_id',
                            val1: parsedUser.userId,
                            col2: 'read',
                            val2: 0
                        }
                    });

                    const categorizedNotifications = categorizeNotifications(response.data.data);
                    setNotifications(categorizedNotifications);
                } else {
                    const response = await api.get('/notifications/retrieve', {
                        params: {
                            col: 'user_id',
                            val: parsedUser.userId
                        }
                    });
                    const categorizedNotifications = categorizeNotifications(response.data.data);
                    setNotifications(categorizedNotifications);
                    setHasNewNotifications(false);
                }
                setHasNewNotifications(false);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <div>
            <Header icon={FaBell} title="Notifications"></Header>
            <div className='px-[50px] pb-[50px] mt-[36px] ml-[45px]'>
                <div className='w-full flex justify-end'>
                    <span className='text-[#ABABAB] mr-[10px]'>Only show unread</span>
                    <ToggleButton initialState={false} onToggle={handleToggle} />
                </div>
                <div className='bg-white w-full rounded-[20px] drop-shadow-lg mt-[15px]'>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : (
                        <div>
                            {currentDateSections.length > 0 ? (
                                currentDateSections.map(([date, dateNotifications], index) => (
                                    <>
                                        <DateSection
                                            key={date}
                                            date={date}
                                            notifications={dateNotifications as NotificationItemProps[]}
                                            showMarkAllRead={currentPage === 1 && index === 0}
                                        />
                                        {index !== currentDateSections.length - 1 &&
                                            <div className='flex justify-center w-full'>
                                                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14.6667 29.3333H29.3334V16.5H34.8334V34.8333H9.16675V16.5H14.6667V29.3333Z" fill="#C64141" fill-opacity="0.3" />
                                                    <path d="M9.16675 12.834H34.8334V7.33398H9.16675V12.834Z" fill="#B22222" />
                                                </svg>
                                            </div>
                                        }
                                    </>
                                ))
                            ) : (
                                <div className="text-center py-4 text-[24px] text-[#ABABAB]">No notifications to show.</div>
                            )}
                            {currentDateSections.length > 0 && (
                                <div className="relative py-[1%]">
                                    <PrimaryPagination
                                        data={dateEntries}
                                        itemsPerPage={itemsPerPage}
                                        handlePageChange={handlePageChange}
                                        currentPage={currentPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NotificationPage