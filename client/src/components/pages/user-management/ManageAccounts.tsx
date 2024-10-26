"use client";
import React, { useState } from 'react';
import { MdModeEdit } from "react-icons/md";
import EditUserInfo from '@/components/modals/EditUserInfo';
import { FaUserLargeSlash } from "react-icons/fa6";
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { User } from '@/types/data';
import Spinner from '@/components/loaders/Spinner';
import ConfirmDeleteUser from '@/components/modals/ConfirmDeleteUser';
import { useUserContext } from '@/contexts/UserContext';
import Alert from '@/components/alerts/Alert';
import { HiArchiveBoxXMark } from 'react-icons/hi2';

interface ManageAccountsPageProps {
    fileData: User[];
    isOpen?: boolean;
    isLoading: boolean;
    selectedUser: User;
    setSelectedUser: React.Dispatch<React.SetStateAction<User>>;
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageAccounts: React.FC<ManageAccountsPageProps> = ({ 
    fileData, 
    isOpen, 
    isLoading, 
    selectedUser, 
    setSelectedUser, 
    setIsEditModalOpen,
    setIsDeleteModalOpen }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fileData.slice(indexOfFirstItem, indexOfLastItem);

    const [errorMsg, setErrorMsg] = useState<string>('');
    const { currentUser } = useUserContext();
    const sysRoles = currentUser?.roles;

    const openEditModal = (user: User) => {
        if (!sysRoles?.includes(1)) {
            setErrorMsg('You are not authorized to edit users.');
            return;
        }
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };


    const openDeleteModal = (user: User) => {
        if (!sysRoles?.includes(3)) {
            setErrorMsg('You are not authorized to archive users.');
            return;
        }
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            {errorMsg && <Alert setClose={() => setErrorMsg('')} variant='critical' message={errorMsg} />}
            {/* Modals */}
            <div className="flex flex-col w-auto h-[44rem] rounded-lg shadow-md shadow-gray-300 dark:shadow-gray-800 dark:bg-[#3C3C3C] ">
                {/* Main Content */}
                <div className="animate-fade-in3 flex flex-col w-auto rounded-t-xl dark:bg-[#3C3C3C] dark:text-[#d1d1d1] h-[38rem] xl:h-[40rem] 2xl:h-[38rem] 3xl:h-[38rem] 4xl:h-[38rem]">
                    <table className="w-full h-[5rem] rounded-t-xl text-left">
                        <thead className="bg-[#F3F3F3] dark:bg-[#5C5C5C] border-b rounded-t-xl border-[#868686]">
                            <tr className={`${isOpen ? 'text-[16px] 3xl:text-[1.2em] 2xl:text-[1.1em]' : 'text-[16px] 3xl:text-[1.2em] 2xl:text-[1.1em]'} text-[#6B6B6B] dark:text-[#d1d1d1]`}>
                                <th className={`${isOpen ? 'pl-[2rem] 4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[14rem] xl:w-[8rem]' : 'pl-8 w-[20rem] 4xl:w-[20rem] 3xl:w-[15rem] 2xl:w-[14rem] xl:pl-6'} py-4`}
                                >Name</th>
                                <th className={`${isOpen ? 'w-[10rem] 4xl:w-[10rem] 3xl:w-[7rem] 2xl:w-[8rem] xl:w-[6rem]' : 'w-[15rem] 4xl:w-[10rem] 3xl:w-[10rem] 2xl:w-[8rem] xl:w-[7rem]'} py-4 `}
                                >Position</th>
                                <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[12rem] xl:w-[12rem]' : '4xl:w-[15rem] xl:w-[15rem]'} py-4`}>
                                    Email</th>
                                <th className={`${isOpen ? '4xl:w-[13rem] 3xl:w-[12rem] 2xl:w-[14rem] xl:w-[12rem]' : '4xl:w-[13rem] 2xl:w-[10rem] xl:w-[13rem]'} py-4`}>
                                    Contact Number</th>
                                <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[9rem] xl:w-[10rem]' : ' 4xl:w-[15rem] 3xl:w-[15rem] 2xl:w-[13rem] xl:w-[8rem]'} w-[15rem] py-4`}>
                                    Department</th>
                                <th className={`${isOpen ? 'w-[10rem] 4xl:w-[10rem] 3xl:w-[7rem] 2xl:w-[8rem] xl:w-[6rem]' : 'w-[15rem] 4xl:w-[10rem] 3xl:w-[10rem] 2xl:w-[8rem] xl:w-[7rem]'} w-[15rem] py-4`}>
                                    Role</th>
                                <th className={`${isOpen ? 'pl-[1rem]' : 'pl-[3rem] xl:pl-[2rem] '} py-4 w-[12%]`}
                                >Manage</th>
                            </tr>
                        </thead>
                        <tbody className='dark:bg-[#3C3C3C]'>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="text-center pt-[15rem]">
                                        <div className='flex justify-center items-center'>
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : fileData.length > 0 ? (
                                currentListPage.map((data, index) => (
                                    <tr key={index} className={`${isOpen ? 'text-[1.1em] 4xl:text-[1.1em] 3xl:text-[0.9em] 2xl:text-[0.8em] xl:text-[0.7em]' : 'text-[1.2em] 4xl:text-[1.2em] 3xl:text-[1.2em] 2xl:text-[1.1em] xl:text-[1em]'} border-b border-[#868686] dark:bg-[#3C3C3C] hover:bg-gray-50`}>
                                        <td className={`${isOpen ? 'pl-[2rem]' : 'pl-8 xl:pl-6'} break-words capitalize`}>{data.first_name} {data.middle_name} {data.last_name}</td>
                                        <td className="py-5 break-words capitalize">{data.position}</td>
                                        <td className="py-4 break-words">{data.email_address}</td>
                                        <td className="py-4 break-words">{data.phone_number}</td>
                                        <td className="py-4 break-words capitalize">{data.department}</td>
                                        <td className="py-4 break-words capitalize">{data.user_type}</td>
                                        <td className={`${isOpen ? 'pl-[1rem] 2xl:pr-2 xl:pr-2' : 'pl-[3rem] xl:pl-[2rem] xl:pr-2'}`}>
                                            <div className="flex">
                                                <button
                                                    onClick={() => openEditModal(data)}
                                                    className={`${isOpen ? '4xl:w-[3rem] 4xl:px-3 3xl:w-[2rem] 3xl:px-2 2xl:w-[2rem] 2xl:px-[10px] xl:w-[2rem] xl:px-[10px]' : ' 4xl:w-[3rem] 4xl:px-3 3xl:w-[3rem] 3xl:px-4 xl:w-[2rem] xl:px-2'} w-[3rem] h-[2rem] px-3 text-[1.1em] bg-[#FF7A00] text-white mr-2 rounded-lg flex justify-center items-center hover:bg-[#de7e24] transition-colors duration-300 ease-in-out`}>
                                                    <MdModeEdit />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(data)}
                                                    className={`${isOpen ? '4xl:w-[3rem] 4xl:px-[12px] 3xl:w-[2rem] 3xl:px-[8px] 2xl:w-[2rem] 2xl:px-[8px] xl:w-[2rem] xl:px-[8px]' : '4xl:w-[3rem] 4xl:px-[12px] 3xl:w-[3rem] 3xl:px-[12px] 2xl:px-[8px] xl:w-[2rem] xl:px-[8px]'} w-[3rem] h-[2rem] text-[1.1em] px-3 bg-[#B22222] text-white flex justify-center items-center rounded-lg hover:bg-[#971c1c] transition-colors duration-300 ease-in-out`}>
                                                    <HiArchiveBoxXMark className='' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center items-center justify-items-center dark:bg-[#3C3C3C] font-semibold pt-[13rem] text-[#555555]">
                                        <FaUserLargeSlash className='text-[85px] mb-4' />
                                        <p className='text-[20px]'>No users to display.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex w-full justify-center h-[5rem] mt-4 rounded-b-xl bg-white dark:bg-[#3C3C3C] border-[#868686]">
                    <PrimaryPagination
                        data={fileData}
                        itemsPerPage={8}
                        handlePageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </>
    );
};

export default ManageAccounts;
