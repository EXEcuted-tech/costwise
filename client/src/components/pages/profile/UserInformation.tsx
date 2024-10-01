import Link from 'next/link';
import React, { useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import EditInformation from './EditInformation';
import PasswordChangeDialog from '@/components/modal/PasswordChangeDialog';

type UserInformationProps ={
    isOpen: boolean;
    userAcc: any;
}

const UserInformation: React.FC<UserInformationProps> = ( {isOpen, userAcc} ) => {
    const [props, setProps] = useState(false);
    const [dialog, setDialog] = useState(false);
    
    return (
        <>
        {dialog && 
            <PasswordChangeDialog 
            setDialog={setDialog}
            />
        }
        {props ? 
        <EditInformation setProps={setProps} setDialog={setDialog} isOpen={isOpen} userAcc={userAcc}/>
        :
        <div className="mx-8 2xl:mx-12">
            <div className={`${isOpen ? 'text-[24px] 2xl:text-[32px]' : 'text-[28px] 2xl:text-[32px]'} flex text-[#8E8E8E] font-semibold mt-3 mb-2`}>
                User Information
                <button className={`${isOpen ? 'text-[26px] 2xl:text-[36px]' : 'text-[30px] 2xl:text-[36px]'} px-3 text-black mr-2 mt-1 rounded-lg`} onClick={()=>setProps(true)}>
                    <MdModeEdit/>
                </button>
            </div>
            <div className={`${isOpen ? 'text-[13px] 2xl:text-[17px] 3xl:text-[22px] 4xl:text-[24px]' : 'text-[18px] 2xl:text-[22px] 3xl:text-[24px]'} flex justify-center border-2 border-[#D9D9D9] py-5 text-black gap-[10%] rounded-[15px]`}>
                {/* 1st Col */}
                <div className='flex flex-col ml-3'>
                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">First Name</p>
                        <p>{userAcc?.fName}</p>
                    </div>

                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Email Address</p>
                        <p>{userAcc?.email}</p>
                    </div>

                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Department</p>
                        <p>{userAcc?.dept}</p>
                    </div>
                </div>

                {/* 2nd Col */}
                <div className='flex flex-col'>
                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Middle Name</p>
                        <p>{userAcc?.mName}</p>
                    </div>

                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Phone Number</p>
                        <p>{userAcc?.phoneNum}</p>
                    </div>

                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Employee Number</p>
                        <p>{userAcc?.employeeNum}</p>
                    </div>
                </div>

                {/* 3rd Col */}
                <div className='flex flex-col mr-6'>
                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Last Name</p>
                        <p>{userAcc?.lName}</p>
                    </div>

                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Suffix</p>
                        <p>{!userAcc?.suffix ? " " : userAcc?.suffix}</p>
                    </div>

                    <div className='flex flex-col justify-start mb-4'>
                        <p className="text-[#8E8E8E] font-semibold">Role</p>
                        <p>{userAcc?.role}</p>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default UserInformation;