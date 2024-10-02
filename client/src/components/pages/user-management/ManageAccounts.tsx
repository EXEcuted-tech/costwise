"use client";
import React, { useState } from 'react';
import { MdModeEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import EditUserInfo from '@/components/modals/EditUserInfo';
import ConfirmDelete from '@/components/modals/ConfirmDelete';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { User } from '@/types/data';
import { Spinner } from '@nextui-org/react';

interface ManageAccountsPageProps {
    fileData: User[];
    isOpen?: boolean;
    isLoading: boolean;
}

const ManageAccounts: React.FC<ManageAccountsPageProps> = ({ fileData, isOpen, isLoading }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fileData.slice(indexOfFirstItem, indexOfLastItem);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="flex flex-col w-auto h-auto rounded-lg shadow-md shadow-gray-300">
            {/* Main Content */}
            <div className="animate-fade-in3 flex flex-col w-auto h-[35rem]">
                <table className="w-full h-full text-left">
                    <thead className="bg-[#F3F3F3] border-b border-[#868686]">
                        <tr className={`${isOpen ? 'text-[1.1em] 3xl:text-[1em] 2xl:text-[1em] xl:text-[0.9em]' : 'text-[1.3em] 3xl:text-[1.2em] 2xl:text-[1.1em] xl:text-[1em]'} text-[#6B6B6B]`}>
                            <th className={`${isOpen ? 'pl-[2rem] 4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[14rem] xl:w-[8rem]' : 'pl-8 w-[20rem] 4xl:w-[20rem] 3xl:w-[15rem] 2xl:w-[14rem] xl:pl-6'} py-2`}
                                >Name</th>
                            <th className={`${isOpen ? 'w-[10rem] 4xl:w-[10rem] 3xl:w-[7rem] 2xl:w-[8rem] xl:w-[6rem]' : 'w-[15rem] 4xl:w-[10rem] 3xl:w-[10rem] 2xl:w-[8rem] xl:w-[7rem]' } py-2 `}
                                >Position</th>
                            <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[12rem] xl:w-[12rem]' : '4xl:w-[15rem] xl:w-[15rem]' } py-2`}>
                                Email</th>
                            <th className={`${isOpen ? '4xl:w-[13rem] 3xl:w-[10rem] 2xl:w-[12rem] xl:w-[10rem]' : '4xl:w-[13rem] 2xl:w-[10rem] xl:w-[13rem]' } py-2`}>
                                Contact Number</th>
                            <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[9rem] xl:w-[5rem]' : ' 4xl:w-[15rem] 3xl:w-[15rem] 2xl:w-[13rem] xl:w-[5rem]' } w-[15rem] py-2`}>
                                Department</th>
                            <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[9rem] xl:w-[5rem]' : ' 4xl:w-[15rem] 3xl:w-[15rem] 2xl:w-[13rem] xl:w-[5rem]' } w-[15rem] py-2`}>
                                Role</th>
                            <th className={`${isOpen ? 'pl-[1rem]' : 'pl-[3rem] xl:pl-[2rem] '} py-2 w-[12%]`}
                            >Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6">
                                    <Spinner color="danger" size="lg" label="Loading..." />
                                </td>
                            </tr>
                        ) : fileData.length > 0 ? (
                                currentListPage.map((data, index) => (
                                <tr key={index} className={`${isOpen ? 'text-[1.1em] 4xl:text-[1.1em] 3xl:text-[0.9em] 2xl:text-[0.8em] xl:text-[0.7em]' : 'text-[1.2em] 4xl:text-[1.2em] 3xl:text-[1.2em] 2xl:text-[1.1em] xl:text-[1em]' } border-b border-[#868686] hover:bg-gray-50`}>
                                    <td className={`${isOpen ? 'pl-[2rem]' : 'pl-8 xl:pl-6'} py-2 break-words`}>{data.first_name} {data.last_name}</td>
                                    <td className="py-2 break-words">{data.position}</td>
                                    <td className="py-2 break-words">{data.email_address}</td>
                                    <td className="py-2 break-words">{data.phone_number}</td>
                                    <td className="py-2 break-words">{data.department}</td>
                                    <td className="py-2 break-words">{data.user_type}</td>
                                    <td className={`${isOpen ? 'pl-[1rem] 2xl:pr-2 xl:pr-2' : 'pl-[3rem] xl:pl-[2rem] xl:pr-2'} py-2`}>
                                        <div className="flex">
                                            <button
                                                onClick={openEditModal}
                                                className={`${isOpen ? '4xl:w-[3rem] 4xl:px-3 3xl:w-[2rem] 3xl:px-2 2xl:w-[2rem] 2xl:px-[10px] xl:w-[2rem] xl:px-[10px]' : ' 4xl:w-[3rem] 4xl:px-3 3xl:w-[3rem] 3xl:px-4 xl:w-[2rem] xl:px-2' } w-[3rem] h-[2rem] px-3 text-[1.1em] bg-[#FF7A00] text-white mr-2 rounded-lg flex justify-center items-center hover:bg-[#de7e24] transition-colors duration-300 ease-in-out`}>
                                                <MdModeEdit />
                                            </button>
                                            <button
                                                onClick={openDeleteModal}
                                                className={`${isOpen ? '4xl:w-[3rem] 4xl:px-[18px] 3xl:w-[2rem] 3xl:px-[10px] 2xl:w-[2rem] 2xl:px-[10px] xl:w-[2rem] xl:px-[10px]' : ' 4xl:w-[3rem] 4xl:px-[18px] 3xl:w-[3rem] 3xl:px-[18px] xl:w-[2rem] xl:px-[10px]' } w-[3rem] h-[2rem] px-[17px] text-[0.9em] bg-[#B22222] text-white flex justify-center items-center rounded-lg hover:bg-[#971c1c] transition-colors duration-300 ease-in-out`}>
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-6">
                                   No users to display
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {isEditModalOpen && <EditUserInfo onClose={closeEditModal} />}
            {isDeleteModalOpen && <ConfirmDelete onClose={closeDeleteModal} subject="user"/>}

            {/* Footer */}
            <div className="flex w-full justify-center h-[5rem] rounded-b-xl bg-white border-[#868686]">
                <PrimaryPagination
                    data={fileData}
                    itemsPerPage={8}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};

export default ManageAccounts;
