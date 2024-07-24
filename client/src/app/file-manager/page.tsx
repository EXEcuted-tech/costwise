"use client"
import Header from '@/components/header/Header';
import FileContainer from '@/components/pages/file-manager/FileContainer'
import FileTabs from '@/components/pages/file-manager/FileTabs';
import React, { useState } from 'react'
import { BsFolderFill } from "react-icons/bs";
import { PiScrewdriverFill } from "react-icons/pi";
import { VscExport } from "react-icons/vsc";
import { PiUploadLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebarContext } from '@/context/SidebarContext';

const FileManagerPage = () => {
  const { isOpen } = useSidebarContext();
  const [tab, setTab] = useState('all');

  return (
    <>
      <Header icon={BsFolderFill} title={"File Manager"} />
      <div className={`${isOpen ? 'ml-[10px] 2xl:ml-[45px]' : 'ml-[45px]'} mt-[35px] px-[50px]`}>
        <div className='flex'>
          <div className={`${isOpen ? 'w-[95%] 4xl:w-[75%]' : 'w-[95%] 2xl:w-[80%] 3xl:w-[65%] 4xl:w-[60%]' } ml-[10px]`}>
            <FileTabs tab={tab} setTab={setTab} isOpen={isOpen}/>
          </div>
          <div className='flex justify-end w-full pb-[6px]'>
            <button className='flex justify-center items-center bg-white border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#f7f7f7]'>
              <PiScrewdriverFill className={`${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' }`}/>
              <p className={`ml-[5px] font-bold ${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' }`}>Workspace</p>
            </button>
            <button className='flex justify-center items-center bg-white border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#f7f7f7]'>
            <VscExport className={`${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' }`}/>
              <p className={`ml-[5px] font-bold ${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' }`}>Export All Files</p>
            </button>
            <button className='flex justify-center items-center bg-primary text-white border-1 border-[#D3D3D3] px-[15px] 2xl:px-[30px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#9c1c1c]'>
              <PiUploadLight className={`${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' }`}/>
              <p className={`mx-[5px] font-bold ${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' }`}>Upload</p>
              <IoIosArrowDown className={`${isOpen ? 'text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]' }`}/>
            </button>
          </div>
        </div>
        <div className=''>
          <FileContainer tab={tab} isOpen={isOpen}/>
        </div>
      </div>
    </>
  )
}

export default FileManagerPage