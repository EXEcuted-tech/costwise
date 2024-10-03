import React, { useEffect, useState } from 'react'
import { RiFileFill } from "react-icons/ri";
import { useSidebarContext } from '@/contexts/SidebarContext';
import { File, FileSettings } from '@/types/data';

const FileLabel = (data: File) => {
  const { isOpen } = useSidebarContext();
  const [ settings, setSettings] = useState<FileSettings | null>(null);
  
  useEffect(()=>{
    if (data.settings) {
      const settings = JSON.parse(data.settings);
      setSettings(settings);
    }
  },[data])

  const formatMonthYear = (yyyymm: number | undefined): string => {
    if (yyyymm === undefined || yyyymm === null) {
      return 'Invalid Date';
    }

    if (!Number.isInteger(yyyymm)) {
      return 'Invalid Date';
    }

    const year = Math.floor(yyyymm / 100);
    const month = yyyymm % 100;

    if (month < 1 || month > 12) {
      return 'Invalid Date';
    }

    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName} ${year}`;
  };

  return (
    <div className='flex w-full px-[20px] py-[15px]'>
      <div className='flex justify-center items-center w-[50px] mr-[5px]'>
        <RiFileFill className='text-[50px] text-[#999999]' />
      </div>
      <div className='w-[50%]'>
        <h1 className='text-[20px] text-primary font-semibold'>{settings?.file_name}</h1>
        <p className='text-[#9F9F9F] text-[16px]'>{settings?.file_name_with_extension}</p>
      </div>
      <div className='w-[50%] text-right text-[18px]'>
        <p className='font-medium text-[#6D6D6D]'>For the month of <span className='italic font-bold text-[#787878]'>{formatMonthYear(settings?.monthYear)}</span></p>
        <p className='font-medium text-[#6D6D6D]'>Imported by <span className='italic font-bold text-[#787878]'>{settings?.user}</span></p>
      </div>
    </div>
  )
}

export default FileLabel