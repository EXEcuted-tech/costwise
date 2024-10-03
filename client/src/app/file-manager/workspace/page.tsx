"use client"
import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import { BsFolderFill } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSidebarContext } from '@/contexts/SidebarContext';
import WorkspaceTabs from '@/components/pages/file-manager/workspace/WorkspaceTabs';
import NoFile from '@/components/pages/file-manager/workspace/NoFile';
import { useRouter, useSearchParams } from 'next/navigation';
import MasterFileContainer from '@/components/pages/file-manager/workspace/MasterFileContainer';
import TransactionFileContainer from '@/components/pages/file-manager/workspace/TransactionFileContainer';
import { useFileManagerContext } from '@/contexts/FileManagerContext';
import api from '@/utils/api';
import { File } from '@/types/data';

const WorkspacePage = () => {
    const [tab, setTab] = useState('master files');
    const { fileType, setFileType } = useFileManagerContext(); //0 is none, 1 is master file, 2 is transactions
    const [fileData, setFileData] = useState<File | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        localStorage.setItem("wkspBool", "true");
    }, [])

    useEffect(() => {
        const fetchData = async () => {
          const id = searchParams.get('id');
          const type = searchParams.get('type');
      
          if (id && type) {
            try {
              const tabType = type === 'master_file' ? 'master files' : 'transactions';
              const fileNumber = type === 'master_file' ? 1 : 2;
              localStorage.setItem('wkspTab', tabType);
              
              const data = await retrieveFileData(Number(id));
      
              setFileType(fileNumber);
              setTab(tabType);
              setIsEmpty(false);
              setFileData(data[0]);
            } catch (error) {
              console.error('Error parsing file data:', error);
            }
          }
        };
      
        fetchData();
      }, [searchParams, setFileType]);
      

    const retrieveFileData = async (id:number) => {
        setIsLoading(true);
        try {
            const response = await api.get('/files/retrieve', {
                params: { col: 'file_id', value: id },
            });
    
            if (response.status === 200) {
                return response.data.data;
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error retrieving file data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const redirectBack = () => {
        //add ug confirm dialog if wala pa na save ang mga changes if naa na backend
        setIsEmpty(true);
        setFileType(0);
        localStorage.removeItem("wkspBool");
        localStorage.removeItem("edit");
        router.push('/file-manager');
    }

    return (
        <div className=''>
            <Header icon={BsFolderFill} title={"File Manager"} style={''} />
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[40px] ml-[45px]`}>
                <div className='bg-white flex items-center px-[20px] py-[10px] rounded-t-[10px] drop-shadow'>
                    <IoIosArrowRoundBack className='text-primary text-[40px] mr-[15px] hover:text-[#D13131] transition-colors duration-300 ease-in-out cursor-pointer'
                        onClick={redirectBack} />
                    <h1 className='font-bold text-[28px] text-primary'>Workspace</h1>
                </div>
                <div>
                    <WorkspaceTabs
                        tab={tab}
                        setTab={setTab}
                        isOpen={isOpen}
                        isEmpty={isEmpty}
                        setIsEmpty={setIsEmpty} />
                </div>
            </div>
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[25px] ml-[45px]`}>
                {fileType == 0 && <NoFile />}
                {fileType == 1 && fileData && <MasterFileContainer {...fileData} />}
                {fileType == 2 && fileData && <TransactionFileContainer {...fileData} />}
            </div>
        </div>
    )
}

export default WorkspacePage