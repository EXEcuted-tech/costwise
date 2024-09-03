"use client";
import React, { useState } from 'react';
import { SystemMaintenanceProps } from '@/app/maintenance/page';
import { TfiMoreAlt } from "react-icons/tfi";

const formatDate = (dateString: String) => {
    const date = new Date(dateString as string);
    const options = { month: 'short', day: 'numeric' } as const;
    return date.toLocaleDateString('en-US', options);
};

const ReleaseNoteTile:React.FC<SystemMaintenanceProps> = ({date, title, author}) => {
    return (
        <div className='flex w-full h-[65px] mb-5 items-center bg-[#F5F5F5] drop-shadow-lg rounded-lg group hover:bg-[#e3e3e3] transition-colors duration-300 ease-in-out'>
            <div className='flex w-[8rem] h-full px-10 font-semibold text-[20px] text-[#5B5353] text-center items-center border-r-2 border-[#92909041] bg-[#f1f1f1a1] '>
                <span>{formatDate(date)}</span>
            </div>
            <span className='ml-8 mr-3 text-[22px] 2xl:text-[25px] text-[#5B5353]'>{title}</span>
            <span className='hidden 2xl:block text-[18px] 2xl: text-[21px] text-[#5B5353] font-light'>by: {author}</span>
            <button className='w-[4rem] h-[2rem] text-[30px] text-[#5B5353] px-4 py-[3px] ml-auto mr-10 bg-white border border-[#9290905b] rounded-full shadow-lg'><TfiMoreAlt/></button>
        </div>
    )
}

export default ReleaseNoteTile;