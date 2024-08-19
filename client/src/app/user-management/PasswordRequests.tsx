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
                        className="bg-white h-8 w-[30rem] px-5 pl-9 text-[1.1em] border border-gray-400  rounded-lg focus:outline-none"
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
            <div className="flex flex-col w-full h-[35rem] rounded-lg bg-white">
                {/* Header */}
                <div className={`${isOpen ? 'flex h-[2.5rem] text-[1.1em] max-3xl:text-[1em] max-2xl:text-[0.9em]' : 'flex h-[3rem] text-[1.3em] max-2xl:text-[1em] max-2xl:py-1 max-xl:text-[0.9em] max-xl:h-[2.5rem]'} text-[#6B6B6B] font-medium border-solid border-b border-[#868686]`}>
                    <div className={`${isOpen ? 'w-[20rem] pl-[2rem] max-2xl:pl-[1rem] max-2xl:w-[15rem]' : 'w-[25rem] pl-10 max-4xl:w-[23rem] max-3xl:w-[20rem] max-2xl:pl-7 max-xl:pl-[1rem] max-xl:w-[14rem]' } py-2 `}>
                        Name</div>
                    <div className={`${isOpen ? 'w-[15rem] max-2xl:pl-[2.5rem]' : 'w-[15rem] max-3xl:pl-[3rem] max-xl:pl-0' } py-2`}>
                        Role</div>
                    <div className={`${isOpen ? 'w-[20rem] max-2xl:pl-[1rem]' : 'w-[20rem] max-3xl:pl-[2rem] max-xl:pl-0' }  py-2 `}>
                        Department</div>
                    <div className={`${isOpen ? 'w-[15rem]' : 'w-[15rem] max-3xl:pl-[0.5rem] max-xl:pl-0' } py-2 `}>
                        Status</div>
                    <div className={`${isOpen ? 'w-[15rem] max-4xl:w-[15rem]' : 'w-[20rem]' } py-2 `}>
                        Request Date</div>
                    <div className={`${isOpen ? 'w-[15rem] max-4xl:w-[15rem]' : 'w-[10rem]' } py-2 `}>
                        Manage</div>
                </div>

                {/* Rows */}
                <div className={`${isOpen ? 'text-[1.1em] max-4xl:text-[1em] max-2xl:text-[0.8em]' : 'text-[1.3em] max-3xl:text-[1.2em] max-2xl:text-[1em] max-xl:text-[0.9em]' } flex flex-col`}>
                {currentListPage.length > 0
                        ? (currentListPage.map((data, index) => (
                        <div key={index} className="flex h-[4rem] border-b border-[#868686] hover:bg-gray-50">
                            <div className={`${isOpen ? 'w-[20rem] pl-[2rem] max-2xl:pl-7' : ' w-[25rem] pl-10 max-xl:pl-[1rem] max-xl:w-[15rem]' } py-1 flex items-center break-words `}>
                                {data.userName}</div>
                            <div className={`${isOpen ? '' : '' } w-[15rem] py-1 flex items-center break-words`}>
                                {data.userRole}</div>
                            <div className={`${isOpen ? '' : '' } w-[20rem] py-1 flex items-center break-words`}>
                                {data.department}</div>
                            <div className={`${isOpen ? '' : '' } w-[15rem] py-1 flex items-center break-words`}>
                                {data.status}</div>
                            <div className={`${isOpen ? 'w-[15rem] max-4xl:w-[15rem]' : 'w-[20rem]' }  py-1 flex items-center break-word `}>
                                {data.requestDate}</div>
                            <div className={` ${isOpen ? 'w-[15rem] max-4xl:w-[15rem]' : 'w-[10rem]' }  py-1 flex items-center`}>
                                <div className="w-auto flex">
                                    <button className={`${isOpen ? 'px-3 max-4xl:px-[15px] max-2xl:px-[9px]' : '' } w-[3rem] h-[2rem] bg-[#00930F] text-white text-[1em] px-3 mr-2 rounded-lg max-3xl:w-[2.5rem] max-3xl:px-[10px] max-2xl:text-[0.9em] max-2xl:w-[2rem] max-2xl:h-[2rem] max-2xl:px-2 max-xl:w-[2rem] max-xl:h-[1.5rem]
                                        hover:cursor-pointer hover:bg-[#178622] transition-colors delay-150 duration-[1000] ease-in`}>
                                        <FaCheck />
                                    </button>
                                    <button className={`${isOpen ? 'px-3 max-3xl:px-[8px] max-2xl:px-[7px] ' : '' } w-[3rem] h-[2rem] bg-[#B22222] text-white text-[1.5em] px-2 rounded-lg max-3xl:w-[2.5rem] max-3xl:px-[6px] max-2xl:text-[1.4em] max-2xl:w-[2rem] max-2xl:h-[2rem] max-2xl:px-[5px] max-xl:w-[2rem] max-xl:h-[1.5rem]
                                        hover:cursor-pointer hover:bg-[#971c1c] transition-colors delay-150 duration-[1000] ease-in`}>
                                        <IoClose />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )))
                    : (
                        <p className='flex justify-center mt-4'>No requests to display.</p>
                    )
                }
                </div>
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
