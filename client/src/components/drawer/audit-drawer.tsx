"use client"
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useDrawerContext } from "@/contexts/DrawerContext";
import Link from "next/link";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import useOutsideClick from '@/hooks/useOutsideClick';

enum ActionType {
    General = 'general',
    Crud = 'crud',
    Import = 'import',
    Export = 'export',
    Stock = 'stock'
}

interface AuditDrawerProps {
    data: {
        dateTimeAdded: Date;
        employeeName: string;
        employeeNo: string;
        userType: string;
        userEmail: string;
        description: string;
        actionEvent: ActionType;
        department: string;
    } | null;
}

const AuditDrawer: React.FC<AuditDrawerProps> = ({ data }) => {
    const { isOpen } = useSidebarContext();
    const { drawerOpen, setDrawerOpen } = useDrawerContext();
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);
    const ref = useOutsideClick(() => setDrawerOpen(false));

    if (!data) return null;

    const formatDate = (dateTime: string) => {
        const date = new Date(dateTime);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    // const formatTime = (dateTime: string) => {
    //     const date = new Date(dateTime);
    //     const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    //     return date.toLocaleTimeString(undefined, options);
    // };

    return (
        <>
        {drawerOpen && <div className="animate-fade-in3 fixed w-screen h-full backdrop-brightness-50 flex justify-end left-0 z-[1000]"></div>}
        <div ref={ref} className={`fixed top-0 right-0 h-full p-10 pt-[20px] w-[500px] bg-white dark:bg-[#3C3C3C] z-[1500] drop-shadow transform transition-transform duration-400 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex justify-end">
                <div 
                    className="border-2 p-1 rounded-[5px] cursor-pointer" 
                    onClick={toggleDrawer}
                >
                    <MdClose className="text-[30px] dark:text-white"/>
                </div>
                
            </div>
            <div className="flex flex-col gap-[3px] pb-[10px] font-bold">
                <p className="text-[26px] font-black dark:text-white">Audit Log Details</p>
                <p className="text-[18px] text-[#9B9B9B]">{data.employeeName} ‎ • ‎ {formatDate(data.dateTimeAdded.toLocaleDateString())}</p>
            </div>
            <div className="flex flex-col border-2 text-[17px] p-5 rounded-[10px]">
                <div className="flex text-[20px] font-bold items-center pb-[10px] dark:text-white">
                    <p className="w-[50%]">Field</p>
                    <p className="w-[50%] break-words leading-[20px]">Current Value</p>
                </div>
                <hr className="border-t-[1px] border-[#989898] w-full mx-auto" />
                <div className="flex py-[10px] dark:text-white">
                    <p className="w-[50%]">Employee No.</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.employeeNo}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px] dark:text-white">
                    <p className="w-[50%]">Email</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.userEmail}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px] dark:text-white">
                    <p className="w-[50%]">Department</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.department}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px] dark:text-white">
                    <p className="w-[50%]">User Type</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">{data.userType}</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px] dark:text-white">
                    <p className="w-[50%]">Action/Event</p>
                    <p className="w-[50%] break-words leading-[20px] items-center font-bold uppercase">{data.actionEvent}: <p className="font-normal normal-case">{data.description}</p></p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px] items-center dark:text-white">
                    <p className="w-[50%] dark:text-white">Time</p>
                    <p className="w-[50%] break-words leading-[20px] items-center dark:text-white">{data.dateTimeAdded.toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default AuditDrawer