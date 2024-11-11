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
import useOutsideClick from "@/hooks/useOutsideClick";

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
    description: string;
    department: string;
}

interface AuditLogPageProps {
    fileData: AuditTableProps[];
}

const AuditLogPage = () => {
    const { drawerOpen, setDrawerOpen } = useDrawerContext();
    const { isOpen, setIsOpen } = useSidebarContext();
    const { currentUser, setCurrentUser, setError } = useUserContext();
    const [isLoading, setIsLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);

    const [selectedData, setSelectedData] = useState<AuditTableProps | null>(null);
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);
    const [auditLogs, setAuditLogs] = useState<AuditTableProps[]>([]);
    const [sortAscending, setSortAscending] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState<any>();
    const [showFilter, setShowFilter] = useState(false);

    const handleShowMore = (dataItem: AuditTableProps) => {
        setSelectedData(dataItem);
        setDrawerOpen(true);
    };

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/auditlogs');
            const logs = res.data.map((log: any) => ({
                dateTimeAdded: new Date(log.timestamp),
                employeeName: `${log.user.first_name} ${log.user.middle_name ? log.user.middle_name.charAt(0) + '. ' : ''}${log.user.last_name}`,
                employeeNo: log.user.employee_number,
                userType: log.user.user_type,
                userEmail: log.user.email_address,
                description: log.description,
                actionEvent: log.action as ActionType,
                department: log.user.department
            }));
            const sortedLogs = logs.sort((a: AuditTableProps, b: AuditTableProps) => b.dateTimeAdded.getTime() - a.dateTimeAdded.getTime());
            setAuditLogs(logs);
        } catch (error: any) {
            console.error("Failed to fetch audit logs:", error);
        } finally {
            setIsLoading(false);
        }
    }

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

        const initialFetchTimeout = setTimeout(fetchData, 500);

        const fetchInterval = setInterval(fetchData, 30000);

        return () => {
            clearTimeout(initialFetchTimeout);
            clearInterval(fetchInterval);
        };
    }, []);

    const sortAuditLogs = () => {
        const sortedLogs = [...auditLogs].sort((a, b) => {
            const dateA = new Date(a.dateTimeAdded).getTime();
            const dateB = new Date(b.dateTimeAdded).getTime();
            return sortAscending ? dateA - dateB : dateB - dateA;
        });
        setAuditLogs(sortedLogs);
        setSortAscending(!sortAscending);
    };

    const handleExport = async () => {
        const sysRoles = currentUser?.roles;
        if (!sysRoles?.includes(17)) {
            setError('You are not authorized to export records or files.');
            return;
        }

        setExportLoading(true);
        try {
            const response = await api.post('/auditlogs/export', {}, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `AuditLogs_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            setExportLoading(false);
        } catch (error) {
            setError('Failed to export audit logs. Please try again.');
            setExportLoading(false);
        }

        setExportLoading(false);

        const user = localStorage.getItem('currentUser');
        const parsedUser = JSON.parse(user || '{}');

        const auditData = {
            userId: parsedUser?.userId,
            action: "export",
            act: "logs",
        };

        api.post('/auditlogs/logsaudit', auditData)
            .then(response => {
                
            })
            .catch(error => {
                console.error('Error audit logs:', error);
            });
    };

    const filteredData = auditLogs.filter((record) => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = (
            record.dateTimeAdded.toLocaleDateString().toLowerCase().includes(searchTermLower) ||
            record.employeeName.toLowerCase().includes(searchTermLower) ||
            record.employeeNo.toLowerCase().includes(searchTermLower) ||
            record.employeeNo.toLowerCase().includes(searchTermLower.replace(/#/g, '')) ||
            record.userType.toLowerCase().includes(searchTermLower) ||
            record.userEmail.toLowerCase().includes(searchTermLower) ||
            record.actionEvent.toLowerCase().includes(searchTermLower) ||
            record.description.toLowerCase().includes(searchTermLower) ||
            record.department.toLowerCase().includes(searchTermLower)
        );
        return matchesSearch;
    });

    const filteredDataWithOption = filterOption ? filteredData.filter((record) => record.actionEvent === filterOption) : filteredData;

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = filteredDataWithOption.slice(indexOfFirstItem, indexOfLastItem);

    const ref = useOutsideClick(() => setShowFilter(false));

    return (
        <>
            {(exportLoading) &&
                <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 z-[1500]'>
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                    <p className='text-primary font-light text-[20px] mt-[10px] text-white'>
                        Exporting file(s)...
                    </p>
                </div>
            }
            <div className={`w-full h-screen font-lato bg-background dark:bg-[#1E1E1E]`}>
                <AuditDrawer data={selectedData} />
                <Header icon={GoHistory} title={"Audit Log"} />
                <div className="ml-[95px] mr-[50px]">
                    <div className="flex justify-between m-auto mb-[10px] gap-5 pt-[45px]">
                        <div className={`gap-3 flex`}>
                            <div className="relative">
                                <BiSearchAlt className="absolute left-3 top-[20px] 4xl:top-[24px] text-[20px] 4xl:text-[23px] transform -translate-y-1/2 text-gray-600" />
                                <input
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`${isOpen ? 'w-[300px] 3xl:w-[400px]' : 'w-[400px]'} p-[6px] 4xl:p-[7px] dark:text-white dark:bg-[#3C3C3C] text-[16px] 4xl:text-[20px] pl-[35px] 4xl:pl-[40px] border border-[#868686] rounded-full`}
                                    placeholder="Search here..." />
                            </div>
                            <button title={`${sortAscending ? 'Sort by ascending order' : 'Sort by descending order'}`} onClick={sortAuditLogs} className="flex justify-center items-center bg-white dark:bg-[#3C3C3C] hover:bg-[#ebebeb] dark:hover:bg-[#787878] transition-colors duration-300 ease-in-out 4xl:p-[6px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[46px] w-[50px] 4xl:w-[60px]">
                                {sortAscending ? <LuArrowUpDown className="text-[20px] 4xl:text-[25px] text-[#414141] dark:text-[#d1d1d1]" /> : <LuArrowDownUp className="text-[20px] 4xl:text-[25px] text-[#414141] dark:text-[#d1d1d1]" />}
                            </button>
                            <div ref={ref} className="relative">
                                <button title="Filter by action" className="absolute flex justify-center items-center bg-white hover:bg-[#ebebeb] dark:bg-[#3C3C3C] dark:hover:bg-[#787878] transition-colors duration-300 ease-in-out 4xl:p-[10px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[46px] w-[50px] 4xl:w-[60px]"
                                    onClick={() => { setShowFilter(!showFilter) }}>
                                    <FaFilter className="text-[20px] 4xl:text-[25px] text-[#414141] dark:text-[#d1d1d1]" />
                                </button>
                                {showFilter &&
                                    <div className="animate-pull-down absolute bg-white dark:bg-[#3C3C3C] border border-gray-300 rounded-lg p-2 z-[500] w-[90px] mt-[50px]">
                                        <div className="cursor-pointer text-[18px] my-2 dark:text-[#d1d1d1] dark:hover:text-primary hover:text-primary" onClick={() => setFilterOption('')}>
                                            All
                                        </div>
                                        {Object.values(ActionType).map((action) => (
                                            <div key={action} className="cursor-pointer text-[18px] my-2 dark:text-[#d1d1d1] dark:hover:text-primary hover:text-primary" onClick={() => setFilterOption(action)}>
                                                {action.charAt(0).toUpperCase() + action.slice(1)}
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                        <button title="Export all audit logs"className="flex bg-white dark:bg-[#3C3C3C] dark:hover:bg-[#787878] dark:text-white hover:bg-[#ebebeb] transition-colors duration-300 ease-in-out text-[16px] 4xl:text-[20px] p-[6px] h-[40px] 4xl:h-[46px] border border-[#868686] rounded-[10px] justify-end gap-2"
                            onClick={handleExport}
                        >
                            <FaFileExport className="text-[25px] text-[#414141] dark:text-white m-auto" />
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
                        <tbody className="">
                            {currentListPage.length > 0 ? currentListPage.map((auditLogs, index) => (
                                <tr key={index} className={`${isLoading ? 'hidden' : 'flex w-full h-[74px] items-center text-[14px] 4xl:text-[18px] pl-[15px] 4xl:pl-[20px] py-[7px] dark:bg-[#3C3C3C] dark:text-[#d1d1d1] 4xl:py-[10px] border-b border-x border-black dark:border-[#d1d1d1] border-opacity-[50%] bg-white'} ${index === currentListPage.length - 1 ? 'rounded-b-xl' : ''}`}>
                                    <td className="w-[27.5%]">
                                        {auditLogs.dateTimeAdded.toLocaleString()}
                                    </td>
                                    <td className="flex flex-col w-[23.5%]">
                                        #{auditLogs.employeeNo}
                                    </td>
                                    <td className="flex w-[34.5%] 4xl:w-[37.5%] text-[14px] 4xl:text-[18px] items-center break-all">
                                        <span className="font-bold uppercase">
                                            {auditLogs.actionEvent}:<span className="ml-1 font-normal normal-case">{auditLogs.description}</span>
                                        </span>

                                    </td>
                                    <td className="flex items-center">
                                        <span onClick={() => handleShowMore(auditLogs)} className="dark:brightness-200 cursor-pointer font-bold text-primary hover:text-[#851818] transition-colors duration-300 ease-in-out">
                                            Show More
                                        </span>
                                    </td>
                                </tr>
                            )) :
                                (
                                    <tr className="py-[7px] 4xl:py-[100px]">
                                        <td colSpan={4} className='h-[74px] border-b border-x rounded-b-xl border-black border-opacity-[50%] bg-white dark:bg-[#3C3C3C] dark:text-[#d1d1d1] flex justify-center items-center py-4'>
                                            {isLoading ?
                                                (
                                                    <Spinner className="!size-[30px]" />
                                                ) : (
                                                    <p>No logs available.</p>
                                                )
                                            }
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                    <div className={`${isLoading ? 'hidden' : 'relative py-[1%]'}`}>
                        <PrimaryPagination
                            data={filteredDataWithOption}
                            itemsPerPage={8}
                            handlePageChange={handlePageChange}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuditLogPage