import React from 'react';
import { CgRemoveR } from "react-icons/cg";

type SpecificFGProps = {
    id: number;
    removeSheet: (id: number) => void;
};

const SpecificFG: React.FC<SpecificFGProps> = ({ id, removeSheet }) => {
    return (
        <div className='relative w-auto h-[35rem] mx-[5rem] mb-10 rounded-2xl border-1 border-[#656565] shadow-md animate-fade-in2'>
            <div className='flex h-14 rounded-t-2xl bg-[#B22222] text-white text-[26px] font-bold py-2 pl-7 group'>
                <select 
                    className='w-auto pr-2 bg-transparent uppercase cursor-pointer'
                    name="sheetValue"
                >
                    <option selected disabled>Choose Finished Good</option>
                    <option value="">HOTDOG 01K</option>
                </select>
                
                {/* Delete Button */}
                <button 
                    onClick={() => removeSheet(id)} 
                    className='text-[30px] ml-auto mr-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out'>
                    <CgRemoveR />
                </button>
            </div>
        </div>
    );
};

export default SpecificFG;
