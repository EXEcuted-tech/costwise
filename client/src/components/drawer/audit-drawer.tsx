"use client"
import { useSidebarContext } from "@/context/SidebarContext";
import { useDrawerContext } from "@/context/DrawerContext";
import Link from "next/link";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const AuditDrawer = () => {
    const { isOpen } = useSidebarContext();
    const { drawerOpen, setDrawerOpen } = useDrawerContext();
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    return (
    <div 
        className="fixed w-screen z-[1000] h-full bg-black bg-opacity-50 backdrop-brightness-50 flex justify-end" 
        onClick={toggleDrawer}
    >
        <div className={`bg-white w-[70%] 4xl:w-[35%] h-full p-10 pt-[20px] pr-[150px] drop-shadow-2xl ${isOpen ? 'w-[69%] 2xl:w-[59%] 4xl:w-[49%] pr-[320px] 2xl:pr-[400px]' : ''}`}>
            <div className="flex justify-end">
                <div 
                    className="border-2 p-1 rounded-[5px] cursor-pointer" 
                    onClick={toggleDrawer}
                >
                    <MdClose 
                         
                        className="text-[24px]"
                    />
                </div>
                
            </div>
            <div className="flex flex-col gap-[5px] pb-[5px] font-bold">
                <p className="text-[24px] font-black">Audit Log Details</p>
                <p className="text-[18px] text-[#9B9B9B]">Kathea Mari Mayol • January 13, 2024</p>
            </div>
            <div className="flex flex-col border-2 text-[17px] p-5 rounded-[10px]">
                <div className="flex text-[20px] font-bold items-center pb-[10px]">
                    <p className="w-[50%]">Field</p>
                    <p className="w-[50%] break-words leading-[20px]">Current Value</p>
                </div>
                <hr className="border-t-[1px] border-[#989898] w-full mx-auto" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">Employee No.</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">#112391</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">Email</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">katheamari@gmail.com</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">User Type</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">Regular User</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px]">
                    <p className="w-[50%]">Action/Event</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">Record changed under Summary of Product Costing: BOM_V1_Cost.csv</p>
                </div>
                <hr className="border-t-[1px] border-[#989898]" />
                <div className="flex py-[10px] items-center">
                    <p className="w-[50%]">Time</p>
                    <p className="w-[50%] break-words leading-[20px] items-center">12:50:22 AM</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default AuditDrawer