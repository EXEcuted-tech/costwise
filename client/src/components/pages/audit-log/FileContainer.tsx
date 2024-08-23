import React, { useRef, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import CustomDatePicker from '@/components/form-controls/CustomDatePicker';
// import AuditTable from './FileTable';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';

export interface AuditTableProps {
    dateTimeAdded: string;
    employeeNo: string;
    userType: string;
    actionEvent: string;
}

const FileContainer: React.FC<{ tab: string, isOpen: boolean }> = () => {  

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
                        className="w-full pl-[35px] pr-[5px] bg-white border border-[#868686] placeholder-text-[#B0B0B0] text-[#5C5C5C] text-[15px] rounded-[5px] py-[3px]"
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

const fakeFileAllData: AuditTableProps[] = [
    {
        dateTimeAdded: 'January 12, 2024 12:50:22',
        employeeNo: '#112391',
        userType: 'Regular User',
        actionEvent: 'Record changed: BOM_V1_Cost.csv'
    },
    {
        dateTimeAdded: 'January 13, 2024 12:50:22',
        employeeNo: '#123531',
        userType: 'Regular User',
        actionEvent: 'Record changed: BOM_V3_Cost.csv'
    },
    {
        dateTimeAdded: 'January 14, 2024 12:50:22',
        employeeNo: '#125131',
        userType: 'Regular User',
        actionEvent: 'Record changed: BOM_V5_Cost.csv'
    },
    {
        dateTimeAdded: 'January 15, 2024 12:50:22',
        employeeNo: '#199999',
        userType: 'Regular User',
        actionEvent: 'Record changed: BOM_V7_Cost.csv'
    },
    {
        dateTimeAdded: 'January 17, 2024 12:50:22',
        employeeNo: '#188888',
        userType: 'Regular User',
        actionEvent: 'Record changed: BOM_V9_Cost.csv'
    },
];
