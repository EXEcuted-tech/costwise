import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { MdModeEdit } from 'react-icons/md';
import PasswordChangeDialog from '@/components/modal/PasswordChangeDialog';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import SuccessChangeInfo from '@/components/modals/ConfirmChangeInfo';
import Spinner from "@/components/loaders/Spinner";

type EditInformationprops = {
    setProps: React.Dispatch<React.SetStateAction<boolean>>;
    setDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen?: boolean;
    userAcc?: any;
};

const EditInformation: React.FC<EditInformationprops> = ( {setProps, setDialog, setSuccessModal, isOpen, userAcc} ) => {
    const [isLoading, setIsLoading] = useState(false);

    const [fName, setFName] = useState(userAcc?.fName || '');
    const [mName, setMName] = useState(userAcc?.mName || '');
    const [lName, setLName] = useState(userAcc?.lName || '');
    const [email, setEmail] = useState(userAcc?.email || '');
    const [phoneNum, setPhoneNum] = useState(userAcc?.phoneNum || '');
    const [suffix, setSuffix] = useState(userAcc?.suffix || '');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            fName,
            mName,
            lName,
            email,
            phoneNum,
            suffix
        };
        console.log("This is payload: ", payload);

        try{
            await api.put('/user/update', payload);
        }catch(error: any){
            console.log("Error updating user info", error);
        }finally {
            setIsLoading(false);
        }
        
    }
    
    return (
        <>
            <form onSubmit={handleSubmit}>
            <div className={`${isOpen ? 'text-[15px] 2xl:text-[18px] 3xl:text-[24px] mt-[30px] 2xl:mt-[30px]' : 'text-[18px] 2xl:text-[22px] 3xl:text-[24px] mt-[30px]'} flex justify-center mx-[3%] 2xl:mx-[5%]`}>
                <button className='flex text-[1.3em] mt-[0.3rem] ml-3' onClick={()=> setProps(false)}>
                    <IoIosArrowRoundBack className='text-[#6D6D6D] text-[40px] mr-[15px] hover:text-[#D13131] cursor-pointer'/>
                </button>
                {/* 1st Col */}
                
                <div className='flex flex-col ml-3 mr-8 w-[30%] gap-4'>
                    <div className='flex flex-col justify-start'>
                        <p className="text-[#5B5353]">First Name*</p>
                        <div className="flex flex-col w-full">
                            <div className="text-gray-600">
                                <input
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white h-12 w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="fname"
                                    name="fname"
                                    onChange={(e) => setFName(e.target.value)}
                                    placeholder={userAcc?.fName}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start'>
                        <p className="text-[#5B5353]">Email Address*</p>
                        <div className="flex flex-col w-full">
                            <div className="text-gray-600">
                                <input
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white h-12 w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="email"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={userAcc?.email}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start'>
                        <p className="text-[#5B5353]">Department</p>
                        <div className="flex flex-col w-full">
                            <div className="text-gray-600">
                                <input
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    name="dept"
                                    placeholder={userAcc?.dept}
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
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="mname"
                                    name="mname"
                                    onChange={(e) => setMName(e.target.value)}
                                    placeholder={userAcc?.mName}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start'>
                        <p className="text-[#5B5353]">Phone Number*</p>
                        <div className="flex flex-col w-full">
                            <div className="text-gray-600">
                                <input
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="contactnum"
                                    name="contactnum"
                                    onChange={(e) => setPhoneNum(e.target.value)}
                                    placeholder={userAcc?.phoneNum}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start'>
                        <p className="text-[#5B5353]">Employee Number</p>
                        <div className="flex flex-col w-full">
                            <div className="text-gray-600">
                                <input
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="enum"
                                    name="enum"
                                    placeholder={userAcc?.employeeNum}
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
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="lname"
                                    name="lname"
                                    onChange={(e) => setLName(e.target.value)}
                                    placeholder={userAcc?.lName}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start'>
                        <p className="text-[#5B5353]">Suffix</p>
                        <div className="flex flex-col w-full">
                            <div className="text-gray-600">
                                <input
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="suffix"
                                    name="suffix"
                                    onChange={(e) => setSuffix(e.target.value)}
                                    placeholder={userAcc?.suffix}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start'>
                        <p className="text-[#5B5353]">Role</p>
                        <div className="flex flex-col w-full">
                            <div className="text-gray-600">
                                <input
                                    className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-[95%] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                    type="role"
                                    name="role"
                                    placeholder={userAcc?.role}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Buttons */}
            <div className={`${isOpen ? 'mt-[15px] 3xl:mt-[37px]' : 'mt-[37px]'} flex flex-col w-full justify-center items-center`}>
                <button type="submit" className={`${isLoading ? 'bg-black': ''} flex justify-center items-center w-[25%] 2xl:w-[20%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] bg-primary text-white rounded-xl hover:bg-[#9c1c1c]`}
                onClick={() => {
                    setSuccessModal(true); 
                    handleSubmit;
                    }}
                >
                    {isLoading && <Spinner className="group-hover:!text-white mr-1 !size-[25px]" />}
                    <span>
                        Update Profile 
                    </span>
                </button>
                <div className="text-[#8F8F8F] text-[14px] 3xl:text-[19px] underline underline-offset-[7px] cursor-pointer hover:text-[#5B5353]"
                    onClick={() => setDialog(true)}>
                    Request Password Reset
                </div>
            </div>
            </form>    
        </>
    )
}

export default EditInformation;