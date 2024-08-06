import React, { useRef, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import CustomDatePicker from '@/components/form-controls/CustomDatePicker';
import FileTable from './FileTable';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';

export interface FileTableProps {
    fileLabel: string;
    fileName: string;
    fileType: string;
    dateAdded: string;
    addedBy: string;
}

const FileContainer: React.FC<{ tab: string, isOpen: boolean }> = ({ tab, isOpen }) => {  

    return (
        <div className={`!font-lato bg-white w-full rounded-lg drop-shadow-lg`}>
            {/* Title */}
            <h1 className={`${isOpen ? 'ml-[20px] 2xl:ml-[46px] text-[28px] 2xl:text-[32px]' : 'text-[32px] ml-[46px]'} font-bold py-[2px]`}>
                {tab === 'all' ? 'All Files' : tab === 'masterfile' ? 'Master Files' : 'Transactional Files'}
            </h1>
            <div className={`${isOpen ? 'px-[20px] 2xl:px-[46px]' : 'px-[46px]'} flex items-center h-[50px] bg-[#F3F3F3] border-y-[0.8px] border-[#868686]`}>
                {/* Search Component */}
                <div className={`${isOpen ? 'w-[74%] 2xl:w-[75%] 3xl:w-[80%]' : 'w-[75%] 3xl:w-[84.5%]' } relative mr-[1%]`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <AiOutlineSearch className="text-[#B0B0B0] text-[22px]" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-[35px] pr-[5px] bg-white border border-[#868686] placeholder-text-[#B0B0B0] text-[#5C5C5C] text-[15px] rounded-[5px] py-[3px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search here..."
                        required
                    />
                </div>
                {/* Date Picker */}
                <div className={`${isOpen ? 'w-[26%] 2xl:w-[25%] 3xl:w-[20%]' : 'w-[25%] 3xl:w-[15.5%]' } relative`}>
                    <CustomDatePicker/>
                </div>
            </div>
            {/* Table */}
            <div>
                <FileTable fileData={tab === 'all' ? fakeFileAllData : tab === 'masterfile' ? fakeFileMasterData : fakeFileTransactionData} isOpen={isOpen}/>
            </div>
        </div>
    )
}

export default FileContainer

const fakeFileAllData: FileTableProps[] = [
    {
        fileLabel: 'Bom and Cost 1',
        fileName: 'Bom_Cost_1.csv',
        fileType: 'Master File',
        dateAdded: '07/01/2024',
        addedBy: 'Alice Smith'
    },
    {
        fileLabel: 'Transactional File',
        fileName: 'Transaction_1.csv',
        fileType: 'Transaction',
        dateAdded: '07/02/2024',
        addedBy: 'Bob Johnson'
    },
    {
        fileLabel: 'Bom and Cost 2',
        fileName: 'Bom_Cost_2.csv',
        fileType: 'Master File',
        dateAdded: '07/03/2024',
        addedBy: 'Carol White'
    },
    {
        fileLabel: 'Transactional File',
        fileName: 'Transaction_2.csv',
        fileType: 'Transaction',
        dateAdded: '07/04/2024',
        addedBy: 'David Browning'
    },
    {
        fileLabel: 'Bom and Cost 3',
        fileName: 'Bom_Cost_3.csv',
        fileType: 'Master File',
        dateAdded: '07/05/2024',
        addedBy: 'Eva Davis'
    },
    {
        fileLabel: 'Transactional File',
        fileName: 'Transaction_3.csv',
        fileType: 'Transaction',
        dateAdded: '07/06/2024',
        addedBy: 'Frank Miller'
    },
    {
        fileLabel: 'Bom and Cost 4',
        fileName: 'Bom_Cost_4.csv',
        fileType: 'Master File',
        dateAdded: '07/07/2024',
        addedBy: 'Grace Wilson'
    },
    {
        fileLabel: 'Transactional File',
        fileName: 'Transaction_4.csv',
        fileType: 'Transaction',
        dateAdded: '07/08/2024',
        addedBy: 'Henry Moore'
    },
    {
        fileLabel: 'Bom and Cost 5',
        fileName: 'Bom_Cost_5.csv',
        fileType: 'Master File',
        dateAdded: '07/09/2024',
        addedBy: 'Ivy Taylor'
    },
    {
        fileLabel: 'Transactional File',
        fileName: 'Transaction_5.csv',
        fileType: 'Transaction',
        dateAdded: '07/10/2024',
        addedBy: 'Jack Anderson'
    }
];

const fakeFileMasterData = [
    { fileLabel: 'Bom and Cost 1', fileName: 'Bom_Cost_1.csv', fileType: 'Master File', dateAdded: '12/01/2024', addedBy: 'Alice Smith' },
    { fileLabel: 'Bom and Cost 2', fileName: 'Bom_Cost_2.csv', fileType: 'Master File', dateAdded: '12/02/2024', addedBy: 'Bob Johnson' },
    { fileLabel: 'Bom and Cost 3', fileName: 'Bom_Cost_3.csv', fileType: 'Master File', dateAdded: '12/03/2024', addedBy: 'Carol White' },
    { fileLabel: 'Bom and Cost 4', fileName: 'Bom_Cost_4.csv', fileType: 'Master File', dateAdded: '12/04/2024', addedBy: 'David Brown' },
    { fileLabel: 'Bom and Cost 5', fileName: 'Bom_Cost_5.csv', fileType: 'Master File', dateAdded: '12/05/2024', addedBy: 'Eva Davis' },
];

const fakeFileTransactionData = [
    { fileLabel: 'Transactional File 1', fileName: 'Transaction_1.csv', fileType: 'Transaction', dateAdded: '12/06/2024', addedBy: 'Frank Miller' },
    { fileLabel: 'Transactional File 2', fileName: 'Transaction_2.csv', fileType: 'Transaction', dateAdded: '12/07/2024', addedBy: 'Grace Wilson' },
    { fileLabel: 'Transactional File 3', fileName: 'Transaction_3.csv', fileType: 'Transaction', dateAdded: '12/08/2024', addedBy: 'Henry Moore' },
    { fileLabel: 'Transactional File 4', fileName: 'Transaction_4.csv', fileType: 'Transaction', dateAdded: '12/09/2024', addedBy: 'Ivy Taylor' },
    { fileLabel: 'Transactional File 5', fileName: 'Transaction_5.csv', fileType: 'Transaction', dateAdded: '12/10/2024', addedBy: 'Jack Anderson' },
];
