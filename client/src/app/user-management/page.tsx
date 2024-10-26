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
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import Alert from '@/components/alerts/Alert';
import EditUserInfo from '@/components/modals/EditUserInfo';
import ConfirmDeleteUser from '@/components/modals/ConfirmDeleteUser';

const UserManagement = () => {
    const router = useRouter();
    const { isOpen } = useSidebarContext();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { currentUser } = useUserContext();
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>({} as User);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
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
        if (users.length > 0) {
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
        }
    }, [searchTerm, users]);

    
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            {errorMsg && <Alert setClose={() => setErrorMsg('')} variant='critical' message={errorMsg} />}
            {isEditModalOpen && <EditUserInfo user={selectedUser} onClose={closeEditModal} />}
            {isDeleteModalOpen && <ConfirmDeleteUser user={selectedUser} onClose={closeDeleteModal} />}
            <div className="w-full animate-fade-in3">
                <div>
                    <Header icon={RiShieldUserFill} title="User Management"></Header>
                </div>

                {/* Search Area */}
                <div className="flex w-auto h-[3.5rem] ml-[2rem] mt-12">
                    <div className={`${isOpen ? 'animate-fade-in3' : ''} mt-[0.8em] ml-7 text-gray-600`}>
                        <div className='flex absolute text-[1.3em] text-gray-400 mt-[0.3rem] ml-3'>
                            <IoIosSearch />
                        </div>
                        <input
                            className={` ${isOpen ? 'w-[19rem]' : 'w-[26rem]'} bg-white h-8  px-5 pl-9 text-[1.1em] dark:bg-[#121212] dark:text-white border border-gray-400 rounded-lg focus:outline-none`}
                            type="search"
                            name="search"
                            placeholder="Search by name, role, or department..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className='ml-auto'>
                        <div className='flex w-[7rem] h-8 mt-[0.8em] mr-7 p-2 bg-[#008000] text-white text-center items-center font-semibold rounded-[5px] hover:cursor-pointer hover:bg-[#006900] transition-colors delay-50 duration-[1000] ease-in'
                            onClick={() => {
                                const sysRoles = currentUser?.roles;
                                if (!sysRoles?.includes(0)) {
                                    setErrorMsg('You are not authorized to add users.');
                                    return;
                                }
                                router.push('/user-management/create');
                            }}
                        >
                            <HiMiniPlus className="text-[1.5em]" /> <p className="text-[1.05em]">Add User</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`${isOpen ? '' : ''} flex flex-col w-auto mr-[2rem] h-auto ml-[4rem] mt-5 rounded-xl bg-white shadow-md shadow-gray-300`}>
                    <ManageAccounts 
                        fileData={filteredUsers || []} 
                        isOpen={isOpen} 
                        isLoading={isLoading} 
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        setIsEditModalOpen={setIsEditModalOpen}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                    />
                </div>
            </div>
        </>
    );
};

export default UserManagement;