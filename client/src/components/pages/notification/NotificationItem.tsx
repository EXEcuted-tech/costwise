"use client"
import { useState } from "react";
import { FaUser, FaFileAlt } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";

export interface NotificationItemProps {
    icon: string;
    mainText: string;
    subText:string;
    time: string;
    action: string;
}

export const NotificationItem:React.FC<NotificationItemProps> = ({ icon, mainText, subText, time, action }) => {
    const [read,setRead] = useState(false);

    return(
    <div className={`${read && 'bg-[#EAF4FF]'} flex items-center px-[20px] py-[10px] border-b`}>
      {icon === 'user' && <FaUser className="size-8 mr-4 text-[#0068A3] drop-shadow" />}
      {icon === 'file' && <FaFileAlt className="size-8 mr-4 text-black" />}
      {icon === 'bell' && <GiShoppingCart className="size-8 mr-4 text-[#F6D048]" />}
      <div className="flex-grow hover:cursor-pointer" onClick={()=>{setRead(!read)}}>
        <p className="text-[#757575]">{mainText}<span className="font-light">‎ {subText}</span></p>
        <p className="text-[13px] text-[#757575] font-light">{time} | <span className="font-normal">{action}</span></p>
      </div>
    </div>
  );
} 