import React from 'react';
import { IoClose } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";

interface ConfirmDeleteProps {
    onClose: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onClose }) => {
    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 left-0 p-4 overflow-auto  bg-[rgba(0,0,0,0.5)]'>
            <div className="flex flex-col w-[30rem] h-[25rem] mx-[50px] p-4 bg-white shadow-md shadow-gray-800 rounded-lg animate-pop-out max-4xl:scale-90 max-3xl:scale-85 max-2xl:scale-80 max-xl:scale-75 max-xl:left-[23%] max-2xl:left-[33%] max-3xl:left-[35%]"> 
                
                {/* Close Button */}
                <div className="text-[2em] mr-2 text-[#CECECE] ml-auto">
                    <button onClick={onClose}>
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