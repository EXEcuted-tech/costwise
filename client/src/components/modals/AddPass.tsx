import React from 'react';
import { IoClose } from "react-icons/io5";

interface ModalProps {
    title: string;
    onClose: () => void;
}

const AddPass: React.FC<ModalProps> = ({title, onClose}) => {
    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 right-0 p-4 overflow-auto bg-[rgba(0,0,0,0.5)]'>
            <div className="flex flex-col w-[37rem] h-[24rem] fixed top-[35%] left-[40%] p-6 bg-white shadow-md shadow-gray-800 rounded-lg animate-pop-out"> 
                
                {/* Title */} 
                <div className='flex justify-center text-center mt-2 mb-2'>
                    <div className="flex text-[1.8em] font-semibold ml-44 mb-4">
                        {title}
                    </div>
                    
                    <div className="h-[2rem] text-[2em] text-[#CECECE] ml-auto">
                        <button onClick={onClose}>
                            <IoClose />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-full mb-4">
                    <div className="mt-[0.8em] ml-7 text-gray-600">
                        <input
                            className="bg-white h-14 w-[30rem] px-5 pr-16 text-[1.2em] border-2 border-[#B3B3B3] rounded-lg focus:outline"
                            type="search"
                            name="search"
                            placeholder="New Password"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <div className="mt-[0.8em] ml-7 text-gray-600">
                        <input
                            className="bg-white h-14 w-[30rem] px-5 pr-16 text-[1.2em] border-2 border-[#B3B3B3] rounded-lg focus:outline"
                            type="search"
                            name="search"
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>

                 {/* Buttons */}
                 <div className='flex w-full mt-10 ml-4 justify-center'>
                    <button className='w-[13rem] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#B22222] text-white mr-4 rounded-xl'> Use Password </button>
                </div>
            </div>
        </div>
    )
}

export default AddPass;