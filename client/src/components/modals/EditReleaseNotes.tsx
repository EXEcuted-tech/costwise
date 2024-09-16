import React from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaCodeBranch } from "react-icons/fa";

interface EditReleaseNotesProps {
    setEditNotes: React.Dispatch<React.SetStateAction<boolean>>
}

interface EditReleaseNotesProps {
    
}

const EditReleaseNotes: React.FC<EditReleaseNotesProps> = ({setEditNotes}) => {
    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 left-0 p-4 overflow-auto backdrop-brightness-50'>
            <div className="flex flex-col w-[50%] h-[700px] bg-white rounded-[20px] animate-pop-out drop-shadow">

                {/* Header */}
                <div className='flex items-center rounded-t-[10px] h-[10%] bg-[#F5F5F5] text-[24px]'>
                    <div className='flex items-center justify-center w-[10%] h-full bg-[#F1F1F1] border-r-[2px] rounded-tl-[10px] px-[10px]'>
                        <p>15 Jan</p>
                    </div>
                    <div className='flex items-center w-[80%] h-full text-[27px] ml-[20px] gap-[10px]'>
                        <FaCodeBranch className='text-[35px] opacity-30'/>
                        <p>Version 3.0 Changes</p>
                    </div>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={()=>setEditNotes(false)}/>
                </div>

                <div className="h-[80%]">
                    <div className='flex h-[15%] items-end text-[28px] pl-[30px] pb-[10px] border-b-[4px]'>
                        <p>Version 1.0 - January 15, 2024</p>
                    </div>
                    <div className='h-[85%] border-b-[4px]'>
                        <p>huh</p>
                    </div>

                </div>

                <div className='flex h-[10%] items-center justify-end mr-[30px] text-[24px]'>
                    <div className=''>
                        Prepared by: Michael Huang
                    </div>
                    
                </div>

            </div>
        </div>
    )
}

export default EditReleaseNotes;