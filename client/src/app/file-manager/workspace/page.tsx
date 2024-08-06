"use client"
import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import { BsFolderFill } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSidebarContext } from '@/context/SidebarContext';
import WorkspaceTabs from '@/components/pages/file-manager/workspace/WorkspaceTabs';
import NoFile from '@/components/pages/file-manager/workspace/NoFile';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileTableProps } from '@/components/pages/file-manager/FileContainer';
import MasterFileContainer from '@/components/pages/file-manager/workspace/MasterFileContainer';
import TransactionFileContainer from '@/components/pages/file-manager/workspace/TransactionFileContainer';
import { useFileType } from '@/context/FileTypeContext';

const WorkspacePage = () => {
    const [tab, setTab] = useState('master files');
    const { fileType, setFileType } = useFileType(); //0 is none, 1 is master file, 2 is transactions
    const [fileData, setFileData] = useState<FileTableProps | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            try {
                //Will change this as soon as we get to back end
                const decodedData = JSON.parse(decodeURIComponent(data)) as FileTableProps;
                const tabType = decodedData.fileType=='Master File' ? 'master files' : 'transactions';
                const fileNumber = decodedData.fileType=='Master File' ? 1 : 2;
                localStorage.setItem("wkspTab",tabType);
                // localStorage.setItem("type", JSON.stringify(fileNumber));

                setFileType(fileNumber);
                setTab(tabType);
                setIsEmpty(false);
                setFileData(decodedData);
            } catch (error) {
                console.error('Error parsing file data:', error);
            }
        }
    }, [searchParams]);
    
    const redirectBack = () =>{
        //add ug confirm dialog if wala pa na save ang mga changes if naa na backend
        setIsEmpty(true);
        setFileType(0);
        router.push('/file-manager');
    }

    return (
        <div className=''>
            <Header icon={BsFolderFill} title={"File Manager"} style={''}/>
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px] mt-[75px] 2xl:mt-[40px]' : 'px-[50px] mt-[40px]'} ml-[45px]`}>
                <div className='bg-white flex items-center px-[20px] py-[10px] rounded-t-[10px] drop-shadow'>
                    <IoIosArrowRoundBack className='text-primary text-[40px] mr-[15px] hover:text-[#D13131] cursor-pointer' 
                    onClick={redirectBack}/>
                    <h1 className='font-bold text-[28px] text-primary'>Workspace</h1>
                </div>
                <div>
                    <WorkspaceTabs 
                        tab={tab} 
                        setTab={setTab} 
                        isOpen={isOpen} 
                        isEmpty={isEmpty}
                        setIsEmpty={setIsEmpty}/>
                </div>
            </div>
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px] mt-[75px] 2xl:mt-[40px]' : 'px-[50px] mt-[25px]'} ml-[45px]`}>
                {fileType == 0 && <NoFile />}
                {fileType == 1 && fileData && <MasterFileContainer {...fileData}/>}
                {fileType == 2 && fileData && <TransactionFileContainer {...fileData}/>}
            </div>
        </div>
    )
}

export default WorkspacePage