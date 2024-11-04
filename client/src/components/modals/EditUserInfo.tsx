import { User } from '@/types/data';
// import defaultProfile from '@/assets/default-profile-picture.png';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { BsPersonLock } from 'react-icons/bs';
import { IoClose, IoCamera } from "react-icons/io5";
import { RiFolderUserFill } from "react-icons/ri";
import AddUserRoles, { CheckboxState } from '@/components/pages/user-management/AddUserRole';
import Image from 'next/image';
import config from '@/server/config';
import api from '@/utils/api';
import ConfirmChanges from './ConfirmChanges';
import Alert from '../alerts/Alert';
import { useUserContext } from '@/contexts/UserContext';
import { FaUser } from 'react-icons/fa6';

interface EditUserInfoProps {
    user: User;
    onClose: () => void;
}

const getRoleName = (roleId: number): string => {
    const roleNames: { [key: number]: string } = {
        0: 'Create Account',
        1: 'Update Account',
        2: 'View Account',
        3: 'Archive Account',
        4: 'View Audit Log',
        5: 'View File',
        6: 'Upload File',
        7: 'Edit File',
        8: 'Archive File',
        9: 'View Formula',
        10: 'Upload Formula',
        11: 'Edit Formula',
        12: 'Archive Formula',
        13: 'View Event',
        14: 'Create Event',
        15: 'Edit Event',
        16: 'Archive Event',
        17: 'Export File/Record'
    };
    return roleNames[roleId] || 'Unknown Role';
};


