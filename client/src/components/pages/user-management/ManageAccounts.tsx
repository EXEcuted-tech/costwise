import React, { useState } from 'react';
import Link from 'next/link';
import { IoIosSearch } from "react-icons/io";
import { HiMiniPlus } from "react-icons/hi2";
import { MdModeEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import EditUserInfo from '@/components/modals/EditUserInfo';
import ConfirmDelete from '@/components/modals/ConfirmDelete';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { ManageAccountsProps } from '@/app/user-management/page';

interface ManageAccountsPageProps {
    fileData: ManageAccountsProps[];
    isOpen?: boolean;
}

const ManageAccounts: React.FC<ManageAccountsPageProps> = ({ fileData, isOpen }) => {
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
            {/* Search Area */}
            <div className="flex w-full h-[3.5rem] bg-[#F3F3F3] border-solid border-b border-[#868686]">
                <div className="mt-[0.8em] ml-7 text-gray-600">
                    <div className='flex absolute text-[1.3em] text-gray-400 mt-[0.3rem] ml-3'>
                        <IoIosSearch />
                    </div>
                    <input
                        className="bg-white h-8 w-[30rem] px-5 pl-9 text-[1.1em] border border-gray-400 rounded-lg focus:outline-none"
                        type="search"
                        name="search"
                        placeholder="Search here..."
                    />
                </div>

                <Link href="/user-management/create" className='ml-auto'>
                    <div className='flex w-[7rem] h-8 mt-[0.8em]  mr-4 p-2 bg-[#008000] text-white text-center items-center font-semibold rounded-[5px] hover:cursor-pointer hover:bg-[#006900] transition-colors delay-50 duration-[1000] ease-in'>
                        <HiMiniPlus className="text-[1.4em]" /> <p className="text-[1em]">Add User</p>
                    </div>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-auto h-[35rem]">
                <table className="w-full h-full text-left">
                    <thead className="bg-[#F3F3F3] border-b border-[#868686]">
                        <tr className={`${isOpen ? 'text-[1.1em] 3xl:text-[1em] 2xl:text-[1em] xl:text-[0.9em]' : 'text-[1.3em] 3xl:text-[1.2em] 2xl:text-[1.1em] xl:text-[1em]'} text-[#6B6B6B]`}>
                            <th className={`${isOpen ? 'pl-[2rem] 4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[14rem] xl:w-[8rem] xl:pl-[1rem]' : 'pl-8 w-[20rem] 4xl:w-[20rem] 3xl:w-[15rem] 2xl:w-[14rem] xl:pl-6'} py-2`}
                                >Name</th>
                            <th className={`${isOpen ? 'w-[10rem] 4xl:w-[10rem] 3xl:w-[7rem] 2xl:w-[8rem] xl:w-[6rem]' : 'w-[15rem] 4xl:w-[10rem] 3xl:w-[10rem] 2xl:w-[8rem] xl:w-[7rem]' } py-2 `}
                                >Role</th>
                            <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[12rem] xl:w-[12rem]' : '4xl:w-[15rem] xl:w-[15rem]' } py-2`}>
                                Email</th>
                            <th className={`${isOpen ? '4xl:w-[13rem] 3xl:w-[10rem] 2xl:w-[12rem] xl:w-[10rem]' : '4xl:w-[13rem] 2xl:w-[10rem] xl:w-[13rem]' } py-2`}>
                                Contact Number</th>
                            <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[9rem] xl:w-[5rem]' : ' 4xl:w-[15rem] 3xl:w-[15rem] 2xl:w-[13rem] xl:w-[5rem]' } w-[15rem] py-2`}>
                                Department</th>
                            <th className={`${isOpen ? 'pl-[1rem]' : 'pl-[3rem] xl:pl-[2rem] w-[12%]'} py-2`}
                            >Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentListPage.length > 0 ? (
                            currentListPage.map((data, index) => (
                                <tr key={index} className={`${isOpen ? 'text-[1.1em] 4xl:text-[1.1em] 3xl:text-[0.9em] 2xl:text-[0.8em] xl:text-[0.7em]' : 'text-[1.2em] 4xl:text-[1.2em] 3xl:text-[1.2em] 2xl:text-[1.1em] xl:text-[1em]' } border-b border-[#868686] hover:bg-gray-50`}>
                                    <td className={`${isOpen ? 'pl-[2rem] xl:pl-[1rem]' : 'pl-8 xl:pl-6'} py-2 break-words`}>{data.userName}</td>
                                    <td className="py-2 break-words">{data.userRole}</td>
                                    <td className="py-2 break-words">{data.userEmail}</td>
                                    <td className="py-2 break-words">{data.contactNumber}</td>
                                    <td className="py-2 break-words">{data.department}</td>
                                    <td className={`${isOpen ? 'pl-[1rem] 2xl:pr-2 xl:pr-2' : 'pl-[3rem] xl:pl-[2rem] xl:pr-2'} py-2`}>
                                        <div className="flex">
                                            <button
                                                onClick={openEditModal}
                                                className={`${isOpen ? '4xl:w-[3rem] 4xl:px-3 3xl:w-[2rem] 3xl:px-2 2xl:w-[2rem] 2xl:px-[10px] xl:w-[2rem] xl:px-[10px]' : ' 4xl:w-[3rem] 4xl:px-3 3xl:w-[3rem] 3xl:px-4 xl:w-[2rem] xl:px-2' } w-[3rem] h-[2rem] px-3  text-[1.2em]  bg-[#FF7A00] text-white mr-2 rounded-lg hover:bg-[#de7e24] transition-colors duration-1000 ease-in`}>
                                                <MdModeEdit />
                                            </button>
                                            <button
                                                onClick={openDeleteModal}
                                                className={`${isOpen ? '4xl:w-[3rem] 4xl:px-[18px] 3xl:w-[2rem] 3xl:px-[10px] 2xl:w-[2rem] 2xl:px-[10px] xl:w-[2rem] xl:px-[10px]' : ' 4xl:w-[3rem] 4xl:px-[18px] 3xl:w-[3rem] 3xl:px-[18px] xl:w-[2rem] xl:px-[10px]' } w-[3rem] h-[2rem] px-[17px]  text-[0.9em]  bg-[#B22222] text-white rounded-lg hover:bg-[#971c1c] transition-colors duration-1000 ease-in`}>
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-6">No users to display.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {isEditModalOpen && <EditUserInfo onClose={closeEditModal} />}
            {isDeleteModalOpen && <ConfirmDelete onClose={closeDeleteModal} />}

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
