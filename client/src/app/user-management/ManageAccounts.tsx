import React, { useState } from 'react';
import Link from 'next/link';
import { IoIosSearch } from "react-icons/io";
import { HiMiniPlus } from "react-icons/hi2";
import { MdModeEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import EditUserInfo from '@/components/modals/EditUserInfo';
import ConfirmDelete from '@/components/modals/ConfirmDelete';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { ManageAccountsProps } from './page';

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
                        className="bg-white h-8 w-[30rem] px-5 pl-9 text-[1.1em] border border-gray-400  rounded-lg focus:outline-none"
                        type="search"
                        name="search"
                        placeholder="Search here..."
                    />
                </div> 

                <Link href="/user-management/create" className='ml-auto'>
                <div className='flex w-[7rem] h-9 mt-[0.8em]  mr-4 p-2 bg-[#008000] text-white text-center items-center font-semibold rounded-md hover:cursor-pointer hover:bg-[#127312] transition-colors delay-150 duration-[1000] ease-in'>
                    <HiMiniPlus className="text-[1.4em]"/> <p className="text-[1em]">Add User</p>
                </div>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-auto h-[35rem] bg-white">
                {/* Header */}
                <div className={`${isOpen ? 'flex h-[2.5rem] text-[1.1em] max-3xl:text-[1em] max-2xl:text-[0.9em]' : 'flex h-[3rem] text-[1.3em] max-2xl:text-[1em] max-2xl:py-1 max-xl:text-[0.9em] max-xl:h-[2.5rem]'} text-[#6B6B6B] font-medium border-solid border-b border-[#868686]`}>
                    <div className={`${isOpen ? 'w-[20rem] pl-[2rem] max-2xl:pl-[1rem] max-2xl:w-[15rem]' : 'w-[25rem] pl-10 max-4xl:w-[23rem] max-3xl:w-[20rem] max-2xl:pl-7' } py-2 `}>
                        Name</div>
                    <div className={`${isOpen ? 'w-[15rem] max-2xl:pl-[1.5rem]' : 'w-[15rem] ' } py-2`}>
                        Role</div>
                    <div className={`${isOpen ? 'w-[20rem] max-3xl:w-[25rem] max-2xl:pl-[1rem] ' : 'w-[30rem] max-2xl:pl-[1rem]' }  py-2 `}>
                        Email</div>
                    <div className={`${isOpen ? 'w-[20rem] pl-[2rem] max-2xl:pl-[1rem]' : 'w-[20rem] max-2xl:pl-[1rem]' } py-2 `}>
                        Contact Number</div>
                    <div className={`${isOpen ? 'w-[20rem] max-3xl:pl-[2rem] max-2xl:pl-[1rem]' : 'w-[25rem] pl-[2rem] max-4xl:mr-6 max-3xl:w-[15rem] max-3xl:mr-4 max-2xl:mr-2' }  py-2`}>
                        Department</div>
                    <div className={`${isOpen ? 'w-[15rem] pl-[1rem] max-2xl:w-[10rem] max-2xl:pl-[0rem]' : 'w-[15rem] pl-[3rem] max-3xl:pl-[2rem]' }   py-2 max-4xl:pl-0 max-3xl:pl-[2rem]`}>
                        Manage</div>
                </div>

                {/* Rows */}
                <div className={`${isOpen ? 'text-[1.1em] max-4xl:text-[1em] max-2xl:text-[0.8em]' : 'text-[1.3em] max-3xl:text-[1.2em] max-2xl:text-[1em] max-xl:text-[0.9em]' } flex flex-col`}>
                {currentListPage.length > 0
                        ? (currentListPage.map((data, index) => (
                        <div key={index} className="flex h-[4rem] border-b border-[#868686] hover:bg-gray-50 max-xl:h-[3rem]">
                            <div className={`${isOpen ? 'w-[20rem] pl-[2rem]  max-2xl:pl-[1rem]' : 'w-[25rem] pl-10 max-4xl:w-[23rem] max-3xl:w-[20rem] max-2xl:pl-7 ' }  py-1 flex items-center break-words `}>
                                {data.userName}</div>
                            <div className={`${isOpen ? 'w-[15rem] max-2xl:pl-[1rem]' : 'w-[15rem]' }  py-1 flex items-center break-words`}>
                                {data.userRole}</div>
                            <div className={`${isOpen ? 'w-[20rem] max-3xl:w-[25rem]' : 'w-[30rem]' } py-1 flex items-center break-words max-2xl:pl-[1rem]`}>
                                {data.userEmail}</div>
                            <div className={`${isOpen ? 'w-[20rem] pl-[2rem] max-2xl:pl-[1rem]' : 'w-[20rem] max-2xl:pl-[1rem]' } py-1 flex items-center break-words`}>
                                {data.contactNumber}</div>
                            <div className={`${isOpen ? 'w-[20rem]  max-3xl:pl-[2rem] max-2xl:pl-[2rem]' : 'w-[25rem] pl-[2rem] max-4xl:mr-6 max-3xl:w-[15rem] max-3xl:mr-4 max-2xl:mr-2' }  py-1 flex items-center break-words`}>
                                {data.department}</div>
                            <div className={`${isOpen ? 'w-[15rem] pl-[1rem]  max-2xl:pl-[0rem]' : 'w-[15rem] pl-[3rem] max-4xl:pl-0 max-3xl:pl-[2rem]' }  py-1 flex items-center `}>
                                <div className="w-auto flex">
                                    <button
                                        onClick={() => openEditModal()}
                                        className={`${isOpen ? 'max-2xl:w-[1.5rem] max-2xl:h-[1.4rem] max-2xl:text-[1.3em] max-2xl:px-[8px]' : '' } w-[3rem] h-[2rem] text-[1.2em] px-3  bg-[#FF7A00] text-white  mr-2 rounded-lg max-3xl:w-[2.5rem] max-3xl:px-[10px] max-2xl:text-[1.1em] max-2xl:w-[2rem] max-2xl:h-[2rem] max-2xl:px-2 max-xl:w-[2rem] max-xl:h-[1.5rem]
                                            hover:cursor-pointer hover:bg-[#de7e24] transition-colors delay-150 duration-[1000] ease-in`}>
                                        <MdModeEdit />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal()}
                                        className={`${isOpen ? 'max-2xl:w-[1.5rem] max-2xl:h-[1.4rem] max-2xl:text-[1.1em] max-2xl:px-[9px]' : '' } w-[3rem] h-[2rem] text-[0.9em] px-4  bg-[#B22222] text-white rounded-lg  max-3xl:w-[2.5rem] max-3xl:px-[11px] max-2xl:text-[0.8em] max-2xl:w-[2rem] max-2xl:h-[2rem] max-2xl:px-[11px] max-xl:w-[2rem] max-xl:h-[1.5rem]
                                            hover:cursor-pointer hover:bg-[#971c1c] transition-colors delay-150 duration-[1000] ease-in`}>
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )))
                    : (
                        <p className='flex justify-center mt-4'>No users to display.</p>
                    )
                }
                </div>
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
