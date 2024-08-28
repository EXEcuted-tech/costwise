"use client"
import React, { useEffect, useState } from "react";
import background from '@/assets/account-profile-bg.png';
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
        <div className='w-full h-screen'>
            <div className="w-full h-[200px]">
                <div className='w-full h-[50%] bg-primary border-[5px] border-[#A60000] rounded-b-[100px]'></div>
            </div>
            <p>hello</p>
        </div>
    );
}

export default AccountProfilePage