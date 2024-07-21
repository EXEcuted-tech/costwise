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

const FileManagerPage = () => {
  const [tab, setTab] = useState('all');

  return (
    <>
      <Header icon={BsFolderFill} title={"File Manager"} />
      <div className='ml-[45px] mt-[35px] px-[50px]'>
        <div className='flex'>
          <div className='w-[85%] 2xl:w-[80%] 3xl:w-[65%] 4xl:w-[60%] ml-[10px]'>
            <FileTabs tab={tab} setTab={setTab}/>
          </div>
          <div className='flex justify-end w-full pb-[6px]'>
            <button className='flex justify-center items-center bg-white border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow-lg rounded-[10px]
                            hover:bg-[#f7f7f7]'>
              <PiScrewdriverFill/>
              <p className='ml-[5px] font-bold'>Workspace</p>
            </button>
            <button className='flex justify-center items-center bg-white border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow-lg rounded-[10px]
                            hover:bg-[#f7f7f7]'>
            <VscExport />
              <p className='ml-[5px] font-bold'>Export All Files</p>
            </button>
            <button className='flex justify-center items-center bg-primary text-white border-1 border-[#D3D3D3] px-[30px] mr-[1%] drop-shadow-lg rounded-[10px]
                            hover:bg-[#9c1c1c]'>
              <PiUploadLight />
              <p className='mx-[5px]'>Upload</p>
              <IoIosArrowDown />
            </button>
          </div>
        </div>
        <div className=''>
          <FileContainer tab={tab}/>
        </div>
      </div>
    </>
  )
}

export default FileManagerPage