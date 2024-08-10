import ChooseFileDialog from '@/components/modal/ChooseFileDialog';
import React, { useState } from 'react'
import { CiFileOff } from "react-icons/ci";
import { FaFile } from "react-icons/fa6";

const NoFile = () => {
    const [dialog, setDialog] = useState(false);
    
    return (
        <>
            <div className='flex flex-col justify-center bg-white rounded-[10px] drop-shadow text-white h-[660px] mx-auto'>
                <CiFileOff className='text-[#9A9999] text-[100px] mx-auto' />
                <p className='text-[#8F8F8F] text-[25px] mx-auto '>No file chosen yet.</p>
                <button className='bg-primary rounded-[20px] px-[50px] py-[5px] mx-auto my-[10px] flex items-center
                    hover:bg-gradient-to-r hover:from-primary hover:to-[#d42020] hover:animate-shrink-in'
                    onClick={()=>setDialog(!dialog)}>
                    <FaFile className='mr-1 text-[25px]' />
                    <p className='font-semibold text-[24px]'>Choose File</p>
                </button>
            </div>
            {dialog && <ChooseFileDialog dialogType={0} setDialog={setDialog}/>}
        </>
    )
}

export default NoFile