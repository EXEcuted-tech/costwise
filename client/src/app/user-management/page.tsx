"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import ManageAccounts from './ManageAccounts';
import PasswordRequests from './PasswordRequests';
import { RiShieldUserFill } from "react-icons/ri";
import { useSidebarContext } from '@/context/SidebarContext';

export interface ManageAccountsProps {
    userName: string;
    userRole: string;
    userEmail: string;
    contactNumber: string;
    department: string;
}

export interface PasswordRequestProps {
    userName: string;
    userRole: string;
    department: string;
    status: string;
    requestDate: string;
}

const UserManagement = () => {
    const [activePage, setActivePage] = useState('accounts');
    
    const { isOpen } = useSidebarContext();
    console.log("sidebar: ", isOpen);

    const renderPage = () => {
        switch (activePage) {
            case 'accounts':
                return <ManageAccounts fileData = {fakeAccountsData} isOpen={isOpen} />;
            case 'passwordRequests':
                return <PasswordRequests fileData = {fakePasswordReqsData} isOpen={isOpen} />;
            default:
                return <ManageAccounts fileData = {fakeAccountsData} isOpen={isOpen} />;
        }
    };

    return (
        <div className="w-full animate-fade-in">
            <div>
                <Header icon={RiShieldUserFill} title="User Management"></Header>
            </div>
            <div className={`${isOpen ? 'w-auto' : '' } flex flex-col max-w-[105rem] h-auto mr-8 ml-[4rem] mt-12 rounded-xl bg-white shadow-md shadow-gray-300`}>
                
                {/* Menu Toggle */}
                <div className="flex w-full h-full text-[1.5em] text-[#000000] bg-white font-semibold items-center border-solid border-b border-[#868686] rounded-t-lg">
                    <div
                        className={`w-[10rem] h-[4rem] text-center rounded-t-lg cursor-pointer  ${activePage === 'accounts' ? 'bg-[#D9D9D9] text-[#676767] border-r-2 border-[#86868649]' : 'bg-white'}`}
                        onClick={() => setActivePage('accounts')}
                    >
                        <p className='mt-[1rem]'>Accounts</p>
                    </div>
                    <div
                        className={`w-[15rem] h-[4rem] text-center rounded-t-lg cursor-pointer ${activePage === 'passwordRequests' ? 'bg-[#D9D9D9] text-[#676767] border-r-2 border-[#86868649]' : 'bg-white'}`}
                        onClick={() => setActivePage('passwordRequests')}
                    >
                        <p className='mt-[1rem]'>Password Request</p>
                    </div>
                </div>
                {renderPage()}
            </div>
        </div>
    );
};

export default UserManagement;

const fakeAccountsData: ManageAccountsProps[] = [
    {
        userName: 'Franz Ondiano',
        userRole: 'Employee',
        userEmail: 'franzondiano@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Marketing'
    },

    {
        userName: 'Tyrone Ybanez',
        userRole: 'Employee',
        userEmail: 'tyroneybanez@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Research and Development'
    },

    {
        userName: 'Kathea Mari C. Mayol',
        userRole: 'Administrator',
        userEmail: 'katheamarimayol@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Accounting'
    },

    {
        userName: 'Hannah Angelica Galve',
        userRole: 'Admin',
        userEmail: 'hannahangelicagalve@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Production'
    },

]

const fakePasswordReqsData: PasswordRequestProps[] = [
    {
        userName: 'Franz Ondiano',
        userRole: 'Employee',
        department: 'Accounting',
        status: 'Pending',
        requestDate: '01/01/2024'
    },

    {
        userName: 'Tyrone Ybanez',
        userRole: 'Employee',
        department: 'Research and Development',
        status: 'Expired',
        requestDate: '12/12/2024'
    },

    {
        userName: 'Kathea Mari C. Mayol',
        userRole: 'Administrator',
        department: 'Marketing',
        status: 'Expired',
        requestDate: '01/01/2024'
    },

    {
        userName: 'Hannah Angelica Galve',
        userRole: 'Admin',
        department: 'Accounting',
        status: 'Pending',
        requestDate: '01/01/2024'
    },
]