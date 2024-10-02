"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import ManageAccounts from '@/components/pages/user-management/ManageAccounts';
import { RiShieldUserFill } from "react-icons/ri";
import { useSidebarContext } from '@/contexts/SidebarContext';
import { IoIosSearch } from 'react-icons/io';
import Link from 'next/link';
import { HiMiniPlus } from 'react-icons/hi2';

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
    const { isOpen } = useSidebarContext();

    return (
        <div className="w-full animate-fade-in">
            <div>
                <Header icon={RiShieldUserFill} title="User Management"></Header>
            </div>

            {/* Search Area */}
            <div className="flex w-auto h-[3.5rem] ml-[2rem] mt-12">
                <div className={`${isOpen ? 'animate-fade-in3' : '' } mt-[0.8em] ml-7 text-gray-600`}>
                    <div className='flex absolute text-[1.3em] text-gray-400 mt-[0.3rem] ml-3'>
                        <IoIosSearch />
                    </div>
                    <input
                        className={` ${isOpen ? 'w-[19rem]' : 'w-[26rem]' } bg-white h-8  px-5 pl-9 text-[1.1em] border border-gray-400 rounded-lg focus:outline-none`}
                        type="search"
                        name="search"
                        placeholder="Search here..."
                    />
                </div>

                <Link href="/user-management/create" className='ml-auto'>
                    <div className='flex w-[7rem] h-8 mt-[0.8em] mr-4 p-2 bg-[#008000] text-white text-center items-center font-semibold rounded-[5px] hover:cursor-pointer hover:bg-[#006900] transition-colors delay-50 duration-[1000] ease-in'>
                        <HiMiniPlus className="text-[1.5em]" /> <p className="text-[1.05em]">Add User</p>
                    </div>
                </Link>
            </div>

            {/* Main Content Area */}
            <div className={`${isOpen ? '' : '' } flex flex-col w-auto mr-[1rem] h-auto ml-[4rem] mt-3 rounded-xl bg-white shadow-md shadow-gray-300`}>
                <ManageAccounts fileData = {fakeAccountsData} isOpen={isOpen} />
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
        userEmail: 'katheamayol@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Accounting'
    },

    {
        userName: 'Hannah Angelica Galve',
        userRole: 'Admin',
        userEmail: 'hannahgalve@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Production'
    },

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
        userEmail: 'katheamayol@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Accounting'
    },

    {
        userName: 'Hannah Angelica Galve',
        userRole: 'Admin',
        userEmail: 'hannahgalve@gmail.com',
        contactNumber: '+63 12321232',
        department: 'Production'
    }
]
