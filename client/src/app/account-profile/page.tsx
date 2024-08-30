"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import virginialogo from '@/assets/virginia-logo.png';
import { useSidebarContext } from "@/context/SidebarContext";
import { IoCamera, IoClose } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import EditProfilePage from "./edit/page";
import { useRouter } from "next/router";
import LogoutPage from "../logout/page";
import Link from "next/link";

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

const AccountProfilePage = () => {
const { isOpen, setIsOpen } = useSidebarContext();

return (
        <div className='w-full h-screen flex flex-col items-center'>
            <div className="relative w-full h-[170px]">
                <div className="absolute w-full h-[50%] bg-[#FF0000] border-[5px] border-[#A60000] rounded-b-[100px]"></div>
                <div className="absolute flex justify-center items-center w-[20%] 2xl:w-[16%] 4xl:w-[13%] h-[70%] top-[20px] left-1/2 -translate-x-1/2 bg-[#FF0000] border-[10px] border-[#A60000] rounded-[50%]">
                    <Image src={virginialogo} alt={'Hotdog Logo'} className='flex w-[120px] cursor-pointer' />
                </div>
            </div>
            
            <div className="flex flex-col w-[80%] h-[74%] 2xl:h-[74%] mx-[50px] py-6 mt-[1%] bg-white shadow-md shadow-gray-800 rounded-lg"> 
                {/* Title */} 
                <div className='flex mt-1 mb-2 border-b-2 border-[#A0A0A0]'>
                    <div className="flex text-[24px] font-semibold mx-8 2xl:mx-12 mb-2">
                        Account Profile
                    </div>
        
                </div>

                {/* Profile Picture */}
                <div className='flex justify-center items-center h-[10rem] mt-2 pb-4 gap-4 border-b-2 border-[#A0A0A0]'>
                    <div className="">
                        <button className="w-10 h-10 fixed  ml-[5rem] mt-20 bg-[#A60000] rounded-full border-3 border-white p-[0.3rem] text-white text-[1.6em]">
                            <IoCamera />
                        </button>
                        <div className='w-28 h-28 bg-red-200 border-4 border-[#A60000] rounded-full'>
                            {/* <img src="../assets/virginia-logo.png"></img> */}
                        </div>
                    </div>
                    <div>
                        <div className='text-[25px] 2xl:text-[30px] font-semibold'> Kathea Mari Mayol </div>
                        <div className='text-[22px] 2xl:text-[24px]'> Administrator </div>
                        <Link href="/logout">
                            <button className="text-[22px] 2xl:text-[24px] text-primary cursor-pointer hover:opacity-65">
                                Logout
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-8 2xl:mx-12">
                    <div className="flex text-[28px] 2xl:text-[32px] text-[#8E8E8E] font-semibold mt-3 mb-2">
                        User Information
                        <Link href="/account-profile/edit">
                            <button className={`px-3 text-[35px] 2xl:text-[40px] text-black mr-2 mt-1 rounded-lg`}>
                                <MdModeEdit/>
                            </button>
                        </Link>
                    </div>
                    <div className="flex justify-center border-2 border-[#D9D9D9] py-5 text-[18px] 2xl:text-[22px] 3xl:text-[24px] text-black gap-[10%] rounded-[15px]">
                        {/* 1st Col */}
                        <div className='flex flex-col ml-3 mr-8'>
                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">First Name</p>
                                <p>Kathea Mari</p>
                            </div>

                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Email Address</p>
                                <p>19103095@usc.edu.ph</p>
                            </div>

                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Department</p>
                                <p>Accounting</p>
                            </div>
                        </div>

                        {/* 2nd Col */}
                        <div className='flex flex-col mr-8'>
                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Middle Name</p>
                                <p>Catubig</p>
                            </div>

                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Phone Number</p>
                                <p>09281729394</p>
                            </div>

                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Employee Number</p>
                                <p>#192305</p>
                            </div>
                        </div>

                        {/* 3rd Col */}
                        <div className='flex flex-col mr-6'>
                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Last Name</p>
                                <p>Mayol</p>
                            </div>

                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Suffix</p>
                                <p>N/A</p>
                            </div>

                            <div className='flex flex-col justify-start mb-4'>
                                <p className="text-[#8E8E8E] font-semibold">Role</p>
                                <p>Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default AccountProfilePage