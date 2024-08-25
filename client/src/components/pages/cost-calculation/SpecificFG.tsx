import React from 'react';
import { CgRemoveR } from "react-icons/cg";

type SpecificFGProps = {
    id: number;
    removeSheet: (id: number) => void;
    isOpen?: boolean;
};

const SpecificFG: React.FC<SpecificFGProps> = ({ id, removeSheet, isOpen }) => {
    return (
        <div className={`${isOpen ? 'xl:mx-[2rem]' : '' } relative w-auto h-[35rem] ml-[5rem] mr-[35px] mb-10 bg-white rounded-2xl border-1 border-[#656565] shadow-md animate-fade-in2`}>
            <div className='flex h-14 rounded-t-2xl bg-[#B22222] text-white text-[26px] font-bold py-2 pl-7 group'>
                <select 
                    className='w-auto pr-2 bg-transparent uppercase cursor-pointer outline-[#8a1515]'
                    name="sheetValue"
                >
                    <option selected disabled>Choose Finished Good</option>
                    <option value="" className='text-[#ACACAC]'>HOTDOG 01K</option>
                    <option value="" className='text-[#ACACAC]'>HOTDOG 02K</option>
                </select>
                
                {/* Delete Button */}
                <button 
                    onClick={() => removeSheet(id)} 
                    className='text-[30px] ml-auto mr-4 cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-300 ease-in-out'>
                    <CgRemoveR />
                </button>
            </div>
        </div>
    );
};

export default SpecificFG;
