import React from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { useFileManagerContext } from '@/contexts/FileManagerContext';
import { useRouter } from 'next/navigation';

interface ConfirmDialogProps {
    setConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
    onProceed: () => void;
}

const ConfirmTraining: React.FC<ConfirmDialogProps> = ({ setConfirmDialog, onProceed }) => {

    return (
        <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-[.25] z-[1000] z-[1000]'>
            <div className='animate-pop-out bg-white w-[460px] h-[380px] rounded-[20px] px-[10px]'>
                <div className='flex justify-end'>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={() => { setConfirmDialog(false) }} />
                </div>
                <div className='flex justify-center'>
                    <RiFileWarningFill className='text-[75px] text-[#FFCC00]' />
                </div>
                <div className='flex flex-col justify-center items-center pb-[10px]'>
                    <h1 className='font-black text-[30px]'>Are You Sure?</h1>
                    <p className='text-center text-[#9D9D9D] text-[19px] px-[30px]'>
                        Proceeding with the export will start the data processing required for model training. 
                        Do you wish to continue?
                    </p>
                </div>
                <div className='my-[2px] px-[50px] grid grid-cols-2 gap-4'>
                    <div className="relative inline-flex bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group"
                        onClick={onProceed}>
                        <button className="text-[19px] font-black before:ease relative h-12 w-40 overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40">
                            <span className="relative z-10">Proceed</span>
                        </button>
                    </div>
                    <div className="relative inline-flex bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group"
                        onClick={() => { setConfirmDialog(false) }}>
                        <button className="text-[19px] font-black before:ease relative h-12 w-40 overflow-hidden bg-white text-primary shadow-2xl transition-all hover:bg-[#FFD3D3] before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-white hover:before:-translate-x-40">
                            <span className="relative z-10">Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmTraining