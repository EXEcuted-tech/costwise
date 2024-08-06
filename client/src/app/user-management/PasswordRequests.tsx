import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const PasswordRequests = () => {
    return (
        <div className="flex flex-col w-auto h-auto rounded-lg shadow-md shadow-gray-300 animate-fade-in">
            {/* Search Area */}
            <div className="flex w-full h-[4.5rem] bg-[#F3F3F3] border-solid border-b-[2px] border-[#868686]">
                <div className="mt-[0.8em] ml-7 text-gray-600">
                    <div className='flex absolute text-[1.6em] text-gray-400 mt-[0.7rem] ml-2'>
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
                        className="bg-white h-12 w-[15rem] px-5 pr-2 text-[1.2em] border-2 border-gray-400  rounded-lg focus:outline-none"
                        name="date"
                        type="date"
                    >
                    </input>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full h-[35rem] rounded-lg bg-white">
                {/* Header */}
                <div className='flex h-[4rem] text-[#6B6B6B] text-[1.3em] font-medium border-solid border-b-[2px] border-[#868686] max-2xl:text-[1.1em] max-2xl:py-1 max-xl:text-[1em]'>
                    <div className="w-[25rem] pl-10 py-2 max-4xl:w-[23rem] max-3xl:w-[20rem]">
                        Name</div>
                    <div className="w-[15rem] pl-10 py-2">
                        Role</div>
                    <div className="w-[15rem] py-2 max-4xl:mr-6 max-3xl:mr-4">
                        Department</div>
                    <div className="w-[15rem] py-2">
                        Status</div>
                    <div className="w-[15rem] py-2 max-4xl:mr-6 max-3xl:w-[15rem] max-3xl:mr-4 max-2xl:mr-2">
                        Request Date</div>
                    <div className="w-[10rem] py-2">
                        Manage</div>
                </div>

                {/* Rows */}
                <div className="flex flex-col text-[1.3em] max-3xl:text-[1.2em] max-2xl:text-[1em]">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="flex h-[4rem] border-b-[2px] border-[#868686] hover:bg-gray-50">
                            <div className="w-[25rem] pl-10 py-1 flex items-center break-words max-4xl:w-[23rem] max-3xl:w-[20rem]">
                                Franz Ondiano beeeeeeee bebebeb</div>
                            <div className="w-[15rem] pl-10 py-1 flex items-center break-words">
                                User</div>
                            <div className="w-[15rem] py-1 flex items-center break-words  max-4xl:mr-6 max-3xl:mr-4">
                                Accounting</div>
                            <div className="w-[15rem] py-1 flex items-center break-words">
                                Pending</div>
                            <div className="w-[15rem] py-1 flex items-center break-word max-4xl:mr-6 max-3xl:w-[15rem] max-3xl:mr-4 max-2xl:mr-2">
                                12/12/2024</div>
                            <div className="w-[10rem] py-1 flex items-center">
                                <div className="w-auto">
                                    <button className="w-[3rem] h-[2rem] bg-[#00930F] text-white text-[1em] px-3 mr-2 rounded-lg max-2xl:text-[0.9em] max-2xl:w-[2rem] max-2xl:h-[2rem] max-2xl:px-2
                                        hover:cursor-pointer hover:bg-[#178622] transition-colors delay-150 duration-[1000] ease-in">
                                        <FaCheck />
                                    </button>
                                    <button className="w-[3rem] h-[2rem] bg-[#B22222] text-white text-[1.5em] px-2 rounded-lg max-2xl:text-[1.4em] max-2xl:w-[2rem] max-2xl:h-[2rem] max-2xl:px-[5px]
                                        hover:cursor-pointer hover:bg-[#971c1c] transition-colors delay-150 duration-[1000] ease-in">
                                        <IoClose />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex w-full h-[5rem] rounded-b-xl bg-white border-t-[1px] border-[#868686]"></div>
        </div>
    );
};

export default PasswordRequests;
