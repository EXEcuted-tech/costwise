import React from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosWarning } from "react-icons/io";

const ErrorToken: React.FC = () => {

  const handleClose = () => {
    window.close();
  };

  return (
    <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[99999]'>
      <div className='animate-pop-out bg-white w-[460px] h-auto rounded-[20px] px-[10px] py-[20px]'>
        <div className='flex justify-center'>
          <IoIosWarning className='text-[95px] text-[#b22222]' />
        </div>
        <div className='flex flex-col justify-center items-center pb-[20px]'>
          <h1 className='font-black text-[30px]'>Invalid Token!</h1>
          <p className='text-center text-[#9D9D9D] text-[19px]'>
            This link is is invalid or expired.
          </p>
          <p className='text-center text-[#9D9D9D] text-[19px]'>
            Click on the button to close this page.
          </p>
        </div>
        <div className='my-[2px] px-[50px] flex justify-center '>
          <div className="bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group"
            >
            <button 
              className="text-[19px] font-black before:ease relative h-12 w-40 overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40"
              onClick={handleClose}>
              <span className="relative z-10">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorToken