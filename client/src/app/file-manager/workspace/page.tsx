"use client"
import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import { BsFolderFill } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSidebarContext } from '@/context/SidebarContext';
import WorkspaceTabs from '@/components/pages/file-manager/workspace/WorkspaceTabs';
import NoFile from '@/components/pages/file-manager/workspace/NoFile';

const WorkspacePage = () => {
    const { isOpen } = useSidebarContext();
    const [tab, setTab] = useState('master files');
    const [fileType, setFileType] = useState(0); //0 is none, 1 is master file, 2 is transactions

    useEffect(() => {
        const currentTab = localStorage.getItem('wkspTab');
        if (currentTab) {
            setTab(currentTab);
        }
    }, []);
    
    return (
        <div>
            <Header icon={BsFolderFill} title={"File Manager"} />
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px] mt-[75px] 2xl:mt-[40px]' : 'px-[50px] mt-[40px]'} ml-[45px]`}>
                <div className='bg-white flex items-center px-[20px] py-[10px] rounded-t-[10px] drop-shadow'>
                    <IoIosArrowRoundBack className='text-primary text-[40px] mr-[15px] hover:text-[#D13131] cursor-pointer' 
                    onClick={()=> window.history.back()}/>
                    <h1 className='font-bold text-[28px] text-primary'>Workspace</h1>
                </div>
                <div>
                    <WorkspaceTabs tab={tab} setTab={setTab} isOpen={isOpen} />
                </div>
            </div>
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px] mt-[75px] 2xl:mt-[40px]' : 'px-[50px] mt-[25px]'} ml-[45px]`}>
                {fileType == 0
                    ?
                    <NoFile />
                    :
                    <></>
                }
            </div>
        </div>
    )
}

export default WorkspacePage