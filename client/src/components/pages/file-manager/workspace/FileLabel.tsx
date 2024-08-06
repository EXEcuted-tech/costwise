import React from 'react'
import { RiFileFill } from "react-icons/ri";
import { FileTableProps } from '../FileContainer';

const FileLabel = (data: FileTableProps) => {
  return (
    <div className='flex w-full px-[20px] py-[15px]'>
      <div className='flex justify-center items-center w-[50px] mr-[5px]'>
        <RiFileFill className='text-[50px] text-[#999999]' />
      </div>
      <div className='w-[70%]'>
        <h1 className='text-[20px] text-primary font-semibold'>{data.fileLabel}</h1>
        <p className='text-[#9F9F9F] text-[16px]'>{data.fileName}</p>
      </div>
      <div className='w-[26%] text-right text-[18px]'>
        {/* change dynamically */}
        <p className='font-medium text-[#6D6D6D]'>For the month of <span className='italic font-bold text-[#787878]'>January 2024</span></p>
        <p className='font-medium text-[#6D6D6D]'>Imported by <span className='italic font-bold text-[#787878]'>{data.addedBy}</span></p>
      </div>
    </div>
  )
}

export default FileLabel