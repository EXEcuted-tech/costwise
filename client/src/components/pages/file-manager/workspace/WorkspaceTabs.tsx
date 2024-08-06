import React, { useState } from 'react'
import { iconMap } from '@/utils/iconMap';
import ConfirmDialog from '@/components/modal/ConfirmDialog';

interface WkspTabProps {
    setTab: React.Dispatch<React.SetStateAction<string>>;
    setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>;
    tab?: string;
    isOpen: boolean;
    isEmpty: boolean;
}

const WorkspaceTabs: React.FC<WkspTabProps> = ({ tab, setTab, isOpen, isEmpty, setIsEmpty }) => {
    const [confirm, setConfirmDialog] = useState(false);

    const handleTabChange = (tabValue: string) => {
        if (isEmpty) {
            setTab(tabValue);
            localStorage.setItem("wkspTab", tabValue);
        } else {
            var currentTab = localStorage.getItem("wkspTab");
            console.log("Current Tab: ", currentTab, tabValue);
            if (currentTab != tabValue) {
                setConfirmDialog(true);
            }
        }
    }

    return (
        <div className='flex w-full'>
            {workspaceTabs.map((value, index) => (
                <div key={index} className={`cursor-pointer rounded-b-[20px] drop-shadow-lg w-[50%] flex justify-center text-[20px] py-[10px]
                        ${isOpen ? '' : ''} 
                        ${tab === value
                        ? 'bg-primary text-white hover:bg-gradient-to-r hover:from-primary hover:to-[#d42020]'
                        : 'bg-[#F3F3F3] text-[#8F8F8F] hover:bg-gradient-to-r hover:from-[#EFEFEF] hover:to-[#D4D4D4]'
                    }`}
                    onClick={() => handleTabChange(value)}>
                    <li className='flex cursor-pointer items-center'>
                        <p className={`${isOpen && ''} uppercase tracking-widest`}>
                            {value}
                        </p>
                    </li>
                </div>
            ))}
            {confirm && 
                <ConfirmDialog 
                    tab={tab} 
                    setConfirmDialog={setConfirmDialog} 
                    setTab={setTab}
                    setIsEmpty={setIsEmpty}
                />
            }
        </div>
    )
}

export default WorkspaceTabs

const workspaceTabs: string[] = ["master files", "transactions"];