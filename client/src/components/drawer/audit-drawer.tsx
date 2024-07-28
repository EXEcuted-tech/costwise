"use client"
import { useState } from "react";
import { MdClose } from "react-icons/md";

const AuditDrawer = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
    <div className='fixed z-2 w-screen h-screen bg-black flex justify-end'>
        <div className="bg-white w-[40%] h-full p-10 pr-[150px]">
            <MdClose />
            <p>Audit Log Details</p>
            <p>Kathea Mari Mayol • January 13, 2024</p>
            <div className="border-[5px]">
                <div className="flex">
                    <p>Field</p>
                    <p>Current Value</p>
                </div>
                <hr className="border-t-2 border-[#989898]" />
                <div className="flex">
                    <p>Employee No.</p>
                    <p>#112391</p>
                </div>
                <hr className="border-t-2 border-[#989898]" />
                <div className="flex">
                    <p>Email</p>
                    <p>katheamar i@gmail.com</p>
                </div>
                <hr className="border-t-2 border-[#989898]" />
                <div className="flex">
                    <p>User Type</p>
                    <p>Regular User</p>
                </div>
                <hr className="border-t-2 border-[#989898]" />
                <div className="flex">
                    <p>Time</p>
                    <p>12:50:22 AM</p>
                </div>
                <hr className="border-t-2 border-[#989898]" />
            </div>
        </div>
    </div>
    )
}

export default AuditDrawer