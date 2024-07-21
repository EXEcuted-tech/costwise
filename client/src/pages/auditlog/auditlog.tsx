"use client"
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { LuArrowDownUp, LuArrowUpDown } from "react-icons/lu";
import { FaFileExport } from "react-icons/fa6";

function AuditLog() {

const [drawerOpen, setDrawerOpen] = useState(false);
const toggleDrawer = () => setDrawerOpen(!drawerOpen);

return (
    <div className='w-full h-full font-lato mt-[50px]'>
        <div className="flex justify-between w-[80%] m-auto mb-[10px] gap-5">
            <div className="flex gap-5">
                <input className="p-[10px] border border-[#868686] rounded-full w-[250px]" placeholder="Search here..." />
                <button className="flex justify-center items-center p-[10px] border border-[#868686] rounded-[10px] w-[60px]">
                    <LuArrowDownUp className="text-[25px] text-[#414141]" />
                </button>
                <button className="flex justify-center items-center px-[10px] border border-[#868686] rounded-[10px] w-[60px]">
                    <FaFilter className="text-[25px] text-[#414141]" />
                </button>
            </div>
            <button className="flex text-[20px] p-[10px] border border-[#868686] rounded-[10px] justify-end gap-2">
                <FaFileExport className="text-[30px] text-[#414141]" />
                Export
            </button>
        </div>
        <div className="w-[80%] m-auto">
            <div className="flex justify-between m-auto text-[22px] p-[20px] bg-primary text-white font-bold rounded-t-[20px]">
                <p>Timestamp</p>
                <p className="ml-[70px]">
                    Employee No.
                    </p>
                <p className="mr-[30px]">
                    Action/Event
                </p>
                <p className="mr-[27px]">
                    Action
                </p>
            </div>
            <div className="flex justify-between m-auto text-[18px] px-[20px] py-[10px] border border-black border-opacity-[50%] border-t-0">
                <div>
                    <p>January 12, 2024 12:50:22</p>
                </div>
                <div>
                    <p>#112391</p>
                    <p className="text-[16px] opacity-[50%]">
                        Regular User
                    </p>
                </div>
                <div className="flex text-[16px] items-center">
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
            <div className="flex justify-between m-auto text-[18px] px-[20px] py-[10px] border border-black border-opacity-[50%] border-t-0">
                <div>
                    <p>January 12, 2024 12:50:22</p>
                </div>
                <div>
                    <p>#112391</p>
                    <p className="text-[16px] opacity-[50%]">
                        Regular User
                    </p>
                </div>
                <div className="flex text-[16px] items-center">
                    <p>Record changed: BOM_V1_Cost.csv</p>
                </div>
                <div className="flex items-center">
                    <p 
                        onClick={toggleDrawer} 
                        className="cursor-pointer font-bold text-primary"
                    >
                        Show More</p>
                </div>
            </div>
            <div className="flex justify-between m-auto text-[18px] px-[20px] py-[10px] border border-black border-opacity-[50%] border-t-0 rounded-b-[20px]">
                <div>
                    <p>January 12, 2024 12:50:22</p>
                </div>
                <div>
                    <p>#112391</p>
                    <p className="text-[16px] opacity-[50%]">
                        Regular User
                    </p>
                </div>
                <div className="flex text-[16px] items-center">
                    <p>Record changed: BOM_V1_Cost.csv</p>
                </div>
                <div className="flex items-center">
                    <p 
                        onClick={toggleDrawer} 
                        className="cursor-pointer font-bold text-primary"
                    >
                        Show More</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuditLog

