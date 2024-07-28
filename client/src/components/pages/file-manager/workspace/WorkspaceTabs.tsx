import React from 'react'
import { iconMap } from '@/utils/iconMap';
import { FileProps } from '../FileTabs';

const WorkspaceTabs: React.FC<FileProps> = ({ tab, setTab, isOpen }) => {

    const handleTabChange = (tab:string) =>{
        setTab(tab);
        localStorage.setItem("wkspTab",tab);
    }

    return (
        <div className='flex w-full'>
            {workspaceTabs.map((value, index) => (
                <div key={index} className={`cursor-pointer rounded-b-[20px] drop-shadow-lg w-[50%] flex justify-center text-[20px] py-[10px]
                        ${isOpen ? '' : '' } 
                        ${tab === value
                        ? 'bg-primary text-white hover:bg-gradient-to-r hover:from-primary hover:to-[#d42020]'
                        : 'bg-[#F3F3F3] text-[#8F8F8F] hover:bg-gradient-to-r hover:from-[#EFEFEF] hover:to-[#D4D4D4]'
                    }`}
                    onClick={()=>handleTabChange(value)}>
                    <li className='flex cursor-pointer items-center'>
                        <p className={`${isOpen && ''} uppercase tracking-widest`}>
                            {value}
                        </p>
                    </li>
                </div>
            ))}
        </div>
    )
}

export default WorkspaceTabs

const workspaceTabs: string[] = ["master files","transactions"];