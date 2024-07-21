import React, {useState} from 'react'
import { IconType } from 'react-icons/lib';

import { MdDarkMode } from "react-icons/md";

interface HeaderProps {
    icon: IconType;
    title: string;
}

const Header: React.FC<HeaderProps> = ({icon: Icon, title}) => {

    return (
        <div className='font-lato bg-white w-full h-[6rem] flex shadow-md shadow-gray-300'>
            <div className="flex items-center w-full">
                <div className="w-[5rem] p-6 ml-2 text-[3.5em] ">
                    <Icon />
                </div>
                <div className="w-[40rem] text-[2.3em] m-2 p-[0.6rem] font-bold ">
                    {title}
                </div>

                {/* change this to proper dark mode */}
                <div className="p-6 text-[2.5em] ml-auto mr-2">
                    <MdDarkMode />
                </div>
            </div>
        </div>
    )
}

export default Header