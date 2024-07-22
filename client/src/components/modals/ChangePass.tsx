import React from 'react';
import { IoClose } from "react-icons/io5";

interface ModalProps {
    username: string;
    date: string;
    password: string;
}

const ChangePass: React.FC<ModalProps> = ({username, date, password}) => {
    return (
        <div className='font-lato z-10 w-full h-full fixed top-0 right-0 p-4 overflow-auto bg-[rgba(0,0,0,0.6)] animate-fade-in'>
            <div className="flex flex-col w-[37rem] h-[21rem] fixed top-[35%] left-[40%] p-6 bg-white shadow-md shadow-gray-800 rounded-lg"> 
                
                {/* Title */} 
                <div className='flex justify-center mt-2 mb-2 border-b-2 border-[#A0A0A0]'>
                    <div className="flex text-[1.7em] font-bold ml-40 mb-2">
                        Password Change
                    </div>
                    
                    <div className="h-[2rem] text-[2em] text-[#CECECE] ml-auto">
                        <button className="">
                            <IoClose />
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className='flex flex-col justify-start mt-3 ml-6'>
                    <div className='flex text-[1.3em] font-semibold'>
                        <p>Requested by: </p>
                        <p className='text-[#6B6B6B] ml-3'> {username} </p>
                    </div>

                    <div className='flex text-[1.3em] font-semibold'>
                        <p>Date Requested: </p>
                        <p className='text-[#6B6B6B] ml-3'> {date} </p>
                    </div>
                </div>

                <div className="flex flex-col w-full mb-4">
                    <div className="mt-[0.8em] ml-7 text-gray-600">
                        <input
                            className="bg-white h-14 w-[30rem] px-5 pr-16 text-[1.3em] border-2 border-[#B3B3B3] rounded-lg focus:outline"
                            type="search"
                            name="search"
                            placeholder="testpassword"
                        />
                    </div>
                </div>
               
                {/* Buttons */}
                <div className='flex w-full ml-4 justify-center'>
                    <button className='w-[7rem] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] text-white mr-4 rounded-xl'> Confirm </button>
                    <button className='w-[7rem] h-[3rem] p-2 text-center text-[1.2em] text-white font-semibold bg-[#B22222] mr-4 rounded-xl'> Cancel </button>
                </div>
            
            </div>  
        </div>
    )
}

export default ChangePass;