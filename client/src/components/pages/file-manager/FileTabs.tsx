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
}

const FileTabs: React.FC<FileProps> = ({ tab, setTab }) => {
    return (
        <div className='flex'>
            {fileTabs.map(({ iconName, tabName, tabIndicator, className}, index) => {
                const IconComponent = iconMap[iconName];
                return (
                    <div className={`border-1 rounded-t-[15px] py-[2px] px-[15px] mr-[1px] drop-shadow-md
                            ${tab === tabIndicator
                            ? 'bg-primary border-primary text-white hover:bg-gradient-to-r hover:from-primary hover:to-[#d42020]'
                            : 'bg-[#EFEFEF] border-[#D4D4D4] text-[#747474] hover:bg-gradient-to-r hover:from-[#EFEFEF] hover:to-[#D4D4D4]'
                        }`}
                        onClick={()=>setTab(tabIndicator)}>
                        <li key={index} className='flex cursor-pointer items-center my-[5px]'>
                            <IconComponent className={`${tab === tabIndicator ? 'text-white':'text-[#919191]'} ${className}`} />
                            <p className={`${tab === tabIndicator ? 'font-semibold' : 'font-medium'}`}>{tabName}</p>
                        </li>
                    </div>
                );
            })}
        </div>
    )
}

export default FileTabs

const fileTabs: TabConfig[] = [
    { iconName: 'FaFile', tabName: 'All Files', tabIndicator: 'all', className: 'mr-1' },
    { iconName: 'BiSolidFile', tabName: 'Master Files', tabIndicator: 'masterfile', className: 'text-[21px] mr-0.5' },
    { iconName: 'BiFile', tabName: 'Transactional Files', tabIndicator: 'transactionfile', className: 'text-[21px] mr-0.5' },
];