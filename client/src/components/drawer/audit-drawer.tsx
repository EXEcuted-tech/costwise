"use client"
import { useSidebarContext } from "@/context/SidebarContext";
import { useDrawerContext } from "@/context/DrawerContext";
import Link from "next/link";
import { useState } from "react";
import { MdClose } from "react-icons/md";

interface AuditDrawerProps {
    data: {
        dateTimeAdded: string;
        employeeNo: string;
        userType: string;
        userEmail: string;
        actionEvent: string;
    } | null;
}

const AuditDrawer: React.FC<AuditDrawerProps> = ({ data }) => {
    const { isOpen } = useSidebarContext();
    const { drawerOpen, setDrawerOpen } = useDrawerContext();
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    if (!data) return null;

    const formatDate = (dateTime: string) => {
        const date = new Date(dateTime);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const formatTime = (dateTime: string) => {
        const date = new Date(dateTime);
        const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleTimeString(undefined, options);
    };

    return (
    <div 
        className="fixed w-screen z-[1000] h-full bg-black bg-opacity-50 backdrop-brightness-50 flex justify-end left-0"
        
        onClick={toggleDrawer}
    >
        <div className={`bg-white w-[50%] 2xl:w-[40%] 4xl:w-[30%] h-full p-10 pt-[20px] drop-shadow-2xl`}>
            <div className="flex justify-end">
                <div 
                    className="border-2 p-1 rounded-[5px] cursor-pointer" 
                    onClick={toggleDrawer}
                >
                    <MdClose 
                         
                        className="text-[24px]"
                    />
                </div>
                
            </div>
            <div className="flex flex-col gap-[5px] pb-[10px] font-bold">
                <p className="text-[24px] font-black">Audit Log Details</p>
                <p className="text-[18px] text-[#9B9B9B]">Employee: {data.employeeNo} • {formatDate(data.dateTimeAdded)}</p>
            </div>
            <div className="flex flex-col border-2 text-[17px] p-5 rounded-[10px]">
                <div className="flex text-[20px] font-bold items-center pb-[10px]">
                    <p className="w-[50%]">Field</p>
                    <p className="w-[50%] break-words leading-[20px]">Current Value</p>
                </div>
                <hr className="border-t-[1px] border-[#989898] w-full mx-auto" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">Employee No.</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.employeeNo}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">Email</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.userEmail}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">User Type</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.userType}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">Action/Event</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.actionEvent}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px] items-center">
                    <p className="w-[50%]">Time</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{formatTime(data.dateTimeAdded)}</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default AuditDrawer