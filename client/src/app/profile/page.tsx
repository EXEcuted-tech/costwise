"use client"
import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import virginialogo from '@/assets/virginia-logo.png';
import { useSidebarContext } from "@/contexts/SidebarContext";
import { IoCamera } from "react-icons/io5";
import Link from "next/link";
import UserInformation from '@/components/pages/profile/UserInformation';
import SendEmailDialog from "@/components/modals/SendEmailDialog";
import background from '@/assets/account-profile-bg.png';
import { useUserContext } from "@/contexts/UserContext";
import api from "@/utils/api";

interface UserProps {
    fName: string;
    mName: string;
    lName: string;
    email: string;
    phoneNum: string;
    suffix: string;
    dept: string;
    employeeNum: string;
    role: string;
}

const ProfilePage = () => {
    const { isOpen } = useSidebarContext();
    const { currentUser } = useUserContext();
    const [userAcc, setUserAcc] = useState<UserProps | null>(null);
    const [userInfo, setuserInfo] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await api.get('/user');
                const userInformation = {
                    fName: user.data.first_name,
                    mName: user.data.middle_name,
                    lName: user.data.last_name,
                    email: user.data.email_address,
                    phoneNum: user.data.phone_number,
                    suffix: user.data.suffix,
                    dept: user.data.department,
                    employeeNum: user.data.employee_number,
                    role: user.data.sys_role
                }

                setUserAcc(userInformation);
            } catch (error: any) {

            }
        }
        fetchData();
    }, [currentUser?.email]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className='w-full h-screen flex flex-col items-center bg-repeat' style={{ backgroundImage: `url(${background.src})` }}>
            {dialog &&
                <SendEmailDialog
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
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            className="w-10 h-10 absolute right-0 bottom-0 bg-[#A60000] rounded-full border-3 border-white p-[0.3rem] text-white text-[1.6em]"
                            onClick={handleCameraClick}
                        >
                            <IoCamera />
                        </button>
                        <div className='w-28 h-28 bg-red-200 border-4 border-[#A60000] rounded-full overflow-hidden'>
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                // Placeholder or default image
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <span className="italic text-gray-600">No Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className='text-[25px] 2xl:text-[30px] font-semibold'> {userAcc?.fName} {userAcc?.lName}</div>
                        <div className='text-[22px] 2xl:text-[24px]'> {userAcc?.role} </div>
                        <Link href="/logout">
                            <button className="text-[22px] 2xl:text-[24px] text-primary cursor-pointer hover:opacity-65">
                                Logout
                            </button>
                        </Link>
                    </div>
                </div>

                <UserInformation isOpen={isOpen} userAcc={userAcc} />
            </div>
        </div>
    );
}

export default ProfilePage
