"use client";

import React, { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image';
import background from '@/assets/virginia-mascot-bg.png';
import { FcImageFile } from "react-icons/fc";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { RiCloseLargeFill } from "react-icons/ri";
import { BsExclamationCircle, BsPersonLock } from "react-icons/bs";
import { useSidebarContext } from '@/contexts/SidebarContext';
import api from '@/utils/api';
import Alert from "@/components/alerts/Alert";
import { useRouter } from 'next/navigation';
import ConfirmChanges from '@/components/modals/ConfirmChanges';
import AddUserRoles from '@/components/pages/user-management/AddUserRole';
// import dotenv from "dotenv";
import { useUserContext } from '@/contexts/UserContext';

const AccountCreation = () => {
    const router = useRouter();
    const { isOpen } = useSidebarContext();
    const [showRolesSelectModal, setShowRolesSelectModal] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [showConfirmChanges, setShowConfirmChanges] = useState(false);

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<number | null>(null);
    const [first_name, setFirst_name] = useState<string>('');
    const [email_address, setEmail] = useState<string>('');
    const [department, setDepartment] = useState<string>('');
    const [middle_name, setMiddle_name] = useState<string>('');
    const [employee_number, setEmployee_number] = useState<string>('');
    const [phone_number, setPhone_number] = useState<string>('');
    const [last_name, setLast_name] = useState<string>('');
    const [suffix, setSuffix] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedRoleValues, setSelectedRoleValues] = useState<number[]>([]);
    const [selectedUserType, setSelectedUserType] = useState<string>('Regular');
    const user_type = selectedUserType;
    const defaultPassword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD; //default password

    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [suffixError, setSuffixError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [departmentError, setDepartmentError] = useState(false);
    const [employeeNumberError, setEmployeeNumberError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [positionError, setPositionError] = useState(false);
    const [profilePictureError, setProfilePictureError] = useState(false);
    const [roleError, setRoleError] = useState(false);

    const { currentUser } = useUserContext();

    //Confirm changes
    useEffect(() => {
        const isDirty = first_name !== '' || middle_name !== '' || last_name !== '' ||
            suffix !== '' || email_address !== '' || department !== '' ||
            employee_number !== '' || phone_number !== '' || position !== '' ||
            profileImage !== null;
        setIsFormDirty(isDirty);
    }, [first_name, middle_name, last_name, suffix, email_address, department,
        employee_number, phone_number, position, profileImage]);


    // Update form fields
    const updateField = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setter(e.target.value);
        setIsFormDirty(true);
    };

    const handleNavigation = (url: string) => {
        if (isFormDirty) {
            setShowConfirmChanges(true);
        } else {
            router.push(url);
        }
    };

    //Role options
    const handleConfirmRoles = (roles: number[], roleNames: string[], userType: string) => {
        setSelectedRoleValues(roles);
        setSelectedRoles(roleNames);
        setSelectedUserType(userType);
        setShowRolesSelectModal(false);
    }

    const handleShowRolesSelectModal = () => {
        setShowRolesSelectModal(true);
    }

    //Image upload
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setAlertMessages(['Please select a valid image file.']);
            setAlertStatus('critical');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setAlertMessages(['File size exceeds 2MB.']);
            setAlertStatus('critical');
            return;
        }

        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

        setProfileImage(file);
        setImageName(file.name);
        setImageSize(parseFloat(fileSizeInMB));
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        setAlertMessages(['Profile picture uploaded successfully.']);
        setAlertStatus('success');
    };

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    //Create user
    const handleSubmit = async () => {
        const newAlertMessages: string[] = [];
        setAlertStatus('critical');

        // Updated email regex to validate specific domains
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|virginiafood\.com\.ph)$/i;
        const phoneRegex = /^\+63\s?9\d{9}$/;

        // Reset errors
        setFirstNameError(false);
        setLastNameError(false);
        setSuffixError(false);
        setEmailError(false);
        setDepartmentError(false);
        setEmployeeNumberError(false);
        setPhoneNumberError(false);
        setPositionError(false);
        setProfilePictureError(false);
        setRoleError(false);

        // Check required fields
        if (!first_name && !last_name && !email_address && !department && !employee_number && !phone_number && !position && !profileImage && selectedRoleValues.length === 0) {
            newAlertMessages.push('Fill in all required fields!');
            setAlertMessages(newAlertMessages);
            return;
        }
        if (!first_name) {
            newAlertMessages.push('First name is required.');
            setFirstNameError(true);
        }
        if (!last_name) {
            newAlertMessages.push('Last name is required.');
            setLastNameError(true);
        }
        if (suffix && (suffix.length < 1 || suffix.length > 2)) {
            newAlertMessages.push('Suffix must be 1-2 characters long.');
            setSuffixError(true);
        }
        if (!email_address) {
            newAlertMessages.push('Email address is required.');
            setEmailError(true);
        } else if (!emailRegex.test(email_address)) {
            newAlertMessages.push('Invalid email address DNS.');
            setEmailError(true);
        }
        if (!department) {
            newAlertMessages.push('Department is required.');
            setDepartmentError(true);
        }
        if (!employee_number) {
            newAlertMessages.push('Employee number is required.');
            setEmployeeNumberError(true);
        } else if (employee_number.length < 10 || employee_number.length > 10) {
            newAlertMessages.push('Employee number must be 10 digits.');
            setEmployeeNumberError(true);
        }
        if (!phone_number) {
            newAlertMessages.push('Phone number is required.');
            setPhoneNumberError(true);
        } else if (!phoneRegex.test(phone_number)) {
            newAlertMessages.push('Invalid phone number.');
            setPhoneNumberError(true);
        }
        if (!position) {
            newAlertMessages.push('Position is required.');
            setPositionError(true);
        }
        if (selectedRoleValues.length === 0) {
            newAlertMessages.push("Please assign atleast one role to the user.")
            setAlertStatus('critical');
            setRoleError(true);
        }
        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            return;
        }

        // Create user
        try {
            const accessToken = localStorage.getItem('accessToken');
            const formData = new FormData();

            formData.append('user_type', user_type);
            formData.append('first_name', first_name);
            formData.append('email_address', email_address);
            formData.append('department', department);
            formData.append('middle_name', middle_name);
            formData.append('employee_number', employee_number);
            formData.append('phone_number', phone_number);
            formData.append('last_name', last_name);
            formData.append('suffix', suffix);
            formData.append('position', position);
            formData.append('password', defaultPassword || '');
            formData.append('sys_role', JSON.stringify(selectedRoleValues));

            if (profileImage) {
                formData.append('display_picture', profileImage);
            }

            //Api call
            const response = await api.post('/register', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAlertMessages([response.data.message]);
            setAlertStatus('success');

            const user = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(user || '{}');

            const auditData = {
                userId: parsedUser?.userId,
                action: 'general',
                act: 'create',
            };

            api.post('/auditlogs/logsaudit', auditData)
                .then(response => {
                })
                .catch(error => {
                });

            // Reset form fields
            setFirst_name('');
            setMiddle_name('');
            setLast_name('');
            setSuffix('');
            setEmail('');
            setDepartment('');
            setEmployee_number('');
            setPhone_number('');
            setPosition('');
            setProfileImage(null);
            setPreviewUrl('');
            setSelectedRoleValues([]);
            setSelectedRoles([]);
        } catch (error: any) {
            let errorMessages: string[] = []

            if (error.response && error.response.data) {
                const responseData = error.response.data;

                if (responseData.errors && typeof responseData.errors === 'object') {
                    Object.values(responseData.errors).forEach((errorArray: any) => {
                        if (Array.isArray(errorArray)) {
                            errorMessages = errorMessages.concat(errorArray);
                        }
                    });
                } else if (responseData.message) {
                    errorMessages.push(responseData.message);
                }
            }

            if (errorMessages.length === 0) {
                errorMessages.push('Unexpected error occurred. Please try again.');
            }

            setAlertMessages(errorMessages);
            setAlertStatus('critical');
        }

    }

    return (
        <>

            {showRolesSelectModal && (
                <AddUserRoles
                    onClose={() => setShowRolesSelectModal(false)}
                    onConfirm={handleConfirmRoles}
                    initialSelectedRoles={selectedRoles}
                    initialSelectedRoleValues={selectedRoleValues}
                    isEditing={false}
                />
            )}

            {showConfirmChanges && (
                <ConfirmChanges
                    setConfirmChanges={setShowConfirmChanges}
                    onConfirm={() => {
                        setShowConfirmChanges(false);
                        router.push('/user-management');
                    }}
                />
            )}
            <div className="w-full h-full flex flex-row font-lato animate-fade-in3">
                <div className='absolute top-0 right-0'>
                    {alertMessages && alertMessages.map((msg, index) => (
                        <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                            setAlertMessages(prev => prev.filter((_, i) => i !== index));
                        }} />
                    ))}
                </div>

                <div className='hidden 2xl:flex h-full bg-cover bg-center 2xl:w-[30%]' style={{ backgroundImage: `url(${background.src})` }} />
                {/* Wait lang butngan panig margin */}
                <div className={` ${isOpen ? 'w-full' : 'w-full'} 
                    h-full bg-white dark:bg-[#3C3C3C] shadow-2xl`}>
                    {/* Title */}
                    <div className={` flex flex-col w-full h-[7.3rem] justify-center items-center`}>
                        <div className='flex w-full items-center'>
                            <div className='flex ml-4 mt-2 text-[2.5em] text-[#B22222] hover:text-[#7e2a2a] transition-colors duration-300 ease-in-out'>
                                <IoMdArrowRoundBack
                                    className='cursor-pointer'
                                    onClick={() => handleNavigation('/user-management')}
                                />
                            </div>
                            <p className='font-black text-[1.9em] 3xl:text-[2.2em] flex-grow text-center dark:text-white mr-[1.7em]'>
                                Account Creation</p>
                        </div>
                        <div className='mb-2 text-[1.1em] 3xl:text-[1.4em] dark:text-white'> Create an employee account </div>
                        <div className='w-full h-[15px] bg-[#B22222]'></div>
                    </div>

                    {/* Upload Picture */}
                    <div className='flex items-center justify-center w-full h-[18rem] dark:bg-[#3C3C3C] border-[#929090] border-b-3 bg-white'>
                        {previewUrl ? (
                            <div className="flex flex-col items-center justify-center w-full animate-fade-in2">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col dark:bg-[#3C3C3C] items-center justify-center w-[93%] h-[6rem] border-2 border-dashed border-[#929090] rounded-xl cursor-pointer bg-white hover:bg-[#FFD3D3] hover:border-primary group transition-all duration-300 ease-in-out"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <div className='flex flex-col items-center justify-center pt-5 pb-6 group-hover:scale-90 transition-all duration-300 ease-in-out'>
                                        <p className="mb-2 text-lg text-gray-500"><span className="text-[#B22222] font-semibold underline">Click to upload</span> or drag and drop profile picture</p>
                                        <p className="text-base text-gray-500">Support: JPG, JPEG, PNG (max: 2MB)</p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={handleUpload}
                                        accept="image/jpeg,image/png"
                                    />
                                </label>

                                {/* Image Preview */}
                                <div className="relative mt-5 w-[93%] h-[6rem] p-6 flex items-center justify-start animate-fade-in2 border-2 border-[#B3B3B3] rounded-xl group hover:border-[#B22222] hover:bg-gray-100 dark:hover:bg-[#3C3C3C] transition-all duration-300 ease-in-out">
                                    <div className='flex mr-5 group-hover:scale-95 transition-all duration-300 ease-in-out w-16 h-16 border-2 border-[#A60000] rounded-full overflow-hidden'>
                                        <div
                                            className="w-full h-full object-cover"
                                            style={{
                                                backgroundImage: `url(${previewUrl})`,
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover'
                                            }}
                                        />

                                    </div>
                                    <div className='flex flex-col text-[16px] group-hover:text-[#B22222] transition-all duration-300 ease-in-out'>
                                        <p className='font-semibold'>{imageName}</p>
                                        <p className='text-[#929090]'>{imageSize} MB</p>
                                    </div>

                                    <FaCheck className='ml-auto text-[1.5em] text-[#B22222] visible opacity-100 group-hover:invisible group-hover:opacity-0 animate-zoom-out transition-all duration-300 ease-in-out' />

                                    <button
                                        onClick={() => {
                                            setProfileImage(null);
                                            setPreviewUrl(null);
                                            setAlertMessages(['Profile picture removed.']);
                                            setAlertStatus('warning');
                                        }}
                                        className="absolute top-7 right-5 bg-[#B22222] text-white rounded-full p-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 animate-zoom-in transition-all duration-300 ease-in-out"
                                    >
                                        <RiCloseLargeFill />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center dark:bg-[#3C3C3C] justify-center w-[93%] h-[13rem] border-2 border-dashed border-[#929090] rounded-xl cursor-pointer bg-white hover:bg-[#FFD3D3] hover:border-primary group transition-all duration-300 ease-in-out"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className='flex flex-col items-center dark:bg-[#3C3C3C] justify-center pt-5 pb-6 group-hover:scale-90 transition-all duration-300 ease-in-out'>
                                    <FcImageFile className="w-16 h-16 mb-4 text-[5em] text-gray-500" />
                                    <p className="mb-2 text-lg text-gray-500"><span className="text-[#B22222] font-semibold underline">Click to upload</span> or drag and drop profile picture</p>
                                    <p className="text-base text-gray-500">Support: JPG, JPEG, PNG (max: 2MB)</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleUpload}
                                    accept="image/jpeg,image/png"
                                />
                            </label>
                        )}
                    </div>

                    {/* Tooltip & Assign Roles*/}
                    <div className='flex flex-col pr-12 pt-4 '>
                        <div className='flex'>
                            <div className="flex w-full">
                                <div className='flex w-[800px]'>
                                    <button
                                        className='flex items-center ml-12 mr-4 bg-gray-100 rounded-lg p-2 px-3 border border-gray-300 hover:bg-gray-200 cursor-pointer transition-colors duration-300 ease-in-out'
                                        onClick={handleShowRolesSelectModal}
                                    >
                                        <BsPersonLock className='text-[1.7em] text-[#5B5353]' />
                                        <span className=' text-[1.1em] text-gray-600 ml-2 mt-1'>User Roles</span>
                                        {selectedRoles.length > 0 && !roleError && (
                                            <span className="ml-2 mt-1 text-sm text-gray-600">
                                                {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <div className='ml-auto group'>
                                    <BsExclamationCircle className='mt-3 text-[2em] cursor-pointer text-[#c26565] hover:text-[#B22222] hover:animate-shake-tilt transition-all duration-300 ease-in-out 4xl:text-[2em] 3xl:text-[1.8em] 2xl:text-[1.8em] xl:text-[1.6em]' />
                                    <div className="absolute w-[250px] h-[48px] bg-[#FFD3D3] text-[1em] text-[#B22222] font-bold p-3 mt-2 right-[90px] top-[26rem] text-center items-center rounded-lg drop-shadow-lg invisible opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 4xl:text-[1em] 4xl:h-[48px] 3xl:text-[1em] 3xl:h-[44px] 2xl:text-[0.8em] 2xl:h-[42px] xl:text-[0.8em] xl:h-[40px]">
                                        Fields with * are required.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className={`${isOpen ? '' : ''} flex mt-6 text-[#5B5353] text-[16px] ml-[50px] mb-12 2xl:mb-6 justify-between`}>
                            {/* 1st Col */}
                            <div className={` ${isOpen ? '' : ''} flex flex-col flex-1 mr-5 2xl:mr-9 gap-10`}>
                                <div className='flex flex-col justify-start'>
                                    <p className={`${firstNameError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>First Name <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${firstNameError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg capitalize`}
                                                type="fname"
                                                name="fname"
                                                value={first_name}
                                                onChange={(e) => updateField(setFirst_name)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <p className={`${emailError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Email Address <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${emailError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                                                type="email"
                                                name="email"
                                                placeholder=""
                                                value={email_address}
                                                onChange={(e) => updateField(setEmail)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <p className={`${departmentError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Department<span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <select
                                                className={` ${departmentError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                                                defaultValue=""
                                                value={department}
                                                onChange={(e) => updateField(setDepartment)(e)}
                                            >
                                                <option value="" disabled>Choose department</option>
                                                <option value="cost accounting">Cost Accounting</option>
                                                <option value="human resources">Human Resources</option>
                                                <option value="research development">Research & Development</option>
                                                <option value="research development">IT Department</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2nd Col */}
                            <div className='flex flex-col flex-1 mr-5 2xl:mr-9 gap-10'>
                                <div className='flex flex-col justify-start'>
                                    <p className='dark:text-[#d1d1d1]'>Middle Name</p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${isOpen ? '' : ''} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline capitalize `}
                                                type="mname"
                                                name="mname"
                                                placeholder=""
                                                value={middle_name}
                                                onChange={(e) => updateField(setMiddle_name)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <p className={`${employeeNumberError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Employee Number <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${employeeNumberError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                                                type="enum"
                                                name="enum"
                                                placeholder="10 digits"
                                                value={employee_number}
                                                onChange={(e) => updateField(setEmployee_number)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <p className={`${phoneNumberError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Phone Number <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${phoneNumberError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                                                type="contactnum"
                                                name="contactnum"
                                                placeholder="+63 9123456789"
                                                value={phone_number}
                                                onChange={(e) => updateField(setPhone_number)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3rd Col */}
                            <div className='flex flex-col flex-1 gap-10'>
                                <div className='flex flex-col justify-start'>
                                    <p className={`${lastNameError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Last Name<span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${lastNameError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg capitalize`}
                                                type="lname"
                                                name="lname"
                                                placeholder=""
                                                value={last_name}
                                                onChange={(e) => updateField(setLast_name)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <p className={`${suffixError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Suffix</p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${suffixError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg capitalize`}
                                                type="suffix"
                                                name="suffix"
                                                placeholder=""
                                                value={suffix}
                                                onChange={(e) => updateField(setSuffix)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <p className={`${positionError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} flex `}>Position <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                    <div className="flex flex-col w-full">
                                        <div className="mt-2 text-gray-600">
                                            <input
                                                className={` ${positionError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg capitalize`}
                                                type="position"
                                                name="position"
                                                placeholder=""
                                                value={position}
                                                onChange={(e) => updateField(setPosition)(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className='flex flex-col mt-5 w-full text-[1.1em] 2xl:text-[1.2em] items-center gap-[10px]'>
                        <div className="relative bg-primary overflow-hidden text-white w-[240px] h-[2.5em] 4xl:h-[3rem] flex items-center justify-center rounded-[10px] cursor-pointer transition-all hover:border-1 hover:border-primary group">
                            <button
                                className="font-black"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                <span className="w-full h-48 rounded bg-white absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                                <span className="relative w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-primary">Confirm</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountCreation;