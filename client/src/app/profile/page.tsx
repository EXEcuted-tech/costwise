"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import virginialogo from '@/assets/virginia-logo.png';
import { useSidebarContext } from "@/context/SidebarContext";
import { IoCamera } from "react-icons/io5";
import Link from "next/link";
import UserInformation from '@/components/pages/profile/UserInformation';
import PasswordChangeDialog from "@/components/modal/PasswordChangeDialog";
import background from '@/assets/account-profile-bg.png';

export interface AccountDataProps {
    firstName: string;
    middleName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    suffix: string;
    department: string;
    employeeNumber: string;
    role: string;
}

const ProfilePage = () => {
const { isOpen } = useSidebarContext();
const [userInfo, setuserInfo] = useState(false);
const [dialog, setDialog] = useState(false);

return (
        <div className='w-full h-screen flex flex-col items-center bg-repeat' style={{ backgroundImage: `url(${background.src})` }}>
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
            
            <div className={`${isOpen ? 'h-[65%] 3xl:h-[74%]' : 'h-[74%]'} flex flex-col w-[80%] mx-[50px] py-6 mt-[1%] bg-white shadow-md shadow-gray-800 rounded-lg`}> 
                {/* Title */} 
                <div className='flex flex-col mt mb-2 border-b-2 border-[#A0A0A0]'>
                    <div className="flex text-[24px] font-semibold mx-8 2xl:mx-12 mb-2">
                        Account Profile
                    </div>
                    <div className=' bg-primary w-[175px] h-[20px] rounded-[5px] mb-[-11px] ml-[31px] 2xl:ml-[45px]'></div>
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
                        <div className='text-[25px] 2xl:text-[30px] font-semibold'> {fakeAccData[0].firstName} {fakeAccData[0].lastName}</div>
                        <div className='text-[22px] 2xl:text-[24px]'> {fakeAccData[0].role} </div>
                        <Link href="/logout">
                            <button className="text-[22px] 2xl:text-[24px] text-primary cursor-pointer hover:opacity-65">
                                Logout
                            </button>
                        </Link>
                    </div>
                </div>
                
                <UserInformation isOpen={isOpen} fakeAccData={fakeAccData}/>
            </div>
        </div>
    );
}

export default ProfilePage

const fakeAccData: AccountDataProps[] = [
    {
        firstName: 'Kathea Mari',
        middleName: 'Catubig',
        lastName: 'Mayol',
        emailAddress: 'katheamari123@gmail.com',
        phoneNumber: '09876543212',
        suffix: 'N/A',
        department: 'Cost Accounting',
        employeeNumber: '#12934',
        role: 'Administrator'
    },
];
