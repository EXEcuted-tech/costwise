import React from 'react';
import { IoClose, IoCamera } from "react-icons/io5";

interface ModalProps {
    username: string;
    role: string;
}

const EditUserInfo = () => {
    return (
        <div className='z-10 w-full h-full fixed top-0 right-0 p-4 overflow-auto bg-[rgba(0,0,0,0.6)] animate-fade-in'>
            <div className="flex flex-col w-[55rem] h-[41rem] fixed top-[23%] left-[35%] p-6 bg-white shadow-md shadow-gray-800 rounded-lg"> 
                
                {/* Title */} 
                <div className='flex justify-center mt-1 mb-2 border-b-2 border-[#A0A0A0]'>
                    <div className="flex text-[1.6em] font-semibold ml-6 mb-2">
                        User Information
                    </div>
        
                    <div className="h-[2rem] text-[2em] text-[#CECECE] ml-auto">
                        <button className="">
                            <IoClose />
                        </button>
                    </div>
                </div>

                {/* Profile Picture */}
                <div className='flex justify-center items-center h-[10rem] mt-2 mb-5 gap-4'>
                    <div className="">
                        <button className="w-10 h-10 fixed  ml-[5rem] mt-20 bg-[#A60000] rounded-full border-3 border-white p-[0.3rem] text-white text-[1.6em]">
                            <IoCamera />
                        </button>
                        <div className='w-28 h-28 bg-red-200 border-4 border-[#A60000] rounded-full'>
                            {/* <img src="../assets/virginia-logo.png"></img> */}
                        </div>
                    </div>
                    <div>
                        <div className='text-[1.4em] font-semibold'> Kathea Mari Mayol </div>
                        <div className='text-[1.1em]'> Administrator </div>
                    </div>
                </div>

                {/* Form */}
                <div className='flex justify-center'>
                    {/* 1st Col */}
                    <div className='flex flex-col ml-3 mr-8'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>First Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[20rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="fname"
                                        name="fname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Email Address*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[20rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="email"
                                        name="email"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Department*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <select
                                        className="bg-white h-9 w-[20rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        name="dept"
                                    >
                                        <option selected>Choose department</option>
                                        <option value="?">Cost Accounting</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Col */}
                    <div className='flex flex-col mr-8'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Middle Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="mname"
                                        name="mname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Employee Number*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="enum"
                                        name="enum"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Phone Number*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="contactnum"
                                        name="contactnum"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                     {/* 3rd Col */}
                     <div className='flex flex-col mr-6'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Last Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[11rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="lname"
                                        name="lname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Suffix*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[11rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="suffix"
                                        name="suffix"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Role*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-9 w-[11rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="role"
                                        name="role"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Buttons */}
                 <div className='flex w-full mt-7 justify-center'>
                    <button className='w-[7rem] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] text-white mr-4 rounded-xl'> Save </button>
                </div>
            </div>  
        </div>
    )
}

export default EditUserInfo;