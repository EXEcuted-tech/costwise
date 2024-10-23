import { useState, useEffect } from "react";
import { NotificationItem, NotificationItemProps } from "./NotificationItem";
import api from "@/utils/api";

interface DateSectionProps {
    date: string;
    notifications: NotificationItemProps[];
    showMarkAllRead: boolean;
}

export const DateSection: React.FC<DateSectionProps> = ({ date, notifications, showMarkAllRead }) => {
    const [localNotifications, setLocalNotifications] = useState<NotificationItemProps[]>([]);

    useEffect(() => {
        const sortedNotifications = [...notifications].sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        setLocalNotifications(sortedNotifications);
    }, [notifications]);

    const handleMarkAllAsRead = async () => {
        try {
            await api.post('/notifications/mark_all_as_read');
            window.location.reload();
            // setLocalNotifications(prevNotifications => {
            //     const updatedNotifications = prevNotifications.map(notification => ({ ...notification, isRead: 1 }));
            //     return updatedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            // });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return (
        <div className="mb-2">
            <div className="flex justify-between items-center border-b border-[#A0A0A0] px-[20px] py-[5px]">
                <h2 className="uppercase text-[20px] font-bold text-[#ABABAB]">{date}</h2>
                {showMarkAllRead && (
                    <button
                        className="text-[#ABABAB] font-bold hover:underline hover:text-[#919191] transition-colors duration-300 ease-in-out"
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            {localNotifications.length > 0 ? (
                localNotifications.map((notification, index) => (
                    <NotificationItem key={index} {...notification} />
                ))
            ) : (
                <div className="text-center py-4 text-[#ABABAB]">No notifications</div>
            )}
        </div>
    );
};