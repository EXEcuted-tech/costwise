import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import {DatePicker} from "@nextui-org/date-picker";

const PasswordRequests = () => {
    return (
        <div className="flex flex-col w-auto h-auto rounded-lg shadow-md shadow-gray-300 animate-fade-in">
            {/* Search Area */}
            <div className="flex w-full h-[4.5rem] bg-[#F3F3F3] border-solid border-b-[3px] border-gray-300">
                <div className="mt-[0.8em] ml-7 text-gray-600">
                    <div className='flex fixed text-[1.6em] text-gray-400 mt-[0.7rem] ml-2'>
                        <IoIosSearch />
                    </div>
                    <input
                        className="bg-white h-12 w-[30rem] px-5 pl-9 text-[1.2em] border-2 border-gray-400  rounded-lg focus:outline-none"
                        type="search"
                        name="search"
                        placeholder="Search here..."
                    />
                </div>

                <div className="mt-[0.8em] ml-7 text-gray-600">
                    <input
                        className="bg-white h-12 w-[15rem] px-5 pr-6 text-[1.2em] border-2 border-gray-400  rounded-lg focus:outline-none"
                        name="date"
                        type="date"
                    >
                    </input>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full h-[35rem] rounded-lg bg-white">
                {/* Header */}
                <div className='flex h-[4rem] text-[#6B6B6B] text-[1.3em] font-medium border-solid border-b-[3px]'>
                    <div className="w-[25rem] pl-10 py-2">Name</div>
                    <div className="w-[15rem] pl-10 py-2">Role</div>
                    <div className="w-[15rem] py-2">Department</div>
                    <div className="w-[15rem] py-2">Status</div>
                    <div className="w-[15rem] py-2">Request Date</div>
                    <div className="w-[10rem] py-2">Manage</div>
                </div>

                {/* Rows */}
                <div className="flex flex-col text-[1.3em]">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="flex h-[4rem] border-b hover:bg-gray-50">
                            <div className="w-[25rem] pl-10 py-1 flex items-center break-words">Franz Ondiano beeeeeeee bebebeb</div>
                            <div className="w-[15rem] pl-10 py-1 flex items-center break-words">User</div>
                            <div className="w-[15rem] py-1 flex items-center break-words">Accounting</div>
                            <div className="w-[15rem] py-1 flex items-center break-words">Pending</div>
                            <div className="w-[15rem] py-1 flex items-center break-words">12/12/2024</div>
                            <div className="w-[10rem] py-1 flex items-center">
                                <div className="w-auto">
                                    <button className="w-[3rem] h-[2rem] bg-[#00930F] text-white text-[1em] px-3 mr-2 rounded-lg hover:cursor-pointer hover:bg-[#178622] transition-colors delay-150 duration-[1000] ease-in">
                                        <FaCheck />
                                    </button>
                                    <button className="w-[3rem] h-[2rem] bg-[#B22222] text-white text-[1.5em] px-2 rounded-lg hover:cursor-pointer hover:bg-[#971c1c] transition-colors delay-150 duration-[1000] ease-in">
                                        <IoClose />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex w-full h-[5rem] bg-white border-solid border-t-[3px] border-gray-400"></div>
        </div>
    );
};

export default PasswordRequests;
