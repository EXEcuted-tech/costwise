"use client"
import ToggleButton from '@/components/button/ToggleButton'
import Header from '@/components/header/Header'
import { DateSection } from '@/components/pages/notification/DateSection';
import { NotificationItemProps } from '@/components/pages/notification/NotificationItem';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import api from '@/utils/api';
import { format, formatDistanceToNow, isThisWeek, isToday, isYesterday, parseISO } from 'date-fns';
import { SetStateAction, useEffect, useState } from 'react';
import { FaBell } from "react-icons/fa";

const NotificationPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const [notifications, setNotifications] = useState({});
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [isOnlyShowUnread, setIsOnlyShowUnread] = useState(false);

    const getIconForAction = (action: string | number) => {
        // Map actions to icons
        const actionIcons = {
            general: 'general',
            // Add more mappings as needed
        } as Record<string, string>;
        return actionIcons[action as keyof typeof actionIcons] || 'bell';
    };

    const getMainTextForAction = (action: string | number) => {
        // Map actions to main text
        const actionTexts = {
            general: 'General',
            // Add more mappings as needed
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
        const categorizeNotifications = (notifications: any[]) => {
            const categorized: Record<string, any[]> = {};

            notifications.forEach(notification => {
                const date = parseISO(notification.timestamp);
                let category;

                if (isToday(date)) {
                    category = 'TODAY';
                } else if (isYesterday(date)) {
                    category = 'YESTERDAY';
                } else if (isThisWeek(date)) {
                    category = 'THIS WEEK';
                } else {
                    category = 'OLDER';
                }

                if (!categorized[category]) {
                    categorized[category] = [];
                }

                categorized[category].push({
                    id: notification.log_id,
                    icon: getIconForAction(notification.action),
                    mainText: getMainTextForAction(notification.action),
                    subText: notification.description,
                    time: formatTime(date),
                    isRead: notification.read
                });
            });

            return categorized;
        };

        const fetchNotifications = async () => {
            try {
                const response = await api.get('/notifications/retrieve', {
                    params: {
                        col: 'user_id',
                        val: 1 // TODO: get user id from context
                    }
                });
                const categorizedNotifications = categorizeNotifications(response.data.data);
                setNotifications(categorizedNotifications);
                setHasNewNotifications(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [hasNewNotifications]);

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: SetStateAction<number>) => {
        setCurrentPage(page);
    };

    const dateEntries = Object.entries(notifications);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDateSections = dateEntries.slice(indexOfFirstItem, indexOfLastItem)

    const handleToggle = async (state: boolean) => {
        setIsOnlyShowUnread(state);

        const categorizeNotifications = (notifications: any[]) => {
            const categorized: Record<string, any[]> = {};

            notifications.forEach(notification => {
                const date = parseISO(notification.timestamp);
                let category;

                if (isToday(date)) {
                    category = 'TODAY';
                } else if (isYesterday(date)) {
                    category = 'YESTERDAY';
                } else if (isThisWeek(date)) {
                    category = 'THIS WEEK';
                } else {
                    category = 'OLDER';
                }

                if (!categorized[category]) {
                    categorized[category] = [];
                }

                categorized[category].push({
                    id: notification.log_id,
                    icon: getIconForAction(notification.action),
                    mainText: getMainTextForAction(notification.action),
                    subText: notification.description,
                    time: formatTime(date),
                    isRead: notification.read
                });
            });

            return categorized;
        };

        try {
            if (isOnlyShowUnread) {
                const response = await api.get('/notifications/retrieve_unread', {
                    params: {
                        col1: 'user_id',
                        val1: 1, // TODO: get user id from context
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
                        val: 1 // TODO: get user id from context
                    }
                });
                const categorizedNotifications = categorizeNotifications(response.data.data);
                setNotifications(categorizedNotifications);
                setHasNewNotifications(false);
            }
            setHasNewNotifications(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <div>
            <Header icon={FaBell} title="Notifications"></Header>
            <div className='px-[50px] mt-[36px] ml-[45px]'>
                <div className='w-full flex justify-end'>
                    <span className='text-[#ABABAB] mr-[10px]'>Only show unread</span>
                    <ToggleButton initialState={false} onToggle={handleToggle} />
                </div>
                <div className='bg-white w-full rounded-[20px] drop-shadow-lg mt-[15px]'>
                    <div>
                        {currentDateSections.map(([date, dateNotifications], index) => (
                            <>
                                <DateSection
                                    key={date}
                                    date={date}
                                    notifications={dateNotifications as NotificationItemProps[]}
                                // showMarkAllRead={currentPage === 1 && index === 0}
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
                        ))}
                        <div className="relative py-[1%]">
                            <PrimaryPagination
                                data={dateEntries}
                                itemsPerPage={itemsPerPage}
                                handlePageChange={handlePageChange}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationPage

const notifications = {
    TODAY: [
        {
            icon: 'user',
            mainText: 'John Doe and 1 other',
            subText: 'edited your uploaded file BOM_1_Cost.csv.',
            time: '4 minutes ago',
            action: 'View Changes',
        },
        {
            icon: 'bell',
            mainText: 'Order is coming!',
            subText: 'Check inventory reordering schedule.',
            time: '1 hour ago',
            action: 'View Inventory Reordering',
        },
        {
            icon: 'file',
            mainText: 'A new file uploaded.',
            subText: 'Check it on file manager.',
            time: '2 hours ago',
            action: 'View File Manager',
        },
    ],
    YESTERDAY: [
        {
            icon: 'user',
            mainText: 'John Doe and 1 other',
            subText: 'edited your uploaded file BOM_1_Cost.csv.',
            time: 'Apr 13, 8:30 PM',
            action: 'View Changes',
        },
        {
            icon: 'bell',
            mainText: 'Order is coming!',
            subText: 'Check inventory reordering schedule.',
            time: 'Apr 13, 7:10 AM',
            action: 'View Inventory Reordering',
        },
    ],
    '3 DAYS AGO': [
        {
            icon: 'file',
            mainText: 'Monthly report generated.',
            subText: 'View it in the reports section.',
            time: 'Apr 10, 9:00 AM',
            action: 'View Report',
        },
        {
            icon: 'file',
            mainText: 'Monthly report generated.',
            subText: 'View it in the reports section.',
            time: 'Apr 10, 9:00 AM',
            action: 'View Report',
        },
    ],
    'LAST WEEK': [
        {
            icon: 'file',
            mainText: 'Monthly report generated.',
            subText: 'View it in the reports section.',
            time: 'Apr 10, 9:00 AM',
            action: 'View Report',
        },
        {
            icon: 'file',
            mainText: 'Monthly report generated.',
            subText: 'View it in the reports section.',
            time: 'Apr 10, 9:00 AM',
            action: 'View Report',
        },
    ],
};