"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import virginialogo from '@/assets/virginia-logo.png';
import { useSidebarContext } from "@/context/SidebarContext";
import Header from "@/components/header/Header";

export interface AuditTableProps {
    dateTimeAdded: string;
    employeeNo: string;
    userType: string;
    userEmail: string;
    actionEvent: string;
}

interface AuditLogPageProps {
    fileData: AuditTableProps[];
}

const AccountProfilePage = () => {
const { isOpen, setIsOpen } = useSidebarContext();

return (
        <div className='w-full h-screen flex flex-col items-center'>
            <div className="relative w-full h-[200px]">
                <div className="absolute w-full h-[50%] bg-[#FF0000] border-[5px] border-[#A60000] rounded-b-[100px]"></div>
                <div className="absolute flex justify-center items-center w-[15%] h-[70%] top-[30px] left-1/2 -translate-x-1/2 bg-[#FF0000] border-[10px] border-[#A60000] rounded-[50%]">
                    <Image src={virginialogo} alt={'Hotdog Logo'} className='flex w-[160px] cursor-pointer' />
                </div>
            </div>
        </div>
    );
}

export default AccountProfilePage