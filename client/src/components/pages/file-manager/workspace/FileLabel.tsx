import React, { useEffect, useState } from 'react'
import { RiFileFill } from "react-icons/ri";
import { useSidebarContext } from '@/contexts/SidebarContext';
import { File, FileSettings } from '@/types/data';
import { formatMonthYear } from '@/utils/costwiseUtils';

const FileLabel = (data: File) => {
  const { isOpen } = useSidebarContext();
  const [ settings, setSettings] = useState<FileSettings | null>(null);
  
  useEffect(()=>{
    if (data.settings) {
      const settings = JSON.parse(data.settings);
      setSettings(settings);
    }
  },[data])



  return (
    <div className='flex w-full px-[20px] py-[15px]'>
      <div className='flex justify-center items-center w-[50px] mr-[5px]'>
        <RiFileFill className='text-[50px] text-[#999999] dark:text-white' />
      </div>
      <div className='w-[50%]'>
        <h1 className='text-[20px] text-primary font-semibold dark:text-[#ff5252]'>{settings?.file_name}</h1>
        <p className='text-[#9F9F9F] text-[16px] dark:text-[#d1d1d1]'>{settings?.file_name_with_extension}</p>
      </div>
      <div className='w-[50%] text-right text-[18px]'>
        <p className='font-medium text-[#6D6D6D] dark:text-[#d1d1d1]'>For the month of <span className='italic font-bold text-[#787878] dark:text-white'>{formatMonthYear(settings?.monthYear)}</span></p>
        <p className='font-medium text-[#6D6D6D] dark:text-[#d1d1d1]'>Imported by <span className='italic font-bold text-[#787878] dark:text-white'>{settings?.user}</span></p>
      </div>
    </div>
  )
}

export default FileLabel