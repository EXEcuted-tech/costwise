import React from 'react'
import { IconType } from 'react-icons/lib';

import { MdDarkMode } from "react-icons/md";

interface HeaderProps {
    icon: IconType;
    title: string;
    style?: string;
}

const Header: React.FC<HeaderProps> = ({icon: Icon, title, style}) => {

    return (
        <div className={`font-lato bg-white h-[5rem] flex shadow-md shadow-gray-300 ${style ? style : 'w-full'}`}>
            <div className="flex items-center w-full">
                <div className="w-[5rem] pl-9 py-6 ml-1 text-[3em]">
                    <Icon />
                </div>
                <div className="w-[40rem] text-[2.3em] mx-4 mt-2 pr-[0.6rem] py-[0.6rem] font-black ">
                    {title}
                </div>

                {/* change this to proper dark mode */}
                <div className="hover:animate-shake-tilt hover:brightness-95 p-6 text-[2.2em] text-primary ml-auto mr-4">
                    <MdDarkMode className='cursor-pointer'/>
                </div>
            </div>
        </div>
    )
}

export default Header