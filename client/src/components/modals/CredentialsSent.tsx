import React, { useEffect } from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";

interface CredentialsSentProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}

const CredentialsSent: React.FC<CredentialsSentProps> = ({ onClose, email }) => {

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose(false);
        }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
        document.removeEventListener('keydown', handleEscapeKey);
    };
}, [onClose]);


  return (
    <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[99999]'>
      <div className='animate-pop-out bg-white w-[460px] h-auto rounded-[20px] px-[10px] py-[20px]'>
        <div className='flex justify-center'>
          <RiFileWarningFill className='text-[95px] text-[#FFCC00]' />
        </div>
        <div className='flex flex-col justify-center items-center pb-[20px]'>
          <h1 className='font-black text-[30px]'>Email Sent!</h1>
          <p className='text-center text-[#9D9D9D] text-[19px] px-[20px]'>
            We have sent an email with your account credentials to <span className='text-black font-bold'>{email}.</span>
          </p>
        </div>
        <div className='my-[2px] px-[50px] flex justify-center '>
          <div className="bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group"
            >
            <button 
              className="text-[19px] font-black before:ease relative h-12 w-40 overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40"
              onClick={() => onClose(false)}>
              <span className="relative z-10">Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CredentialsSent