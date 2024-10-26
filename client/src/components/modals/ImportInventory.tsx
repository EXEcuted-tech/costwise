import React, { ChangeEvent, useEffect, useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { FaFileUpload } from "react-icons/fa";
import { BsExclamationCircle } from 'react-icons/bs';
import { FaFileCircleCheck, FaFileCircleXmark, FaRegFile } from "react-icons/fa6";
import Alert from '../alerts/Alert';
import api from '@/utils/api';
import { useUserContext } from '@/contexts/UserContext';

interface ImportInventoryListProps {
    onClose: () => void;
}

const ImportInventoryList: React.FC<ImportInventoryListProps> = ({ onClose }) => {
    const { currentUser } = useUserContext();
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');

    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [fileNameWithExt, setFileNameWithExt] = useState<string>('');
    const [fileSize, setFileSize] = useState<number>(0);
    const [monthYear, setMonthYear] = useState<string>('');

    //File Upload 
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
        const validTypes = ['xlsx', 'xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!validTypes.includes(file.type)) {
            setAlertMessages(['Please select a valid xlsx, xls, csv, or excel file.']);
            setAlertStatus('critical');
            return;
        }
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        setFile(file);
        setFileName(file.name.split('.').slice(0, -1).join('.'))
        setFileNameWithExt(file.name);

        //Check if file is valid
        if (file.name.toLowerCase().includes("inventory")) {
            setFileSize(parseFloat(fileSizeInMB));
            const reader = new FileReader();
            reader.onload = () => {
                // setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            setAlertMessages(['Inventory file uploaded successfully.']);
            setAlertStatus('success');

        } else {
            setFile(null);
            setFileName('');
            setFileNameWithExt('');
            setFileSize(0);
            setAlertMessages(['File must be an inventory file.']);
            setAlertStatus('critical');
        }

    };

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    //Setting values
    const handleMonthYear = (event: ChangeEvent<HTMLInputElement>) => {
        setMonthYear(event.target.value);
    };

    // Modals
    const handleCloseModal = () => {
        onClose();
    };


    //Import file
    const handleConfirm = async () => {
        const newAlertMessages: string[] = [];
        setAlertStatus('critical');

        // Reset errors
        setAlertMessages([]);
        setAlertStatus('');

        // Check required fields
        if (!monthYear && !file) {
            newAlertMessages.push('Please select a file and month and year.');
            setAlertMessages(newAlertMessages);
            setAlertStatus('critical');
            return;
        }

        if (!monthYear) {
            newAlertMessages.push('Please select a month and year.');
            setAlertStatus('critical');
        }

        if (!file) {
            newAlertMessages.push('Please select a file.');
            setAlertStatus('critical');
        }

        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            return;
        }

        // Import file
        try {
            const accessToken = localStorage.getItem('access_token');
            const formData = new FormData();

            formData.append('month_year', monthYear);
            formData.append('file_name', fileName);
            formData.append('file_name_with_extension', fileNameWithExt);
            if (file) {
                formData.append('file', file);
            }

            const response = await api.post('/inventory/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message) {
                setAlertMessages([response.data.message]);
                setAlertStatus('success');
            }

            setTimeout(function () { location.reload() }, 1000);

            const user = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(user || '{}');

            const auditData = {
                userId: parsedUser?.userId,
                action: 'crud',
                act: 'edit',
                fileName: fileName,
            };

            api.post('/auditlogs/logsaudit', auditData)
                .then(response => {
                    console.log('Audit log created successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error audit logs:', error);
                });

        } catch (error: any) {
            console.error('Error importing file:', error);
            setAlertMessages([error.response.data.message]);
            setAlertStatus('critical');
        }


        // Reset form
        setFile(null);
        setFileName('');
        setFileNameWithExt('');
        setFileSize(0);
        setMonthYear('');
    }

    return (
        <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed bg-[rgba(0,0,0,0.5)] z-[1000]'>

            <div className="fixed top-4 right-4 z-50">
                <div className="flex flex-col items-end space-y-2">
                    {alertMessages && alertMessages.map((msg, index) => (
                        <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                            setAlertMessages(prev => prev.filter((_, i) => i !== index));
                        }} />
                    ))}
                </div>
            </div>


            <div className='animate-pop-out flex flex-col bg-white dark:bg-[#3c3c3c] w-[950px] h-auto rounded-[20px] px-[10px] overflow-y-auto'>
                <div className='flex'>
                    <div className='flex group py-2 ml-8'>
                        <BsExclamationCircle className='mt-3 text-[2em] text-[#c26565] hover:text-[#B22222] cursor-pointer hover:animate-shake-tilt transition-all duration-300 ease-in-out 4xl:text-[2em] 3xl:text-[1.8em] 2xl:text-[1.8em] xl:text-[1.6em]' />
                        <div className="absolute w-[240px] h-[40px] bg-[#FFD3D3] text-[1em] text-[#B22222] font-bold p-[10px] mt-1 left-[80px] text-center items-center rounded-lg drop-shadow-lg invisible opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 4xl:text-[1em] 4xl:h-[43px] 3xl:text-[1em] 3xl:h-[30px] 2xl:text-[0.8em] 2xl:h-[42px] xl:text-[0.8em] xl:h-[40px]">
                            Fields with * are required.
                        </div>
                    </div>
                    <div className='flex ml-auto'>
                        <IoIosClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                            onClick={handleCloseModal} />
                    </div>
                </div>
                <div className='flex justify-center gap-4 mb-2'>
                    <FaFileUpload className='text-[40px] text-[#5B5353] dark:text-white' />
                    <h1 className='font-black text-[28px] mt-1 dark:text-white'>Import Inventory</h1>
                </div>
                <div className='flex flex-col justify-center items-center pb-[20px]'>
                    <p className='text-center text-[#9D9D9D] text-[17px] px-[30px]'>
                        Import an inventory file complete with all purchases and usages.
                    </p>
                </div>

                {/* File Upload Area */}
                <div className='flex justify-center items-center mb-4'>
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-[93%] h-[6rem] dark:bg-[#3c3c3c] border-2 border-dashed border-[#929090] rounded-xl cursor-pointer bg-white hover:bg-[#FFD3D3] hover:border-primary group transition-all duration-300 ease-in-out"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div className='flex flex-col items-center justify-center pt-5 pb-6 group-hover:scale-90 transition-all duration-300 ease-in-out'>
                            <p className="mb-2 text-lg text-gray-500"><span className="text-[#B22222] font-semibold underline">
                                Click to upload</span> or drag and drop inventory file.</p>
                            <p className="text-base text-gray-500">Support: XLSX, XLS, Excel</p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                    </label>
                </div>

                <div className='flex flex-row px-[30px] mt-4 mb-6'>
                    {/* File Preview */}
                    <div className="flex flex-col w-[50%]">
                        <div className='flex flex-col'>
                            <label className='text-[#5B5353] font-bold text-[22px] mb-3 dark:text-white'>Uploaded File <span className='text-[#B22222] ml-1 font-bold'>*</span></label>
                            <div className="relative w-full h-[2rem] p-6 flex items-center justify-start border-2 border-[#B3B3B3] rounded-xl hover:border-[#B22222] hover:bg-gray-100 dark:hover:bg-[#3c3c3c] transition-all duration-300 ease-in-out">
                                <div className='flex w-full'>
                                    {fileName === '' ? (
                                        <>
                                            <FaRegFile className='text-[#5B5353] dark:text-[#d1d1d1] text-[25px] mr-4' />
                                            <p className='italic mt-[2px] dark:text-white'>inventory_file.xlsx</p>
                                        </>
                                    ) : file ? (
                                        <>
                                            <FaFileCircleCheck className='text-[#35AD3E] dark:brightness-200 text-[25px] mr-4' />
                                            <p className='font-semibold mt-[2px] w-full dark:text-white'>{fileNameWithExt}</p>
                                        </>
                                    ) :
                                        <>
                                            <FaFileCircleXmark className='text-primary text-[25px] mr-4 dark:brightness-200' />
                                            <p className='italic mt-[2px] dark:text-white'>File upload unsuccessful.</p>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month Selector */}
                    <div className='flex w-[50%] pl-7 items-center'>
                        <div className='flex flex-col'>
                            <label className='text-[#5B5353] font-bold text-[22px] mb-3 dark:text-white'>Month and Year <span className='text-[#B22222] ml-1 font-bold'>*</span></label>
                            <input
                                type="month"
                                className='w-[400px] h-[2rem] py-6 px-4 text-[17px] dark:bg-[#3c3c3c] font-semibold border-2 border-[#B3B3B3] rounded-xl hover:border-[#B22222] dark:hover:bg-[#3C3C3C] hover:bg-gray-100 dark:text-white transition-all duration-300 ease-in-out'
                                value={monthYear}
                                onChange={handleMonthYear}
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='mt-8 px-[30px] mb-8 flex flex-row'>
                    <div className="w-[50%] bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center  cursor-pointer transition-all rounded-lg group"
                        onClick={handleCloseModal}
                    >
                        <button className="text-[19px] font-black before:ease relative h-12 w-full overflow-hidden bg-white dark:bg-[#3c3c3c] text-primary shadow-2xl transition-all hover:bg-[#FFD3D3] before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-24 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-white hover:before:-translate-x-[500px]">
                            <span className="relative z-10 dark:text-white">Cancel</span>
                        </button>
                    </div>
                    <div className="w-[46%] ml-7 bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center cursor-pointer transition-all rounded-lg group"
                    >
                        <button
                            className="text-[19px] font-black before:ease relative h-12 w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-[400px]"
                            onClick={handleConfirm}
                        >
                            <span className="relative z-10">Confirm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportInventoryList