"use client"
import { useState } from "react";
import { FaUser, FaFileAlt } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { AiFillNotification } from "react-icons/ai";
import api from "@/utils/api";

export interface NotificationItemProps {
  id: string;
  icon: string;
  mainText: string;
  subText: string;
  time: string;
  isRead: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ icon, mainText, subText, time, isRead }) => {
  const [read, setRead] = useState(isRead);

  const handleMarkAsRead = async () => {
    if (!read) {
      try {
        // await onMarkAsRead(id);
        setRead(true);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const onMarkAsRead = async (id: string) => {
    try {
      const response = await api.post('/notifications/mark-as-read', {
        log_id: id
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  return (
    <div className={`${read && 'bg-[#EAF4FF]'} flex items-center px-[20px] py-[10px] border-b`}>
      {icon === 'user' && <FaUser className="size-8 mr-4 text-[#0068A3] drop-shadow" />}
      {icon === 'file' && <FaFileAlt className="size-8 mr-4 text-black" />}
      {icon === 'bell' && <GiShoppingCart className="size-8 mr-4 text-[#F6D048]" />}
      {icon === 'general' && <AiFillNotification className="size-8 mr-4 text-[#F6D048]" />}
      <div className="flex-grow hover:cursor-pointer" onClick={() => { setRead(!read) }}>
        <p className="text-[#757575]">{mainText}<span className="font-light">‎ {subText}</span></p>
        <p className="text-[13px] text-[#757575] font-light">{time}</p>
      </div>
    </div>
  );
} 