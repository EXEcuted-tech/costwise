import React, {useState} from 'react'
import { IconType } from 'react-icons/lib';

import { MdDarkMode } from "react-icons/md";

interface HeaderProps {
    icon: IconType;
    title: string;
}

const Header: React.FC<HeaderProps> = ({icon: Icon, title}) => {

    return (
        <div className='font-lato bg-white w-full h-[5rem] flex shadow-md shadow-gray-300'>
            <div className="flex items-center w-full">
                <div className="w-[5rem] p-6 ml-1 text-[3em]">
                    <Icon />
                </div>
                <div className="w-[40rem] text-[2em] m-2 p-[0.6rem] font-bold ">
                    {title}
                </div>

                {/* change this to proper dark mode */}
                <div className="p-6 text-[2.2em] ml-auto mr-2">
                    <MdDarkMode />
                </div>
            </div>
        </div>
    )
}

export default Header