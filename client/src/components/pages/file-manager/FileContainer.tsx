import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import CustomDatePicker from '@/components/form-controls/CustomDatePicker';
import FileTable from './FileTable';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import api from '@/utils/api';
import { File } from '@/types/data';

interface FileContainerProps {
    tab: string;
    isOpen: boolean;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    allData: File[];
    masterFileData: File[];
    transactionData: File[];
}

const FileContainer: React.FC<FileContainerProps> = ({
    tab,
    isOpen,
    isLoading,
    setIsLoading,
    allData,
    masterFileData,
    transactionData,
}) => {
    // const [allData, setAllData] = useState<File[]>([]);
    // const [masterFileData, setMasterFileData] = useState<File[]>([]);
    // const [transactionData, setTransactionData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setIsLoading(true);

    //         try {
    //             if (tab === 'all') {
    //                 const response = await api.get('/files/retrieve_all');
    //                 if (response.data.status == 200) {
    //                     console.log(response);
    //                     setTimeout(() => {
    //                         setIsLoading(false);
    //                     }, 1000);
    //                     setAllData(response.data.data);
    //                 }
    //             } else if (tab === 'masterfile') {
    //                 const response = await api.get('/files/retrieve', {
    //                     params: { col: 'file_type', value: 'master_file' },
    //                 });
    //                 if (response.data.status == 200) {
    //                     setTimeout(() => {
    //                         setIsLoading(false);
    //                     }, 1000);
    //                     setMasterFileData(response.data.data);
    //                 }
    //             } else if (tab === 'transactional') {
    //                 const response = await api.get('/files/retrieve', {
    //                     params: { col: 'file_type', value: 'transactional_file' },
    //                 });
    //                 setTransactionData(response.data.data);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [setIsLoading, tab]);

    return (
        <div className={`!font-lato bg-white w-full rounded-lg drop-shadow-lg`}>
            {/* Title */}
            <h1 className={`${isOpen ? 'ml-[20px] 2xl:ml-[46px] text-[28px] 2xl:text-[32px]' : 'text-[32px] ml-[46px]'} font-bold py-[2px]`}>
                {tab === 'all' ? 'All Files' : tab === 'masterfile' ? 'Master Files' : 'Transactional Files'}
            </h1>
            <div className={`${isOpen ? 'px-[20px] 2xl:px-[46px]' : 'px-[46px]'} flex items-center h-[50px] bg-[#F3F3F3] border-y-[0.8px] border-[#868686]`}>
                {/* Search Component */}
                <div className={`${isOpen ? 'w-[74%] 2xl:w-[75%] 3xl:w-[80%]' : 'w-[75%] 3xl:w-[84.5%]'} relative mr-[1%]`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <AiOutlineSearch className="text-[#B0B0B0] text-[22px]" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-[35px] pr-[5px] bg-white border border-[#868686] placeholder-text-[#B0B0B0] text-[#5C5C5C] text-[15px] rounded-[5px] py-[3px]"
                        placeholder="Search here..."
                        required
                    />
                </div>
                {/* Date Picker */}
                <div className={`${isOpen ? 'w-[26%] 2xl:w-[25%] 3xl:w-[20%]' : 'w-[25%] 3xl:w-[15.5%]'} relative`}>
                    <CustomDatePicker />
                </div>
            </div>
            {/* Table */}
            <div>
                <FileTable
                    fileData={tab === 'all' ? allData : tab === 'masterfile' ? masterFileData : allData}
                    isOpen={isOpen}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default FileContainer