"use client"
import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import { BsFolderFill } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowRoundBack, IoIosArrowForward } from "react-icons/io";
import { useSidebarContext } from '@/contexts/SidebarContext';
import WorkspaceTabs from '@/components/pages/file-manager/workspace/WorkspaceTabs';
import NoFile from '@/components/pages/file-manager/workspace/NoFile';
import { useRouter, useSearchParams } from 'next/navigation';
import MasterFileContainer from '@/components/pages/file-manager/workspace/MasterFileContainer';
import TransactionFileContainer from '@/components/pages/file-manager/workspace/TransactionFileContainer';
import { useFileManagerContext } from '@/contexts/FileManagerContext';
import api from '@/utils/api';
import { File } from '@/types/data';
import Spinner from '@/components/loaders/Spinner';

const WorkspacePage = () => {
    const [tab, setTab] = useState('master files');
    const { fileType, setFileType } = useFileManagerContext(); //0 is none, 1 is master file, 2 is transactions
    const [fileData, setFileData] = useState<File | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [bomSheets, setBomSheets] = useState<number[]>([]);
    const [isHovered, setIsHovered] = useState(false);

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
                setIsLoading(true);
                try {
                    const tabType = type === 'master_file' ? 'master files' : 'transactions';
                    const fileNumber = type === 'master_file' ? 1 : 2;
                    localStorage.setItem('wkspTab', tabType);
                    const data = await retrieveFileData(Number(id));
                    const settings = JSON.parse(data[0].settings);
                    setBomSheets(settings.bom_ids || []);
                    setFileType(fileNumber);
                    setTab(tabType);
                    setIsEmpty(false);
                    setFileData(data[0]);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error parsing file data:', error);
                }
            } else {
                setFileType(0);
            }
        };

        fetchData();
    }, [searchParams, setFileType, setTab]);

    const retrieveFileData = async (id: number) => {
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
        <>
            {/* Navigation Pane */}
            {fileType === 1 && (
                <div 
                    className="fixed right-[-105px] hover:right-0 top-[30%] transform -translate-y-1/2 z-[950] transition-all ease-in-out duration-300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex items-center mb-4 bg-white dark:bg-[#5e5e5e] p-4 rounded-l-lg shadow-md">
                        {isHovered ? (
                            <IoIosArrowForward className="text-2xl text-primary dark:text-white cursor-pointer mr-5" />
                        ) : (
                            <IoIosArrowBack className="text-2xl text-primary dark:text-white cursor-pointer mr-5" />
                        )}
                        <span className="font-semibold text-primary dark:text-white">Navigation</span>
                    </div>
                    <ul className="fixed right-[-15px] bg-white dark:bg-[#5e5e5e] rounded-l-lg shadow-md p-4">
                        <li>
                            <a
                                href="#fodl-cost"
                                className="block py-2 text-gray-600 dark:text-[#d1d1d1] hover:text-primary"
                            >
                                FODL Sheet
                            </a>
                        </li>
                        <li>
                            <a
                                href="#material-cost"
                                className="block py-2 text-gray-600 dark:text-[#d1d1d1] hover:text-primary"
                            >
                                Material Sheet
                            </a>
                        </li>
                        {bomSheets.map((bomId, index) => (
                            <li key={bomId}>
                                <a
                                    href={`#bom-${bomId}`}
                                    className="block py-2 text-gray-600 dark:text-[#d1d1d1] hover:text-primary"
                                >
                                    BOM Sheet {index + 1}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div id='scroll-style'>
                <Header icon={BsFolderFill} title={"File Manager"} style={''} />
                <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[40px] ml-[45px]`}>
                    <div className='bg-white dark:bg-[#5e5e5e] flex items-center px-[20px] py-[10px] rounded-t-[10px] drop-shadow'>
                        <IoIosArrowRoundBack className='text-primary dark:text-[#ff4d4d] text-[40px] mr-[15px] hover:text-[#D13131] transition-colors duration-300 ease-in-out cursor-pointer'
                            onClick={redirectBack} />
                        <h1 className='font-bold text-[28px] text-primary dark:text-[#ff4d4d]'>Workspace</h1>
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
                    {isLoading ? (
                        <div className='flex flex-col justify-center items-center bg-white dark:bg-[#3C3C3C] rounded-[10px] drop-shadow text-white h-[660px] mx-auto'>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            {fileType === 0 && <NoFile />}
                            {fileType === 1 && fileData && <MasterFileContainer {...fileData} />}
                            {fileType === 2 && fileData && <TransactionFileContainer {...fileData} />}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default WorkspacePage