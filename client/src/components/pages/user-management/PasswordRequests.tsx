import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import CustomDatePicker from '@/components/form-controls/CustomDatePicker';
import { PasswordRequestProps } from '@/app/user-management/page';
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
                    
                        className={`${isOpen ? 'w-[20rem] 2xl:w-[25rem] 3xl:w-[30rem]' : 'w-[30rem]'} bg-white h-8 px-5 pl-9 text-[1.1em] border border-gray-400 rounded-lg focus:outline-none`}
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
            <div className="animate-fade-in3 flex flex-col w-auto h-[35rem]">
                <table className="w-full h-full text-left">
                    <thead className="bg-[#F3F3F3] border-b border-[#868686]">
                        <tr className={`${isOpen ? 'text-[1.2em] 3xl:text-[1.2em] 2xl:text-[1.1em] xl:text-[0.9em]' : 'text-[1.3em] 3xl:text-[1.2em] 2xl:text-[1.1em] xl:text-[1em]'} text-[#6B6B6B]`}>
                            <th className={`${isOpen ? 'pl-[2rem] xl:pl-[2rem] 4xl:w-[20rem] 3xl:w-[13rem] 2xl:w-[14rem] xl:w-[8rem]' : 'pl-8 2xl:w-[20rem] xl:w-[20rem]'} py-2`}>Name</th>
                            <th className={`${isOpen ? 'w-[10rem] 4xl:w-[13rem] 3xl:w-[7rem] 2xl:w-[8rem] xl:w-[6rem]' : 'w-[15rem] 3xl:w-[13rem]' } py-2 `}>Role</th>
                            <th className={`${isOpen ? '4xl:w-[20rem] 3xl:w-[13rem] 2xl:w-[12rem] xl:w-[12rem]' : 'w-[19rem]' } py-2 `}>Department</th>
                            <th className={`${isOpen ? '4xl:w-[13rem] 3xl:w-[10rem] 2xl:w-[12rem] xl:w-[10rem]' : 'w-[10rem]' } py-2 `}>Status</th>
                            <th className={`${isOpen ? '4xl:w-[15rem] 3xl:w-[13rem] 2xl:w-[9rem] xl:w-[5rem]' : 'w-[10%] xl:w-[13%]' } py-2`}>Request Date</th>
                            <th className={`${isOpen ? 'pl-[1rem]' : 'pl-[3rem] w-[12%]'} py-2`}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentListPage.length > 0 ? (
                            currentListPage.map((data, index) => (
                                <tr key={index} className={`${isOpen ? 'text-[1.1em] 4xl:text-[1.1em] 3xl:text-[0.9em] 2xl:text-[0.8em] xl:text-[0.7em]' : 'text-[1.2em] 2xl:text-[1.1em] xl:text-[1em]'} border-b border-[#868686] hover:bg-gray-50`}>
                                    <td className={`${isOpen ? 'pl-[2rem]' : 'pl-8'} py-2 break-words`}>{data.userName}</td>
                                    <td className={`${isOpen ? '' : 'py-2 break-words'}`}>{data.userRole}</td>
                                    <td className="py-2 break-words">{data.department}</td>
                                    <td className="py-2 break-words">{data.status}</td>
                                    <td className="py-2 break-words">{data.requestDate}</td>
                                    <td className={`${isOpen ? 'pl-[1rem] ' : 'pl-[3rem]'} 3xl:pr-2 xl:pr-3 py-2`}>
                                        <div className="flex">
                                            <button
                                                className={`${isOpen ? '4xl:w-[3rem] 4xl:px-3.5 xl:w-[2rem] xl:px-[0.55rem]' : '4xl:w-[3rem] 4xl:px-4 2xl:w-[2rem] 2xl:px-2 2xl:text-[1em] xl:w-[2rem] xl:px-2 xl:text-[1em]' } h-[2rem] text-[1.2em] bg-[#00930F] text-white mr-2 rounded-lg hover:bg-[#178622] transition-colors duration-300 ease-in-out`}>
                                                <FaCheck />
                                            </button>
                                            <button
                                                className={`${isOpen ? '4xl:w-[3rem] 4xl:px-[10px] xl:w-[2rem] xl:px-[7px]' : '4xl:w-[3rem] 4xl:px-[11px] 2xl:w-[2rem] 2xl:px-[4px] 2xl:text-[1.5em] xl:w-[2rem] xl:px-[4px] xl:text-[1.5em]' } h-[2rem] text-[1.6em] bg-[#B22222] text-white rounded-lg hover:bg-[#971c1c] transition-colors duration-300 ease-in-out`}>
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
