import React, { ChangeEvent, useEffect, useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { FaFileUpload } from "react-icons/fa";
import { BsExclamationCircle } from 'react-icons/bs';
import { FaFileCircleCheck, FaFileCircleXmark, FaRegFile } from "react-icons/fa6";
import Alert from '../alerts/Alert';

interface ImportInventoryListProps { 
  onClose: () => void;
  onConfirm: () => void;
}

const ImportInventoryList: React.FC<ImportInventoryListProps> = ({ onClose, onConfirm, }) => {
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');

    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('inventory_file.xlsx');
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
        if (!file.type.startsWith('xlsx/')) {
            setAlertMessages(['Please select a valid xlsx file.']);
            setAlertStatus('critical');
            return;
        }
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

        setFile(file);
        setFileName(file.name);
        setFileSize(parseFloat(fileSizeInMB));
        const reader = new FileReader();
        reader.onload = () => {
            // setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        setAlertMessages(['Inventory file uploaded successfully.']);
        setAlertStatus('success');
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
    const handleConfirm = () => {
        const newAlertMessages: string[] = [];
        setAlertStatus('critical');

        // Reset errors
        setAlertMessages([]);
        setAlertStatus('');

        // Check required fields
        if (!monthYear && !file) {
            newAlertMessages.push('Please select a file and month and year.');
        }

        if (!monthYear) {
            newAlertMessages.push('Please select a month and year.');
        }

        if (!file) {
            newAlertMessages.push('Please select a file.');
        }

        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            return;
        }
        
        // Import file


        // Reset form
        setFile(null);
        setFileName('');
        setFileSize(0);
        setMonthYear('');
    }

  return (
    <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]'>
        
        <div className='absolute top-0 right-0'>
            {alertMessages && alertMessages.map((msg, index) => (
            <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                setAlertMessages(prev => prev.filter((_, i) => i !== index));
            }} />
        ))}
        </div>


      <div className='animate-pop-out flex flex-col bg-white w-[950px] h-auto rounded-[20px] px-[10px] overflow-y-auto'>
        <div className='flex'>
            <div className='flex group py-2 ml-8'> 
                    <BsExclamationCircle className='mt-3 text-[2em] text-[#c26565] hover:text-[#B22222] cursor-pointer hover:animate-shake-tilt transition-all duration-300 ease-in-out 4xl:text-[2em] 3xl:text-[1.8em] 2xl:text-[1.8em] xl:text-[1.6em]'/>
                    <div className="absolute w-[240px] h-[48px] bg-[#FFD3D3] text-[1em] text-[#B22222] font-bold p-[10px] mt-1 left-[80px] text-center items-center rounded-lg drop-shadow-lg invisible opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 4xl:text-[1em] 4xl:h-[48px] 3xl:text-[1em] 3xl:h-[44px] 2xl:text-[0.8em] 2xl:h-[42px] xl:text-[0.8em] xl:h-[40px]">
                            Fields with * are required.
                    </div>
            </div>
            <div className='flex ml-auto'>
                <IoIosClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                    onClick={handleCloseModal} />
            </div>
        </div>
        <div className='flex justify-center gap-4 mb-2'>
          <FaFileUpload className='text-[40px] text-[#5B5353]' />
          <h1 className='font-black text-[28px] mt-1'>Import Inventory</h1>
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
                className="flex flex-col items-center justify-center w-[93%] h-[6rem] border-2 border-dashed border-[#929090] rounded-xl cursor-pointer bg-white hover:bg-[#FFD3D3] hover:border-primary group transition-all duration-300 ease-in-out"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                                    >   
                <div className='flex flex-col items-center justify-center pt-5 pb-6 group-hover:scale-90 transition-all duration-300 ease-in-out'>
                    <p className="mb-2 text-lg text-gray-500"><span className="text-[#B22222] font-semibold underline">
                        Click to upload</span> or drag and drop inventory file.</p>
                    <p className="text-base text-gray-500">Support: XLSX</p>
                </div>
                <input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden"
                    onChange={handleUpload}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
            </label>
        </div>

        <div className='flex flex-row justify-between px-[30px] mt-4 mb-6'>
            {/* Month Selector */}
            <div className='flex w-[50%] items-center'>
                <div className='flex flex-col'>
                    <label className='text-[#5B5353] font-bold text-[22px] mb-3'>Month and Year</label>
                    <input 
                        type="month" 
                        className='w-[400px] h-[2rem] py-6 px-4 text-[17px] font-semibold border-2 border-[#B3B3B3] rounded-xl hover:border-[#B22222] hover:bg-gray-100 transition-all duration-300 ease-in-out'
                        value={monthYear}
                        onChange={handleMonthYear}
                    />
                </div>
            </div>
            
            {/* File Preview */}
            <div className="flex flex-col w-[50%] mr-auto">
                <div className='flex flex-col'>
                    <label className='text-[#5B5353] font-bold text-[22px] mb-3'>Uploaded File</label>              
                    <div className="relative h-[2rem] p-6 flex items-center justify-start border-2 border-[#B3B3B3] rounded-xl hover:border-[#B22222] hover:bg-gray-100 transition-all duration-300 ease-in-out">
                        <div className='flex mr-5'>
                            <FaRegFile className='text-[#5B5353] text-[25px] mr-4' />
                            <p className='font-semibold mr-3'>{fileName}</p>   
                            <p className='text-[#929090]'>{fileSize} MB</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Buttons */}
        <div className='mt-8 px-[30px] mb-8 flex flex-row justify-between'>
          <div className="w-[46%] bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center  cursor-pointer transition-all rounded-lg group"
            onClick={handleCloseModal}
          >
            <button className="text-[19px] font-black before:ease relative h-12 w-full overflow-hidden bg-white text-primary shadow-2xl transition-all hover:bg-[#FFD3D3] before:absolute before:right-0 before:top-0 before:h-12 before:w-20 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-white hover:before:-translate-x-40">
              <span className="relative z-10">Cancel</span>
            </button>
          </div>
          <div className="w-[50%] bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center cursor-pointer transition-all rounded-lg group"
            >
            <button 
              className="text-[19px] font-black before:ease relative h-12 w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40"
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