"use client";

import React, { useState } from 'react';
// import Header from '@/components/header/Header';
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
        <div className="w-full">
            {/* <div>
                <Header icon={RiShieldUserFill} title="User Management"></Header>
            </div> */}
            <div className="flex flex-col w-auto h-auto m-8 ml-[6.5rem] mr-[7.5rem] rounded-lg bg-white shadow-md shadow-gray-300">
                
                {/* Menu Toggle */}
                <div className="flex w-full h-full text-[1.5em] text-[#676767c1] bg-white font-semibold items-center border-solid border-b-[3px] border-gray-400 rounded-t-lg">
                    <div
                        className={`w-[10rem] h-[4rem] text-center rounded-t-lg ${activePage === 'accounts' ? 'bg-[#D9D9D9]' : 'bg-white'}`}
                        onClick={() => setActivePage('accounts')}
                    >
                        <p className='mt-[1rem]'>Accounts</p>
                    </div>
                    <div
                        className={`w-[15rem] h-[4rem] text-center rounded-t-lg ${activePage === 'passwordRequests' ? 'bg-[#D9D9D9]' : 'bg-white'}`}
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
