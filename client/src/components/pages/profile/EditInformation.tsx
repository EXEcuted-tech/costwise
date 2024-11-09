import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { MdModeEdit } from 'react-icons/md';
import PasswordChangeDialog from '@/components/modals/SendEmailDialog';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import SuccessChangeInfo from '@/components/modals/ConfirmChangeInfo';
import Spinner from "@/components/loaders/Spinner";
import Alert from "@/components/alerts/Alert";

type EditInformationprops = {
    setProps: React.Dispatch<React.SetStateAction<boolean>>;
    setDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen?: boolean;
    userAcc?: any;
};

const EditInformation: React.FC<EditInformationprops> = ({ setProps, setDialog, setSuccessModal, isOpen, userAcc }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [fName, setFName] = useState(userAcc?.fName || '');
    const [mName, setMName] = useState(userAcc?.mName || '');
    const [lName, setLName] = useState(userAcc?.lName || '');
    const [email, setEmail] = useState(userAcc?.email || '');
    const [phoneNum, setPhoneNum] = useState(userAcc?.phoneNum || '');
    const [suffix, setSuffix] = useState(userAcc?.suffix || '');

    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        //Reset errors
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        setPhoneNumberError(false);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|virginiafood\.com\.ph)$/i;
        const phoneRegex = /^\+63\s?9\d{9}$/;

        let errors: string[] = [];

        if (!fName) {
            setFirstNameError(true);
            errors.push("First name is required.");
        }
        if (!lName) {
            setLastNameError(true);
            errors.push("Last name is required.");
        }
        if (!email) {
            setEmailError(true);
            errors.push("Email address is required.");
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            errors.push("Invalid email address DNS.");
        }
        if (!phoneNum) {
            setPhoneNumberError(true);
            errors.push("Phone number is required.");
        } else if (!phoneRegex.test(phoneNum)) {
            setPhoneNumberError(true);
            errors.push("Please enter a valid phone number.");
        }

        if (errors.length > 0) {
            setAlertMessages(errors);
            setIsLoading(false);
            return;
        }

        const payload = {
            fName,
            mName,
            lName,
            email,
            phoneNum,
            suffix
        };
        try {
            await api.put('/user/update', payload);

            const user = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(user || '{}');

            const auditData = {
                userId: parsedUser?.userId,
                action: 'general',
                act: 'edit',
            };

            api.post('/auditlogs/logsaudit', auditData);
            setSuccessModal(true);
        } catch (error: any) {
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <>

            <form onSubmit={handleSubmit}>
                <div className="fixed top-4 right-4 z-50">
                    <div className="flex flex-col items-end space-y-2">
                        {alertMessages && alertMessages.map((msg, index) => (
                            <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
                                setAlertMessages(prev => prev.filter((_, i) => i !== index));
                            }} />
                        ))}
                    </div>
                </div>
                <div className={`${isOpen ? 'text-[15px] 2xl:text-[18px] 3xl:text-[24px] mt-[30px] 2xl:mt-[30px]' : 'text-[18px] 2xl:text-[22px] 3xl:text-[24px] mt-[30px]'} animate-crop-left-to-right flex justify-center mx-[3%] 2xl:mx-[5%]`}>
                    <button className='flex text-[1.3em] mt-[0.3rem] ml-3' onClick={() => setProps(false)}>
                        <IoIosArrowRoundBack className='text-[#6D6D6D] text-[40px] mr-[15px] hover:text-[#D13131] cursor-pointer' />
                    </button>
                    {/* 1st Col */}
                    <div className='flex flex-col ml-3 mr-8 w-[30%] gap-4'>
                        <div className='flex flex-col justify-start'>
                        <p className={`${firstNameError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>First Name <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                        <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={` ${firstNameError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg capitalize`}
                                        type="fname"
                                        name="fname"
                                        value={fName}
                                        onChange={(e) => setFName(e.target.value)}
                                        placeholder={userAcc?.fName}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                        <p className={`${emailError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Email Address <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                        <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={` ${emailError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={userAcc?.email}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353] dark:text-[#d1d1d1]">Department</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
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
                            <p className="text-[#5B5353] dark:text-[#d1d1d1]">Middle Name</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white w-full h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                        type="mname"
                                        name="mname"
                                        value={mName}
                                        onChange={(e) => setMName(e.target.value)}
                                        placeholder={userAcc?.mName}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                        <p className={`${phoneNumberError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Phone Number <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                        <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={` ${phoneNumberError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                                        type="contactnum"
                                        name="contactnum"
                                        value={phoneNum}
                                        onChange={(e) => setPhoneNum(e.target.value)}
                                        placeholder={userAcc?.phoneNum}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353] dark:text-[#d1d1d1]">Employee Number</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
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
                        <p className={`${lastNameError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Last Name<span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={` ${lastNameError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg capitalize`}
                                        type="lname"
                                        name="lname"
                                        value={lName}
                                        onChange={(e) => setLName(e.target.value)}
                                        placeholder={userAcc?.lName}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353] dark:text-[#d1d1d1]">Suffix</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                        type="suffix"
                                        name="suffix"
                                        value={suffix}
                                        onChange={(e) => setSuffix(e.target.value)}
                                        placeholder={userAcc?.suffix}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p className="text-[#5B5353] dark:text-[#d1d1d1]">Role</p>
                            <div className="flex flex-col w-full">
                                <div className="text-gray-600">
                                    <input
                                        className={`${isOpen ? 'text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-ellipsis' : 'text-[16px] 2xl:text-[18px] 3xl:text-[20px]'} bg-[#E3E1E3] h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline`}
                                        type="role"
                                        name="role"
                                        placeholder={userAcc?.position}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className={`${isOpen ? 'mt-[15px] 3xl:mt-[37px]' : 'mt-[37px]'} flex flex-col w-full justify-center items-center animate-pop-out`}>
                    <button type="submit" className={`${isLoading ? 'bg-black' : ''} flex justify-center items-center w-[25%] 2xl:w-[20%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] bg-primary text-white rounded-xl hover:bg-[#9c1c1c]`}
                        onClick={() => { handleSubmit }}
                    >
                        {isLoading && <Spinner className="group-hover:!text-white mr-1 !size-[25px]" />}
                        <span>
                            Update Profile
                        </span>
                    </button>
                    <div className="text-[#8F8F8F] text-[14px] 3xl:text-[19px] underline underline-offset-[7px] cursor-pointer hover:text-[#5B5353]"
                        onClick={() => setDialog(true)}>
                        Change Password
                    </div>
                </div>
            </form>
        </>
    )
}

export default EditInformation;