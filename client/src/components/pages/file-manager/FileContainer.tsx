import React, { useEffect, useMemo, useRef, useState } from 'react'
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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    // const dataToDisplay = tab === 'all' ? allData : tab === 'masterfile' ? masterFileData : allData;

    // useEffect(()=>{
    //     console.log(dataToDisplay);
    // },[dataToDisplay])

    // const filteredData = dataToDisplay.filter((file) =>
    //     file.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // const filteredData = dataToDisplay.filter((file) => {
    //     try {
    //         const settings = JSON.parse(file.settings);
    //         const fileName = settings.file_name || '';

    //         return fileName.toLowerCase().includes(searchTerm.toLowerCase());
    //     } catch (error) {
    //         console.error('Error parsing settings JSON:', error);
    //         return false;
    //     }
    // });

    const dataToDisplay = useMemo(() => {
        const data =
            tab === 'all' ? allData : tab === 'masterfile' ? masterFileData : transactionData;
        return data.map((file) => {
            try {
                const settings = JSON.parse(file.settings);
                return {
                    ...file,
                    fileName: settings.file_name || '',
                    addedBy: settings.user || '',
                };
            } catch (error) {
                console.error('Error parsing settings JSON:', error);
                return { ...file, fileName: '', addedBy: '' };
            }
        });
    }, [tab, allData, masterFileData, transactionData]);

    // const filteredData = dataToDisplay.filter((file) => {
    //     const searchTermLower = searchTerm.toLowerCase();
    //     return (
    //         file.fileName.toLowerCase().includes(searchTermLower) ||
    //         file.addedBy.toLowerCase().includes(searchTermLower) ||
    //         file.file_type.toLowerCase().includes(searchTermLower)
    //     );
    // });

    const filteredData = dataToDisplay.filter((file) => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = (
            file.fileName.toLowerCase().includes(searchTermLower) ||
            file.addedBy.toLowerCase().includes(searchTermLower) ||
            file.file_type.toLowerCase().includes(searchTermLower)
        );

        const matchesDate = !selectedDate || (file.created_at && file.created_at.startsWith(selectedDate));

        return matchesSearch && matchesDate;
    });

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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                </div>
                {/* Date Picker */}
                <div className={`${isOpen ? 'w-[26%] 2xl:w-[25%] 3xl:w-[20%]' : 'w-[25%] 3xl:w-[15.5%]'} relative`}>
                    <CustomDatePicker
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                </div>
            </div>
            {/* Table */}
            <div>
                <FileTable
                    fileData={filteredData}
                    isOpen={isOpen}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default FileContainer