"use client"
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { LuArrowDownUp, LuArrowUpDown } from "react-icons/lu";
import { FaFileExport } from "react-icons/fa6";
import { BiSearchAlt } from "react-icons/bi";
import { GoHistory } from "react-icons/go";
import { useDrawerContext } from "@/contexts/DrawerContext";
import { useSidebarContext } from "@/contexts/SidebarContext";
import Header from "@/components/header/Header";
import AuditDrawer from "@/components/drawer/audit-drawer";
import PrimaryPagination from "@/components/pagination/PrimaryPagination";
import api from "@/utils/api";
import { useUserContext } from "@/contexts/UserContext";
import Spinner from "@/components/loaders/Spinner";

enum ActionType {
    General = 'general',
    Crud = 'crud',
    Import = 'import',
    Export = 'export',
    Stock = 'stock'
}

interface AuditLogs {
    log_id: number;
    user_id: number;
    action: ActionType;
    timestamp: Date;
}

export interface AuditTableProps {
    dateTimeAdded: Date;
    employeeName: string;
    employeeNo: string;
    userType: string;
    userEmail: string;
    actionEvent: ActionType;
    department: string;
}

interface AuditLogPageProps {
    fileData: AuditTableProps[];
}

const AuditLogPage = () => {
    const { drawerOpen, setDrawerOpen } = useDrawerContext();
    const { isOpen, setIsOpen } = useSidebarContext();
    const { currentUser, setCurrentUser } = useUserContext();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedData, setSelectedData] = useState<AuditTableProps | null>(null);
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);
    // const [data, setData] = useState<AuditTableProps[]>(fakeAuditAllData);
    const [auditLogs, setAuditLogs] = useState<AuditTableProps[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleShowMore = (dataItem: AuditTableProps) => {
        setSelectedData(dataItem);
        setDrawerOpen(true);
    };

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = auditLogs ? auditLogs.slice(indexOfFirstItem, indexOfLastItem) : [];

        
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser(parsedUser);
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }
        console.log(currentUser);
        const interval = setInterval(() => {
            const fetchData = async () => {
                try {
                    const res = await api.get('/auditlogs');
                    const logs = res.data.map((log: any) => ({
                        // log_id: log.log_id,
                        // user_id: log.user_id,
                        // action: log.action as ActionType,
                        // timestamp: new Date(log.timestamp),
                        dateTimeAdded: new Date(log.timestamp),
                        employeeName: `${log.user.first_name} ${log.user.middle_name ? log.user.middle_name.charAt(0) + '. ' : ''}${log.user.last_name}`,
                        employeeNo: log.user.employee_number,
                        userType: log.user.user_type,
                        userEmail: log.user.email_address,
                        actionEvent: log.action as ActionType,
                        department: log.user.department
                    }));
                    setAuditLogs(logs);
                    setIsLoading(false);
                } catch (error: any) {
                    console.error("Failed to fetch audit logs:", error);
                }
            }
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [setCurrentUser]);

    return (
        <div className={`w-full h-screen font-lato bg-background`}>
            <AuditDrawer data={selectedData}/>
            <Header icon={GoHistory} title={"Audit Log"} />
            <div className="ml-[95px] mr-[50px]">
                <div className="flex justify-between m-auto mb-[10px] gap-5 pt-[45px]">
                    <div className={`gap-3 flex`}>
                        <div className="relative">
                            <BiSearchAlt className="absolute left-3 top-[20px] 4xl:top-[24px] text-[20px] 4xl:text-[23px] transform -translate-y-1/2 text-gray-600" />
                            <input className={`${isOpen ? 'w-[300px] 3xl:w-[400px]': 'w-[400px]'} p-[6px] 4xl:p-[7px] text-[16px] 4xl:text-[20px] pl-[35px] 4xl:pl-[40px] border border-[#868686] rounded-full`} placeholder="Search here..." />
                        </div>
                        <button className="flex justify-center items-center bg-white hover:bg-[#ebebeb] transition-colors duration-300 ease-in-out 4xl:p-[6px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[46px] w-[50px] 4xl:w-[60px]">
                            <LuArrowDownUp className="text-[20px] 4xl:text-[25px] text-[#414141]" />
                        </button>
                        <button className="flex justify-center items-center bg-white hover:bg-[#ebebeb] transition-colors duration-300 ease-in-out 4xl:p-[10px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[46px] w-[50px] 4xl:w-[60px]">
                            <FaFilter className="text-[20px] 4xl:text-[25px] text-[#414141]" />
                        </button>
                    </div>
                    <button className="flex bg-white hover:bg-[#ebebeb] transition-colors duration-300 ease-in-out text-[16px] 4xl:text-[20px] p-[6px] h-[40px] 4xl:h-[46px] border border-[#868686] rounded-[10px] justify-end gap-2">
                        <FaFileExport className="text-[25px] text-[#414141] m-auto" />
                        Export
                    </button>
                </div>
                {/* Table */}
                <table className='w-full'>
                    <thead>
                        <tr className="flex text-[18px] 4xl:text-[22px] p-[15px] 4xl:p-[20px] bg-primary text-white font-bold rounded-t-[20px] text-left">
                            <th className="w-[28%]">Timestamp</th>
                            <th className="w-[27.5%]">Employee No.</th>
                            <th className="w-[31.5%] 4xl:w-[34.3%]">Action/Event</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentListPage.length > 0 ? currentListPage.map((auditLogs, index) => (
                            <tr key={index} className={`${isLoading? 'hidden' : 'flex w-full h-[74px] items-center text-[14px] 4xl:text-[18px] pl-[15px] 4xl:pl-[20px] py-[7px] 4xl:py-[10px] border-b border-x border-black border-opacity-[50%] bg-white'} ${index === currentListPage.length - 1 ? 'rounded-b-xl' : ''}`}>
                                <td className="w-[27.5%]">
                                    {auditLogs.dateTimeAdded.toLocaleString()}
                                </td>
                                <td className="flex flex-col w-[23.5%]">
                                    #{auditLogs.employeeNo}
                                </td>
                                <td className="flex w-[34.5%] 4xl:w-[37.5%] text-[14px] 4xl:text-[16px] items-center">
                                    {auditLogs.actionEvent}
                                </td>
                                <td className="flex items-center">
                                    <span onClick={() => handleShowMore(auditLogs)} className="cursor-pointer font-bold text-primary hover:text-[#851818] transition-colors duration-300 ease-in-out">
                                        Show More
                                    </span>
                                </td>
                            </tr>
                        )) :
                            (
                                <tr className="py-[7px] 4xl:py-[100px]">
                                    <td colSpan={4} className='h-[74px] border-b border-x rounded-b-xl border-black border-opacity-[50%] bg-white flex justify-center items-center py-4'>
                                    {isLoading ? 
                                        (
                                            <Spinner className="!size-[30px]" />
                                        ) : 
                                        (
                                            <p>No logs available</p>
                                        )
                                    }
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
                <div className={`${isLoading? 'hidden': 'relative py-[1%]'}`}>
                    <PrimaryPagination
                        data={auditLogs}
                        itemsPerPage={8}
                        handlePageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default AuditLogPage

// const fakeAuditAllData: AuditTableProps[] = [
//     {
//         dateTimeAdded: 'January 12, 2024 12:50:22',
//         employeeName: 'Kathea Mari Mayol',
//         employeeNo: '#112391',
//         userType: 'Regular User',
//         userEmail: 'katheamari@gmail.com',
//         actionEvent: 'Record changed: BOM_V1_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 13, 2024 12:50:22',
//         employeeName: 'Franz Casimir Ondiano',
//         employeeNo: '#123531',
//         userType: 'Regular User',
//         userEmail: 'franzcasimir.ondiano@gmail.com',
//         actionEvent: 'Record changed: BOM_V3_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 14, 2024 12:50:22',
//         employeeName: 'Hannah Angelica Galve',
//         employeeNo: '#125131',
//         userType: 'Regular User',
//         userEmail: 'hannah.galve@gmail.com',
//         actionEvent: 'Record changed: BOM_V5_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 15, 2024 12:50:22',
//         employeeName: 'Tyrone Ybanez',
//         employeeNo: '#199999',
//         userType: 'Regular User',
//         userEmail: 'tyrone.ybanez@gmail.com',
//         actionEvent: 'Record changed: BOM_V7_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 17, 2024 12:50:22',
//         employeeName: 'Kathea Mari Mayol',
//         employeeNo: '#188888',
//         userType: 'Regular User',
//         userEmail: 'katheamari@gmail.com',
//         actionEvent: 'Record changed: BOM_V9_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 12, 2024 12:50:22',
//         employeeName: 'Franz Casimir Ondiano',
//         employeeNo: '#112391',
//         userType: 'Regular User',
//         userEmail: 'franzcasimir.ondiano@gmail.com',
//         actionEvent: 'Record changed: BOM_V1_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 13, 2024 12:50:22',
//         employeeName: 'Hannah Angelica Galve',
//         employeeNo: '#123531',
//         userType: 'Regular User',
//         userEmail: 'hannah.galve.ondiano@gmail.com',
//         actionEvent: 'Record changed: BOM_V3_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 14, 2024 12:50:22',
//         employeeName: 'Tyrone Ybanez',
//         employeeNo: '#125131',
//         userType: 'Regular User',
//         userEmail: 'tyrone.ybanez@gmail.com',
//         actionEvent: 'Record changed: BOM_V5_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 15, 2024 12:50:22',
//         employeeName: 'Kathea Mari Mayol',
//         employeeNo: '#199999',
//         userType: 'Regular User',
//         userEmail: 'katheamari@gmail.com',
//         actionEvent: 'Record changed: BOM_V7_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 17, 2024 12:50:22',
//         employeeName: 'Franz Casimir Ondiano',
//         employeeNo: '#188888',
//         userType: 'Regular User',
//         userEmail: 'franzcasimir.ondiano@gmail.com',
//         actionEvent: 'Record changed: BOM_V9_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 12, 2024 12:50:22',
//         employeeName: 'Hannah Angelica Galve',
//         employeeNo: '#112391',
//         userType: 'Regular User',
//         userEmail: 'hannah.galve@gmail.com',
//         actionEvent: 'Record changed: BOM_V1_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 13, 2024 12:50:22',
//         employeeName: 'Tyrone Ybanez',
//         employeeNo: '#123531',
//         userType: 'Regular User',
//         userEmail: 'tyrone.ybanez@gmail.com',
//         actionEvent: 'Record changed: BOM_V3_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 14, 2024 12:50:22',
//         employeeName: 'Kathea Mari Mayol',
//         employeeNo: '#125131',
//         userType: 'Regular User',
//         userEmail: 'katheamari@gmail.com',
//         actionEvent: 'Record changed: BOM_V5_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 15, 2024 12:50:22',
//         employeeName: 'Franz Casimir Ondiano',
//         employeeNo: '#199999',
//         userType: 'Regular User',
//         userEmail: 'franzcasimir.ondiano@gmail.com',
//         actionEvent: 'Record changed: BOM_V7_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 17, 2024 12:50:22',
//         employeeName: 'Hannah Angelica Galve',
//         employeeNo: '#188888',
//         userType: 'Regular User',
//         userEmail: 'hannah.galve@gmail.com',
//         actionEvent: 'Record changed: BOM_V9_Cost.csv',
//         department: 'Accounting',
//     },
//     {
//         dateTimeAdded: 'January 13, 2024 12:50:22',
//         employeeName: 'Tyrone Ybanez',
//         employeeNo: '#123531',
//         userType: 'Regular User',
//         userEmail: 'tyrone.ybanez@gmail.com',
//         actionEvent: 'Record changed: BOM_V3_Cost.csv',
//         department: 'Accounting',
//     },
// ];