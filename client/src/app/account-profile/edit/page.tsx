"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import virginialogo from '@/assets/virginia-logo.png';
import { useSidebarContext } from "@/context/SidebarContext";
import { IoCamera, IoClose } from "react-icons/io5";
import { IoIosArrowRoundBack, IoIosSearch } from "react-icons/io";
import PasswordChangeDialog from '@/components/modal/PasswordChangeDialog';

export interface AuditTableProps {
    dateTimeAdded: string;
    employeeNo: string;
    userType: string;
    userEmail: string;
    actionEvent: string;
}

interface AuditLogPageProps {
    fileData: AuditTableProps[];
}

const EditProfilePage = () => {
const { isOpen, setIsOpen } = useSidebarContext();
const [dialog, setDialog] = useState(false);

return (
        <div className='w-full h-screen flex flex-col items-center'>
            {dialog && 
                <PasswordChangeDialog 
                setDialog={setDialog}
                />
            }
            <div className="relative w-full h-[170px]">
                <div className="absolute w-full h-[50%] bg-[#FF0000] border-[5px] border-[#A60000] rounded-b-[100px]"></div>
                <div className="absolute flex justify-center items-center w-[20%] 2xl:w-[16%] 4xl:w-[13%] h-[70%] top-[20px] left-1/2 -translate-x-1/2 bg-[#FF0000] border-[10px] border-[#A60000] rounded-[50%]">
                    <Image src={virginialogo} alt={'Hotdog Logo'} className='flex w-[120px] cursor-pointer' />
                </div>
            </div>
            
            <div className="flex flex-col w-[80%] h-[77%] mx-[50px] py-6 bg-white shadow-md shadow-gray-800 rounded-lg"> 
                {/* Title */} 
                <div className='flex mt-1 border-b-2 border-[#868686]'>
                    <div className="flex text-[24px] font-semibold ml-12 mb-2">
                        Account Profile
                    </div>
                </div>

                {/* Profile Picture */}
                <div className='flex justify-center items-center h-[10rem] mt-2 pb-2 gap-4 border-b-2 border-[#868686]'>
                    <div className="">
                        <button className="w-10 h-10 fixed ml-[5rem] mt-20 bg-[#A60000] rounded-full border-3 border-white p-[0.3rem] text-white text-[1.6em]">
                            <IoCamera />
                        </button>
                        <div className='w-28 h-28 bg-red-200 border-4 border-[#A60000] rounded-full'>
                            {/* <img src="../assets/virginia-logo.png"></img> */}
                        </div>
                    </div>
                    <div>
                        <div className='text-[25px] 2xl:text-[30px] font-semibold'> Kathea Mari Mayol </div>
                        <div className='text-[22px] 2xl:text-[24px]'> Administrator </div>
                    </div>
                </div>

                {/* Form */}
                <div className='flex justify-center text-[18px] 2xl:text-[22px] 3xl:text-[24px] mt-[50px] mx-[3%] 2xl:mx-[5%]'>
                    <div className='flex text-[1.3em] mt-[0.3rem] ml-3'>
                        <IoIosArrowRoundBack className='text-[#6D6D6D] text-[40px] mr-[15px] hover:text-[#D13131] cursor-pointer'/>
                    </div>
                    {/* 1st Col */}
                    <div className='flex flex-col ml-3 mr-8 w-[30%] gap-4'>
                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">First Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="fname"
                                        name="fname"
                                        placeholder="Kathea Mari"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Email Address*</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="email"
                                        name="email"
                                        placeholder="katheamari123@gmail.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Department</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        name="dept"
                                        placeholder="Cost Accounting"
                                        disabled
                                    >
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Col */}
                    <div className='flex flex-col mr-8 w-[30%] gap-4'>
                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Middle Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="mname"
                                        name="mname"
                                        placeholder="Catubig"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Phone Number*</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="contactnum"
                                        name="contactnum"
                                        placeholder="09123456789"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Employee Number</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="enum"
                                        name="enum"
                                        placeholder="#112391"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3rd Col */}
                    <div className='flex flex-col mr-6 w-[30%] gap-4'>
                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Last Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="lname"
                                        name="lname"
                                        placeholder="Mayol"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Suffix</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="suffix"
                                        name="suffix"
                                        placeholder="N/A"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353]">Role</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className="bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="role"
                                        name="role"
                                        placeholder="Project Manager"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex flex-col w-full mt-[37px] justify-center items-center'>
                    <button className='w-[25%] 2xl:w-[20%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] bg-primary text-white rounded-xl hover:bg-[#9c1c1c]'> Update Profile </button>
                    <div className="text-[#8F8F8F] text-[14px] 3xl:text-[19px] underline underline-offset-[7px] cursor-pointer hover:text-[#5B5353]"
                        onClick={() => setDialog(true)}>
                        Request Password Reset
                    </div>

                </div>
            </div>  
        </div>
    );
}

export default EditProfilePage