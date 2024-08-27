"use client"
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { LuArrowDownUp, LuArrowUpDown } from "react-icons/lu";
import { FaFileExport } from "react-icons/fa6";
import { BiSearchAlt } from "react-icons/bi";
import { GoHistory } from "react-icons/go";
import { useDrawerContext } from "@/context/DrawerContext";
import { useSidebarContext } from "@/context/SidebarContext";
import Header from "@/components/header/Header";
import AuditDrawer from "@/components/drawer/audit-drawer";
import PrimaryPagination from "@/components/pagination/PrimaryPagination";

export interface AuditTableProps {
    dateTimeAdded: string;
    employeeNo: string;
    userType: string;
    actionEvent: string;
}

interface AuditLogPageProps {
    fileData: AuditTableProps[];
}

const AuditLogPage: React.FC<AuditLogPageProps> = ({fileData}) => {
const { drawerOpen, setDrawerOpen } = useDrawerContext();
const { isOpen, setIsOpen } = useSidebarContext();
const toggleDrawer = () => setDrawerOpen(!drawerOpen);
const [ data, setData ] = useState<AuditTableProps[]>(fakeAuditAllData);

const [currentPage, setCurrentPage] = useState<number>(1);
const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
};

const indexOfLastItem = currentPage * 8;
const indexOfFirstItem = indexOfLastItem - 8;
const currentListPage = data ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

return (
    <div className={`w-full h-screen font-lato bg-background`}>
        { drawerOpen ? <AuditDrawer /> : "" }
        <Header icon={GoHistory} title={"Audit Log"} />
        
        <div className="flex justify-between w-[80%] m-auto mb-[10px] gap-5 pt-[45px]">
            <div className="flex gap-5">
                <div className="relative">
                    <BiSearchAlt className="absolute left-3 top-[20px] 4xl:top-[24px] text-[20px] 4xl:text-[23px] transform -translate-y-1/2 text-gray-600"/>
                    <input className="p-[6px] 4xl:p-[7px] text-[16px] 4xl:text-[20px] pl-[35px] 4xl:pl-[40px] border border-[#868686] rounded-full w-[400px]" placeholder="Search here..." />
                </div>
                <button className="flex justify-center items-center bg-white 4xl:p-[6px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[46px] w-[50px] 4xl:w-[60px]">
                    <LuArrowDownUp className="text-[20px] 4xl:text-[25px] text-[#414141]" />
                </button>
                <button className="flex justify-center items-center bg-white 4xl:p-[10px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[46px] w-[50px] 4xl:w-[60px]">
                    <FaFilter className="text-[20px] 4xl:text-[25px] text-[#414141]" />
                </button>
            </div>
            <button className="flex bg-white text-[16px] 4xl:text-[20px] p-[6px] h-[40px] 4xl:h-[46px] border border-[#868686] rounded-[10px] justify-end gap-2">
                <FaFileExport className="text-[25px] text-[#414141] m-auto" />
                Export
            </button>
        </div>
        {/* Table */}
        <table className="w-[80%] m-auto">
            <thead className="flex text-[18px] 4xl:text-[22px] p-[15px] 4xl:p-[20px] bg-primary text-white font-bold rounded-t-[20px] text-left">
                <th className="w-[28%]">Timestamp</th>
                <th className="w-[27.5%]">Employee No.</th>
                <th className="w-[31.5%] 4xl:w-[34.3%]">Action/Event</th>
                <th>Action</th>
            </thead>
            <tbody>
                {currentListPage.length > 0 ? currentListPage.map((data, index) => (
                    <tr key={index} className={`flex w-full text-[14px] 4xl:text-[18px] pl-[15px] 4xl:pl-[20px] py-[7px] 4xl:py-[10px] border border-black border-opacity-[50%] ${index === currentListPage.length - 1 ? 'rounded-b-xl' : ''}`}>
                        <tr className="w-[27.5%]">
                            <td>{data.dateTimeAdded}</td>
                        </tr>
                        <tr className="flex flex-col w-[23.5%]">
                            <td>{data.employeeNo}</td>
                            <td className="text-[14px] 4xl:text-[16px] opacity-[50%]">{data.userType}</td>
                        </tr>
                        <tr className="flex w-[34.5%] 4xl:w-[37.5%] text-[14px] 4xl:text-[16px] items-center">
                            <td>{data.actionEvent}</td>
                        </tr>
                        <tr className="flex items-center">
                            <td onClick={toggleDrawer} className="cursor-pointer font-bold text-primary">
                                Show More
                            </td>
                        </tr>
                    </tr>
                )): 
                (
                    <div className="flex justify-center border border-black border-opacity-[50%] rounded-b-xl py-[7px] 4xl:py-[10px]">
                        <p>No logs available</p>
                    </div>
                )}
            </tbody>
        </table>
        <div className='relative py-[1%]'>
            <PrimaryPagination
                data={data}
                itemsPerPage={8}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
            />
        </div>
    </div>
  )
}

export default AuditLogPage

const fakeAuditAllData: AuditTableProps[] = [
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