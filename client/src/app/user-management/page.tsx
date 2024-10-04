"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/header/Header';
import ManageAccounts from '@/components/pages/user-management/ManageAccounts';
import { RiShieldUserFill } from "react-icons/ri";
import { useSidebarContext } from '@/contexts/SidebarContext';
import { IoIosSearch } from 'react-icons/io';
import Link from 'next/link';
import { HiMiniPlus } from 'react-icons/hi2';
import api from '@/utils/api';
import { User } from '@/types/data';

const UserManagement = () => { 
    const { isOpen } = useSidebarContext();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    
    useEffect(() => {
        setIsLoading(true);
        
        //Get all users
        api.get<User[]>('/users')
        .then((res) => {
            if (res.status === 200) {
                setUsers(res.data);
                setFilteredUsers(res.data);
                setTimeout(() => {
                    setIsLoading(false);
                  }, 2000);
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.error('Error fetching users:', error);
        })
    }, []);

    //Search function
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredUsers(users);
        }
        else {
            const filtered = users.filter(user =>
                user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);


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
                        placeholder="Search by name, role, or department..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <Link href="/user-management/create" className='ml-auto'>
                    <div className='flex w-[7rem] h-8 mt-[0.8em] mr-7 p-2 bg-[#008000] text-white text-center items-center font-semibold rounded-[5px] hover:cursor-pointer hover:bg-[#006900] transition-colors delay-50 duration-[1000] ease-in'>
                        <HiMiniPlus className="text-[1.5em]" /> <p className="text-[1.05em]">Add User</p>
                    </div>
                </Link>
            </div>

            {/* Main Content Area */}
            <div className={`${isOpen ? '' : '' } flex flex-col w-auto mr-[2rem] h-auto ml-[4rem] mt-5 rounded-xl bg-white shadow-md shadow-gray-300`}>
                <ManageAccounts fileData = {filteredUsers} isOpen={isOpen} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default UserManagement;