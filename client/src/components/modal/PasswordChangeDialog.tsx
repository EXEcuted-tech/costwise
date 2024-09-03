import React from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { useFileType } from '@/context/FileTypeContext';

interface PasswordChangeDialogProps { 
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({ setDialog }) => {

  return (
    <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]'>
      <div className='flex flex-col animate-pop-out bg-white w-[550px] h-[310px] rounded-[20px] px-[10px] gap-5'>
        <div className='flex justify-end'>
            <h1 className='font-black text-[30px] mt-[20px] mr-[65px]'>Password Change</h1>
            <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:brightness-90' onClick={() => setDialog(false)}/>
        </div>

        <div className='flex flex-col w-full px-5 gap-5'>
          <input
              className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
              type="fname"
              name="fname"
              placeholder="New Password"
          />
          <input
              className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
              type="fname"
              name="fname"
              placeholder="Confirm Password"
          />
        </div>

        <div className='flex w-full justify-center'>
          <button className='w-[50%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] bg-primary text-white rounded-xl hover:bg-[#9c1c1c]'> 
            Update Profile 
          </button>
        </div>

      </div>
    </div>
  )
}

export default PasswordChangeDialog