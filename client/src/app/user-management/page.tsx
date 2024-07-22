"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import ManageAccounts from './ManageAccounts';
import PasswordRequests from './PasswordRequests';
import { RiShieldUserFill } from "react-icons/ri";

const UserManagement = () => {
    const [activePage, setActivePage] = useState('accounts');

    const renderPage = () => {
        switch (activePage) {
            case 'accounts':
                return <ManageAccounts />;
            case 'passwordRequests':
                return <PasswordRequests />;
            default:
                return <ManageAccounts />;
        }
    };

    return (
        <div className="w-full animate-fade-in">
            <div>
                <Header icon={RiShieldUserFill} title="User Management"></Header>
            </div>
            <div className="flex flex-col w-auto h-auto m-8 ml-[6.5rem] mr-[7.5rem] mt-12 rounded-xl bg-white shadow-md shadow-gray-300">
                
                {/* Menu Toggle */}
                <div className="flex w-full h-full text-[1.5em] text-[#000000] bg-white font-semibold items-center border-solid border-b-[2px] border-[#868686] rounded-t-lg">
                    <div
                        className={`w-[10rem] h-[4rem] text-center rounded-t-lg cursor-pointer  ${activePage === 'accounts' ? 'bg-[#D9D9D9] text-[#676767]' : 'bg-white'}`}
                        onClick={() => setActivePage('accounts')}
                    >
                        <p className='mt-[1rem]'>Accounts</p>
                    </div>
                    <div
                        className={`w-[15rem] h-[4rem] text-center rounded-t-lg cursor-pointer ${activePage === 'passwordRequests' ? 'bg-[#D9D9D9] text-[#676767]' : 'bg-white'}`}
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