const EditUserInfo: React.FC<EditUserInfoProps> = ({ onClose, user }) => {
    const { currentUser } = useUserContext();

    const [isInitialized, setIsInitialized] = useState(false);
    const [showRolesSelectModal, setShowRolesSelectModal] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedRoleValues, setSelectedRoleValues] = useState<number[]>(Array.isArray(user.sys_role) ? user.sys_role : []);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [showConfirmChanges, setShowConfirmChanges] = useState(false);

    const [localProfileImage, setLocalProfileImage] = useState<string>(`${config.API}/storage/${user.display_picture}`);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [first_name, setFirst_name] = useState<string>('');
    const [email_address, setEmail] = useState<string>('');
    const [department, setDepartment] = useState<string>('');
    const [middle_name, setMiddle_name] = useState<string>('');
    const [employee_number, setEmployee_number] = useState<string>('');
    const [phone_number, setPhone_number] = useState<string>('');
    const [last_name, setLast_name] = useState<string>('');
    const [suffix, setSuffix] = useState<string>('');
    const [position, setPosition] = useState<string>('');

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

    useEffect(() => {
        if (user && user.sys_role) {
            const roles = Array.isArray(user.sys_role)
                ? user.sys_role
                : JSON.parse(user.sys_role);
            setSelectedRoleValues(roles);
        }
    }, [user]);

    //Roles select modal      
    const handleShowRolesSelectModal = () => {
        setShowRolesSelectModal(true);
    }

    //Prefill form fields
    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            retireveUserInfo(user);
            setIsInitialized(true);
        }
    }, [user]);

    const retireveUserInfo = async (user: User) => {
        setFirst_name(user.first_name || '');
        setMiddle_name(user.middle_name || '');
        setLast_name(user.last_name || '');
        setSuffix(user.employee_suffix || '');
        setEmail(user.email_address || '');
        setDepartment(user.department || '');
        setEmployee_number(user.employee_number || '');
        setPhone_number(user.phone_number || '');
        setPosition(user.position || '');
        setLocalProfileImage(`${config.API}/storage/${user.display_picture}`);

        let sysRoles: number[] = [];
        if (typeof user.sys_role === 'string') {
            try {
                sysRoles = JSON.parse(user.sys_role);
            } catch (error) {
            }
        } else if (Array.isArray(user.sys_role)) {
            sysRoles = user.sys_role;

        }
        const newSelectedRoles = sysRoles.map((roleId: number) => getRoleName(roleId));
        setSelectedRoles(newSelectedRoles);
    }

    //Confirm changes
    useEffect(() => {
        if (isInitialized && user && Object.keys(user).length > 0) {
            const isDirty =
                first_name !== (user.first_name || '') ||
                middle_name !== (user.middle_name || '') ||
                last_name !== (user.last_name || '') ||
                suffix !== (user.employee_suffix || '') ||
                email_address !== (user.email_address || '') ||
                department !== (user.department || '') ||
                employee_number !== (user.employee_number || '') ||
                phone_number !== (user.phone_number || '') ||
                position !== (user.position || '') ||
                localProfileImage !== (`${config.API}/storage/${user.display_picture}`) ||
                JSON.stringify(selectedRoleValues) !== JSON.stringify(user.sys_role || []);

            setIsFormDirty(isDirty);
        }
    }, [first_name, middle_name, last_name, suffix, email_address, department,
        employee_number, phone_number, position, localProfileImage, selectedRoleValues, user, isInitialized]);

    const handleNavigation = () => {
        if (isFormDirty) {
            setShowConfirmChanges(true);
        } else {
            onClose();
        }
    }

    //Update fields & file upload
    const updateField = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    }

    const updateSelect = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setter(e.target.value);
    }

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

        setProfileImage(file);

        const reader = new FileReader();
        reader.onload = () => {
            setLocalProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setAlertMessages(['Profile picture uploaded successfully.']);
        setAlertStatus('success');
    };

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
            const fullName = `${user.first_name} ${user.middle_name ? user.middle_name.charAt(0) + '. ' : ''} ${user.last_name}`;
            const users = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(users || '{}');

            const auditData = {
            userId: parsedUser?.userId,
            action: 'general',
            act: 'others_photo',
            fileName: fullName,
            };

            api.post('/auditlogs/logsaudit', auditData)
            .then(response => {
            })
            .catch(error => {
            });

        }
    };

    //Role options
    const handleConfirmRoles = (roles: number[], roleNames: string[]) => {
        setSelectedRoleValues(roles);
        setSelectedRoles(roleNames);
        setShowRolesSelectModal(false);

    }

    //Update user info
    const handleSubmit = async () => {
        const newAlertMessages: string[] = [];
        setAlertStatus('critical');

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
        if (!first_name && !last_name && !email_address && !department && !employee_number && !phone_number && !position && !profileImage && selectedRoles.length === 0) {
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
            newAlertMessages.push('Invalid email address.');
            setEmailError(true);
        }
        if (!department) {
            newAlertMessages.push('Department is required.');
            setDepartmentError(true);
        }
        if (!employee_number) {
            newAlertMessages.push('Employee number is required.');
            setEmployeeNumberError(true);
        } else if (employee_number.length < 10) {
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
        if (!profileImage && !user.display_picture) {
            newAlertMessages.push('Profile picture is required.');
            setAlertStatus('critical');
            setProfilePictureError(true);
        }
        if (selectedRoles.length === 0) {
            newAlertMessages.push("Please assign atleast one role to the user.")
            setAlertStatus('critical');
            setRoleError(true);
        }
        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const formData = new FormData();

            formData.append('first_name', first_name);
            formData.append('email_address', email_address);
            formData.append('department', department);
            formData.append('middle_name', middle_name);
            formData.append('employee_number', employee_number);
            formData.append('phone_number', phone_number);
            formData.append('last_name', last_name);
            formData.append('suffix', suffix);
            formData.append('position', position);
            formData.append('sys_role', JSON.stringify(selectedRoleValues));

            if (profileImage) {
                formData.append('display_picture', profileImage);
            }

            //Api call
            const response = await api.post(`/user/update/${user.user_id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAlertMessages([response.data.message]);
            setAlertStatus('success');
            const fullName = `${user.first_name} ${user.middle_name ? user.middle_name.charAt(0) + '. ' : ''} ${user.last_name}`;

            const userRetrieved = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(userRetrieved || '{}');

            const auditData = {
                userId: parsedUser?.userId,
                action: 'general',
                act: 'edit_user',
                fileName: fullName
            };
            api.post('/auditlogs/logsaudit', auditData)
                .then(response => {
                })
                .catch(error => {
                });

            window.location.reload();

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
        <div className='flex justify-center items-center z-[9999] w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]'>

            <div className='absolute top-0 right-0 z-[99999]'>
                {alertMessages && alertMessages.map((msg, index) => (
                    <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                        setAlertMessages(prev => prev.filter((_, i) => i !== index));
                    }} />
                ))}
            </div>
            {showConfirmChanges && (
                <ConfirmChanges
                    setConfirmChanges={setShowConfirmChanges}
                    onConfirm={() => {
                        setShowConfirmChanges(false);
                        onClose();
                    }}
                />
            )}

            {showRolesSelectModal && (
                <AddUserRoles
                    onClose={() => setShowRolesSelectModal(false)}
                    onConfirm={handleConfirmRoles}
                    initialSelectedRoles={selectedRoles}
                    initialSelectedRoleValues={selectedRoleValues}
                />
            )}

            <div className="flex flex-col w-auto h-auto mx-[50px] p-6 bg-white dark:bg-[#3C3C3C] shadow-md shadow-gray-800 rounded-lg animate-pop-out max-4xl:scale-90 max-3xl:scale-85 max-2xl:scale-80 max-xl:scale-75 max-xl:left-[15%] max-2xl:left-[20%] max-3xl:left-[25%]">

                {/* Title */}
                <div className='flex justify-center mt-1 mb-1 border-b-2 border-[#A0A0A0]'>
                    <div className="flex text-[1.6em] font-semibold ml-6 mb-2 dark:text-white">
                        <RiFolderUserFill className='mr-2 text-gray-600 text-[1.6em] dark:text-[#d1d1d1]' /> User Information
                    </div>

                    {/* Assign Roles */}
                    <div className='flex ml-auto mr-2 mb-2'>
                        <button
                            className='flex items-center bg-gray-100 rounded-lg p-2 px-3 border border-gray-300 hover:bg-gray-200 cursor-pointer transition-colors duration-300 ease-in-out'
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

                    <div className="h-[2rem] text-[2em] text-[#CECECE]">
                        <button
                            onClick={() => handleNavigation()}
                        >
                            <IoClose />
                        </button>
                    </div>
                </div>

                <div className='flex justify-center items-center gap-[5rem] mb-7 border-b-2 border-gray-300'>
                    {/* Profile Picture */}
                    <div className='flex justify-start items-center h-[10rem] mt-1 gap-[1.5rem]'>
                        <div className="group">
                            <label htmlFor="profilePictureUpload" className="cursor-pointer">
                                <div className="w-10 h-10 fixed ml-[4rem] mt-16 bg-[#A60000] rounded-full border-3 border-white p-[0.3rem] text-white text-[1.6em] group-hover:animate-shake-tilt group-hover:bg-[#DD8383] transition-all duration-300 ease-in-out flex items-center justify-center">
                                    <IoCamera />
                                </div>
                            </label>
                            <input
                                id="profilePictureUpload"
                                type="file"
                                className="hidden"
                                onChange={handleUpload}
                                accept="image/jpeg,image/png"
                            />
                            <div className='w-24 h-24 bg-gray-300 border-4 border-[#A60000] rounded-full overflow-hidden transition-all duration-300 ease-in-out'>
                                {localProfileImage != `${config.API}/storage/null` ?
                                    <div
                                        className="w-full h-full object-cover"
                                        style={{
                                            backgroundImage: `url(${localProfileImage})`,
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: 'cover'
                                        }}
                                    />
                                    :
                                    <div
                                        className='flex justify-center items-center w-full h-full rounded-full bg-gray-200'
                                    >
                                        <FaUser className='text-gray-500 text-[3rem] w-3/4 h-3/4' />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="dark:text-white">
                            <div className='text-[1.4em] font-semibold capitalize'> {user.first_name} {user.last_name} </div>
                            <div className='text-[1.1em] capitalize'> {user.position} </div>
                        </div>
                    </div>


                </div>

                {/* Form */}
                <div className='flex justify-center dark:text-white'>
                    {/* 1st Col */}
                    <div className='flex flex-col ml-3 mr-8'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p className={`${firstNameError ? 'text-[#B22222]' : ''} flex `}>First Name <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${firstNameError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base capitalize`}
                                        type="fname"
                                        name="fname"
                                        value={first_name}
                                        onChange={(e) => updateField(setFirst_name)(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p className={`${emailError ? 'text-[#B22222]' : ''} flex `}>Email Address <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${emailError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base`}
                                        type="email"
                                        name="email"
                                        value={email_address}
                                        onChange={(e) => updateField(setEmail)(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Department <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <select
                                        className={` ${departmentError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base`}
                                        name="dept"
                                        onChange={(e) => updateSelect(setDepartment)(e)}
                                    >
                                        <option value="" disabled>{user.department || 'Choose department'}</option>
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
                    <div className='flex flex-col mr-8'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Middle Name</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className='bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base border-[#B3B3B3]  focus:outline'
                                        type="mname"
                                        name="mname"
                                        value={middle_name}
                                        onChange={(e) => updateField(setMiddle_name)(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Employee Number <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${employeeNumberError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base`}
                                        type="enum"
                                        name="enum"
                                        value={employee_number}
                                        onChange={(e) => updateField(setEmployee_number)(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p>Phone Number <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${phoneNumberError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base`}
                                        type="contactnum"
                                        name="contactnum"
                                        value={phone_number}
                                        onChange={(e) => updateField(setPhone_number)(e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3rd Col */}
                    <div className='flex flex-col mr-6'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p className={`${lastNameError ? 'text-[#B22222]' : ''} flex `}>Last Name<span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${lastNameError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base capitalize`}
                                        type="lname"
                                        name="lname"
                                        value={last_name}
                                        onChange={(e) => updateField(setLast_name)(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p className={`${suffixError ? 'text-[#B22222]' : ''} flex `}>Suffix</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${suffixError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base capitalize`}
                                        type="suffix"
                                        name="suffix"
                                        value={suffix}
                                        onChange={(e) => updateField(setSuffix)(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-4'>
                            <p className={`${positionError ? 'text-[#B22222]' : ''} flex `}>Position <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${positionError ? 'text-[#B22222] focus:!outline-[#B22222] border-3 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} bg-white dark:bg-[#3C3C3C] dark:text-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg text-[13px] 2xl:text-base capitalize`}
                                        type="position"
                                        name="position"
                                        value={position}
                                        onChange={(e) => updateField(setPosition)(e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex w-full mt-7 justify-center'>
                    <button
                        className='w-[7rem] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] text-white mr-4 shadow-lg rounded-xl hover:bg-[#006900] transition-colors duration-300 ease-in-out'
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditUserInfo;