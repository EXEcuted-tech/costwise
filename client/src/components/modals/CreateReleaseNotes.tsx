import React from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaMinus } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";

interface CreateReleaseNotesProps {
    setCreateNotes: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateReleaseNotes: React.FC<CreateReleaseNotesProps> = ({setCreateNotes}) => {
    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed p-4 overflow-auto top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
            <div className="flex flex-col w-[50%] h-[700px] bg-white rounded-[20px] animate-pop-out drop-shadow">

                {/* Header */}
                <div className='flex items-center rounded-t-[10px] h-[10%] bg-[#F5F5F5] text-[27px] font-bold'>
                    <div className='flex items-center justify-center w-[10%] h-full bg-primary border-r-[2px] rounded-tb-[10px] rounded-tl-[10px] px-[10px] cursor-pointer'>
                        <p className='text-white'>Save</p>
                    </div>
                    <div className='flex items-center w-[80%] h-full ml-[20px] gap-[10px]'>
                        <FaFilePen className='text-[30px]' />
                        <p>Create Release Note</p>
                    </div>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={()=>setCreateNotes(false)}/>
                </div>

                <div className="h-full">
                    <div className='flex h-[13%] items-center text-[25px] font-bold px-[30px] border-b-[4px] gap-[20px]'>
                        <p>Title:</p>
                        <input className='w-full h-[60%] px-[20px] rounded-xl border-black border drop-shadow-lg' placeholder='Helloooo'></input>
                    </div>
                    <div className='h-[3rem] px-[30px] mt-[20px]'>
                        <div className='flex gap-[20px] text-[22px] font-medium'>
                            <button className='bg-[#9EE29E] text-[#008000] px-[20px] py-[1px] rounded-full font-bold drop-shadow-lg'>Added</button>
                            <button className='bg-[#777777] text-white px-[20px] py-[1px] rounded-full drop-shadow-lg'>Updated</button>
                            <button className='bg-[#777777] text-white px-[20px] py-[1px] rounded-full drop-shadow-lg'>Removed</button>
                        </div>
                    </div>
                    <div className='h-[70%] px-[30px]'>
                        <div className='flex flex-col h-full p-[20px] border-black border rounded-xl mt-[20px]'>
                            <div className='h-[80%] overflow-y-auto text-[22px]'>
                                <div className='flex gap-[10px] mb-[15px]'>
                                    <button className='flex bg-[#E8E7E7] w-[35px] h-[35px] text-[16px] justify-center items-center rounded-[10px] drop-shadow-lg'><FaMinus /></button>
                                    <button className='flex bg-[#E8E7E7] w-[35px] h-[35px] text-[16px] justify-center items-center rounded-[10px] drop-shadow-lg'><FaPencilAlt /></button>
                                    <p>Automated Reports</p>
                                </div>
                                <div className='flex gap-[10px]'>
                                    <button className='flex bg-[#E8E7E7] w-[35px] h-[35px] text-[16px] justify-center items-center rounded-[10px] drop-shadow-lg'><FaMinus /></button>
                                    <button className='flex bg-[#E8E7E7] w-[35px] h-[35px] text-[16px] justify-center items-center rounded-[10px] drop-shadow-lg'><FaPencilAlt /></button>
                                    <p>User Summary</p>
                                </div>
                            </div>
                            <div className='flex h-[20%]  justify-end items-end text-[22px] gap-[20px]'>
                                <input className='w-[80%] h-[50%] items-end px-[20px] py-[5px] rounded-full border-black border drop-shadow-lg' placeholder='Projected Costing'></input>
                                <button className='w-[20%] h-[50%] bg-primary rounded-xl text-white flex items-center justify-center hover:cursor-pointer hover:bg-[#921B1BFF] transition-colors delay-50 duration-[1000] ease-in'>
                                    <IoIosAdd className='text-[35px]'/>
                                    Add Note
                                </button>
                            </div>   
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default CreateReleaseNotes;