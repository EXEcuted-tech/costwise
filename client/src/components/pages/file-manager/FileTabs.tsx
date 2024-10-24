import React from 'react'
import { iconMap } from '@/utils/iconMap';

interface TabConfig {
    iconName: string;
    tabName: string;
    tabIndicator: string;
    className: string;
}

interface FileProps {
    setTab: React.Dispatch<React.SetStateAction<string>>;
    tab?: string;
    isOpen: boolean;
}

const FileTabs: React.FC<FileProps> = ({ tab, setTab, isOpen }) => {

    const handleTabChange = (tab:string) =>{
        setTab(tab);
        localStorage.setItem("fileTab",tab);
    }

    return (
        <div className='flex'>
            {fileTabs.map(({ iconName, tabName, tabIndicator, className}, index) => {
                const IconComponent = iconMap[iconName];
                return (
                    <div key={index} className={`border-1 rounded-t-[15px] py-[2px] px-[15px] mr-[1px] drop-shadow-md transition-colors duration-200 ease-in-out
                            ${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' } 
                            ${tab === tabIndicator
                            ? 'bg-primary border-primary text-white hover:bg-gradient-to-r hover:from-primary hover:to-[#d42020]'
                            : 'bg-[#EFEFEF] dark:bg-[#3C3C3C] border-[#D4D4D4] dark:border-[#5C5C5C] text-[#747474] dark:text-[#919191] hover:bg-gradient-to-r hover:from-[#EFEFEF] hover:to-[#D4D4D4] dark:hover:bg-gradient-to-r dark:hover:from-[#3C3C3C] dark:hover:to-[#5C5C5C]'
                        }`}
                        onClick={()=>handleTabChange(tabIndicator)}>
                        <li className='flex cursor-pointer items-center my-[5px]'>
                            <IconComponent className={`${tab === tabIndicator ? 'text-white':'text-[#919191] dark:text-[#ebebeb]'} ${className}`} />
                            <p className={` dark:text-[#ebebeb]
                                ${isOpen && 'text-[10.1px] 2xl:text-[12px] 3xl:text-[16px]'} 
                                ${tab === tabIndicator ? 'font-semibold' : 'font-medium'}`
                            }>{tabName}</p>
                        </li>
                    </div>
                );
            })}
        </div>
    )
}

export default FileTabs

const fileTabs: TabConfig[] = [
    { iconName: 'FaFile', tabName: 'All Files', tabIndicator: 'all', className: `text-[12px] 2xl:text-[16px] mr-1` },
    { iconName: 'BiSolidFile', tabName: 'Master Files', tabIndicator: 'masterfile', className: 'text-[17px] 2xl:text-[21px] mr-0.5' },
    { iconName: 'BiFile', tabName: 'Transactional Files', tabIndicator: 'transactionfile', className: 'text-[17px] 2xl:text-[21px] mr-0.5' },
];