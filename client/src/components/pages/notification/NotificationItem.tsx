"use client"
import { useState } from "react";
import { FaUser, FaFileAlt } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { AiFillNotification } from "react-icons/ai";
import { PiFilesFill } from "react-icons/pi";
import { IoIosCreate } from "react-icons/io";
import api from "@/utils/api";

export interface NotificationItemProps {
  id: string;
  icon: string;
  mainText: string;
  subText: string;
  time: string;
  timestamp: string;
  isRead: number;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ id, icon, mainText, subText, time, isRead }) => {
  const [read, setRead] = useState(isRead === 0 ? false : true);

  const onMarkAsRead = async () => {
    setRead(!read)
    try {
      const response = await api.post('/notifications/mark_as_read', {
        log_id: id
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  return (
    <div className={`${read && 'bg-[#EAF4FF]'} flex items-center px-[20px] py-[10px] border-b`}>
      {/* {icon === 'user' && <FaUser className="size-8 mr-4 text-[#0068A3] drop-shadow" />} */}
      {icon === 'crud' && <IoIosCreate className="size-8 mr-4 text-[#0068A3]" />}
      {icon === 'import' && <FaFileAlt className="size-8 mr-4 text-black" />}
      {icon === 'export' && <PiFilesFill className="size-8 mr-4 text-black" />}
      {icon === 'stock' && <GiShoppingCart className="size-8 mr-4 text-[#F6D048]" />}
      {icon === 'general' && <AiFillNotification className="size-8 mr-4 text-[#F6D048]" />}
      <div className="flex-grow hover:cursor-pointer" onClick={onMarkAsRead}>
        <p className="text-[#757575]">{mainText}<span className="font-light">‎ {subText}</span></p>
        <p className="text-[13px] text-[#757575] font-light">{time}</p>
      </div>
    </div>
  );
} 