import React from 'react';
import { IoClose } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";

const ConfirmDelete = () => {
    return (
        <div className='z-10 w-full h-full fixed top-0 right-0 p-4 overflow-auto bg-[rgba(0,0,0,0.6)] animate-fade-in'>
            <div className="flex flex-col w-[30rem] h-[25rem] fixed top-[35%] left-[40%] p-4 bg-white shadow-md shadow-gray-800 rounded-lg"> 
                
                {/* Close Button */}
                <div className="text-[2em] mr-2 text-[#CECECE] ml-auto">
                    <button className="">
                        <IoClose />
                    </button>
                </div>

                <div className="flex justify-center">
                    <div className='flex flex-col items-center justify-center'>
                        <div>
                            <TiWarning className="text-[7em] text-[#CB0000]"/>
                        </div>
                        <div className='font-semibold text-[1.8em]'>
                            <p>Are You Sure?</p>
                        </div>
                        <div className='w-[20rem] text-center text-[1.2em] break-words'>
                            <p>Do you want to delete this user? This process cannot be undone.</p>
                        </div>
                        
                        {/* Buttons */}
                        <div className='flex w-full mt-8 ml-4 justify-center'>
                            <button className='w-[7rem] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#B22222] text-white mr-4 rounded-xl'> Delete </button>
                            <button className='w-[7rem] h-[3rem] p-2 text-center text-[1.2em] text-[#B22222] font-semibold bg-white border-2 border-[#B22222] mr-4 rounded-xl'> Cancel </button>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}

export default ConfirmDelete;