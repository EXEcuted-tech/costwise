import { NotificationItem, NotificationItemProps } from "./NotificationItem";

interface DateSectionProps {
    date:string;
    notifications: NotificationItemProps[];
    showMarkAllRead: boolean;
}

export const DateSection:React.FC<DateSectionProps> = ({ date, notifications, showMarkAllRead }) => (
    <div className="mb-2">
        <div className="flex justify-between items-center border-b border-[#A0A0A0] px-[20px] py-[5px]">
            <h2 className="uppercase text-[20px] font-bold text-[#ABABAB]">{date}</h2>
            {showMarkAllRead && (
                <button className="text-[#ABABAB] font-bold hover:underline hover:brightness-90">
                    Mark all as read
                </button>
            )}
        </div>
        {notifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
        ))}
    </div>
);