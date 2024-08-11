"use client"
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { LuArrowDownUp, LuArrowUpDown } from "react-icons/lu";
import { FaFileExport } from "react-icons/fa6";
import { BiSearchAlt } from "react-icons/bi";
import { GoHistory } from "react-icons/go";
import { useDrawerContext } from "@/context/DrawerContext";
import { useSidebarContext } from "@/context/SidebarContext";
import Header from "@/components/header/Header";
import AuditDrawer from "@/components/drawer/audit-drawer";

const AuditLogPage = () => {
const { drawerOpen, setDrawerOpen } = useDrawerContext();
const { isOpen, setIsOpen } = useSidebarContext();
const toggleDrawer = () => setDrawerOpen(!drawerOpen);

return (
    <div className={`w-full h-full font-lato`}>
        { drawerOpen ? <AuditDrawer /> : "" }
        <Header icon={GoHistory} title={"Audit Log"} />
        
        <div className="flex justify-between w-[80%] m-auto mb-[10px] gap-5 pt-[50px]">
            <div className="flex gap-5">
                <div className="relative">
                    <BiSearchAlt className="absolute left-3 top-[20px] 4xl:top-[28px] text-[20px] 4xl:text-[23px] transform -translate-y-1/2 text-gray-600"/>
                    <input className="p-[6px] 4xl:p-[10px] text-[16px] 4xl:text-[20px] pl-[35px] 4xl:pl-[40px] border border-[#868686] rounded-full w-[200px] 4xl:w-[250px]" placeholder="Search here..." />
                </div>
                <button className="flex justify-center items-center 4xl:p-[10px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[52px] w-[50px] 4xl:w-[60px]">
                    <LuArrowDownUp className="text-[20px] 4xl:text-[25px] text-[#414141]" />
                </button>
                <button className="flex justify-center items-center 4xl:p-[10px] border border-[#868686] rounded-[10px] h-[40px] 4xl:h-[52px] w-[50px] 4xl:w-[60px]">
                    <FaFilter className="text-[20px] 4xl:text-[25px] text-[#414141]" />
                </button>
            </div>
            <button className="flex text-[16px] 4xl:text-[20px] p-[6px] 4xl:p-[10px] h-[40px] 4xl:h-[52px] border border-[#868686] rounded-[10px] justify-end gap-2">
                <FaFileExport className="text-[25px] 4xl:text-[30px] text-[#414141]" />
                Export
            </button>
        </div>
        <div className="w-[80%] m-auto">
            <div className="flex text-[18px] 4xl:text-[22px] p-[15px] 4xl:p-[20px] bg-primary text-white font-bold rounded-t-[20px]">
                <p className="w-[28%]">Timestamp</p>
                <p className="w-[28%]">
                    Employee No.
                    </p>
                <p className="w-[31.5%] 4xl:w-[34%]">
                    Action/Event
                </p>
                <p>
                    Action
                </p>
            </div>
            <div className="flex w-full text-[14px] 4xl:text-[18px] pl-[15px] 4xl:pl-[20px] py-[7px] 4xl:py-[10px] border border-black border-opacity-[50%] border-t-0">
                <div className="w-[27.5%]">
                    <p>January 12, 2024 12:50:22</p>
                </div>
                <div className="w-[23.5%]">
                    <p>#112391</p>
                    <p className="text-[12px] opacity-[50%]">
                        Regular User
                    </p>
                </div>
                <div className="flex w-[34.5%] 4xl:w-[37.5%] text-[12px] 4xl:text-[16px] items-center">
                    <p>Record changed: BOM_V1_Cost.csv</p>
                </div>
                <div className="flex items-center">
                    <p 
                        onClick={toggleDrawer} 
                        className="cursor-pointer font-bold text-primary"
                    >
                        Show More
                    </p>
                </div>
            </div>
            <div className="flex w-full text-[14px] 4xl:text-[18px] pl-[15px] 4xl:pl-[20px] py-[7px] 4xl:py-[10px] border border-black border-opacity-[50%] border-t-0">
                <div className="w-[27.5%]">
                    <p>January 12, 2024 12:50:22</p>
                </div>
                <div className="w-[23.5%]">
                    <p>#112391</p>
                    <p className="text-[12px] opacity-[50%]">
                        Regular User
                    </p>
                </div>
                <div className="flex w-[34.5%] 4xl:w-[37.5%] text-[12px] 4xl:text-[16px] items-center">
                    <p>Record changed: BOM_V1_Cost.csv</p>
                </div>
                <div className="flex items-center">
                    <p 
                        onClick={toggleDrawer} 
                        className="cursor-pointer font-bold text-primary"
                    >
                        Show More
                    </p>
                </div>
            </div>
            <div className="flex w-full text-[14px] 4xl:text-[18px] pl-[15px] 4xl:pl-[20px] py-[7px] 4xl:py-[10px] border border-black border-opacity-[50%] border-t-0 rounded-b-[20px]">
                <div className="w-[27.5%]">
                    <p>January 12, 2024 12:50:22</p>
                </div>
                <div className="w-[23.5%]">
                    <p>#112391</p>
                    <p className="text-[12px] opacity-[50%]">
                        Regular User
                    </p>
                </div>
                <div className="flex w-[34.5%] 4xl:w-[37.5%] text-[12px] 4xl:text-[16px] items-center">
                    <p>Record changed: BOM_V1_Cost.csv</p>
                </div>
                <div className="flex items-center">
                    <p 
                        onClick={toggleDrawer} 
                        className="cursor-pointer font-bold text-primary"
                    >
                        Show More
                    </p>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default AuditLogPage

