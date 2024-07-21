"use client"
import Header from '@/components/header/Header';
import FileTable from '@/components/pages/file-manager/FileTable'
import FileTabs from '@/components/pages/file-manager/FileTabs';
import React, { useState } from 'react'
import { BsFolderFill } from "react-icons/bs";

const FileManagerPage = () => {
  const [tab, setTab] = useState('all');

  return (
    <>
      <Header icon={BsFolderFill} title={"File Manager"} />
      <div className='ml-[45px] mt-[25px] px-[50px]'>
        <div className='flex'>
          <div className='w-[60%]'>
            <FileTabs tab={tab} setTab={setTab}/>
          </div>
          <div>
          
          </div>
        </div>
        <div className=''>
          <FileTable tab={tab}/>
        </div>
      </div>
    </>
  )
}

export default FileManagerPage