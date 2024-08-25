import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import CustomDatePicker from '@/components/form-controls/CustomDatePicker';
import { PasswordRequestProps } from './page';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';

interface PasswordRequestPageProps {
    fileData: PasswordRequestProps[];
    isOpen?: boolean;
}

const PasswordRequests: React.FC<PasswordRequestPageProps> = ({ fileData, isOpen }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fileData.slice(indexOfFirstItem, indexOfLastItem);

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

                <div className="flex mt-[0.8em] ml-7 text-gray-600">
                    <CustomDatePicker/>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-auto h-[35rem]">
                <table className="w-full h-full text-left">
                    <thead className="bg-[#F3F3F3] border-b border-[#868686]">
                        <tr className={`${isOpen ? 'h-[2.5rem] text-[1.1em]' : 'h-[3rem] text-[1.3em]'} text-[#6B6B6B]`}>
                            <th className={`${isOpen ? 'pl-[2rem]' : 'pl-8'} py-2`}>Name</th>
                            <th className={`${isOpen ? 'w-[10rem]' : 'w-[15rem]' } py-2 `}>Role</th>
                            <th className={`${isOpen ? 'w-[15rem]' : 'w-[19rem]' } py-2 `}>Department</th>
                            <th className="py-2 w-[10rem]">Status</th>
                            <th className="py-2">Request Date</th>
                            <th className={`${isOpen ? 'pl-[1rem]' : 'pl-[3rem]'} py-2`}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentListPage.length > 0 ? (
                            currentListPage.map((data, index) => (
                                <tr key={index} className={`${isOpen ? 'text-[1.1em]' : 'text-[1.2em]'} border-b border-[#868686] hover:bg-gray-50`}>
                                    <td className={`${isOpen ? 'pl-[2rem]' : 'pl-8'} py-2 break-words`}>{data.userName}</td>
                                    <td className="py-2 break-words">{data.userRole}</td>
                                    <td className="py-2 break-words">{data.department}</td>
                                    <td className="py-2 break-words">{data.status}</td>
                                    <td className="py-2 break-words">{data.requestDate}</td>
                                    <td className={`${isOpen ? 'pl-[1rem]' : 'pl-[3rem]'} py-2`}>
                                        <div className="flex">
                                            <button
                                                className="w-[3rem] h-[2rem] text-[1.2em] px-3 bg-[#00930F] text-white mr-2 rounded-lg hover:bg-[#178622] transition-colors duration-1000 ease-in">
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="w-[3rem] h-[2rem] text-[1.6em] px-[10px] bg-[#B22222] text-white rounded-lg hover:bg-[#971c1c] transition-colors duration-1000 ease-in">
                                                <IoClose />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-6">No requests to display.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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

export default PasswordRequests;
