// PasswordRequests.jsx
import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const PasswordRequests = () => {
    return (
        <div className="flex flex-col w-auto h-auto rounded-lg shadow-md shadow-gray-300 animate-fade-in">
            {/* Search Area */}
            <div className="flex w-full h-[4.5rem] bg-[#F3F3F3] border-solid border-b-[3px] border-gray-300">
                <div className="mt-[0.8em] ml-7 text-gray-600">
                    <input
                        className="bg-white h-12 w-[30rem] px-5 pr-16 text-[1.2em] border-2 border-gray-400  rounded-lg focus:outline-none"
                        type="search"
                        name="search"
                        placeholder="Search here..."
                    />
                </div>

                <div className="mt-[0.8em] ml-7 text-gray-600">
                    <select
                        className="bg-white h-12 w-[15rem] px-5 text-[1.2em] border-2 border-gray-400  rounded-lg focus:outline-none"
                        name="date"
                    >
                        <option selected>Date/Period</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex w-full h-[37rem] rounded-lg bg-white">
                <table className="w-full text-left ">
                    <thead>
                        <tr className='h-[4rem] text-[#6B6B6B] text-[1.3em] font-medium border-solid border-b-[3px]'>
                            <td scope="col" className="w-[30rem] pl-10 py-2">Name</td>
                            <td scope="col" className="w-[15rem] pl-10 py-2">Role</td>
                            <td scope="col" className="w-[20rem] py-2">Department</td>
                            <td scope="col" className="w-[15rem] py-2 ">Status</td>
                            <td scope="col" className="w-[20rem] py-2 ">Request Date</td>
                            <td scope="col" className="w-[20rem] py-2">Manage</td>
                        </tr>
                    </thead>

                    <tbody className="text-[1.3em]">
                        {[...Array(6)].map((_, index) => (
                            <tr key={index} className="h-[5rem] border-b hover:bg-gray-50">
                                <td scope="row" className="pl-10 py-1 break-words">Franz Ondiano beeeeeeee bebebeb</td>
                                <td className="pl-10 py-1 break-words">User</td>
                                <td className="break-words">Accounting</td>
                                <td className="py-1 break-words">Pending</td>
                                <td className="py-1 break-words">12/12/2024</td>
                                <td className="py-1">
                                    <div className="w-auto">
                                        <button className="w-[3rem] h-[2rem] bg-[#00930F] text-white text-[1em] px-3 mr-2 rounded-lg hover:cursor-pointer hover:bg-[#178622] transition-colors delay-150 duration-[1000] ease-in">
                                            <FaCheck />
                                        </button>

                                        <button className="w-[3rem] h-[2rem] bg-[#B22222] text-white text-[1.5em] px-2 rounded-lg hover:cursor-pointer hover:bg-[#971c1c] transition-colors delay-150 duration-[1000] ease-in ">
                                            <IoClose />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex w-full h-[5rem] bg-white border-solid border-t-[3px] border-gray-400"></div>
        </div>
    );
};

export default PasswordRequests;
