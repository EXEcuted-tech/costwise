"use client"
import React, { useState } from 'react'
import CloseSidebar from '../sidebar/CloseSidebar'
import Image from 'next/image';
import hotdog from '@/assets/hotdog.png';
import OpenSidebar from '../sidebar/OpenSidebar';
import { useSidebarContext } from '@/context/SidebarContext';

const MainLayout = () => {
  const { isOpen, setIsOpen } = useSidebarContext();

  return (
    <div className='flex !font-lato'>
      <div
        className={`fixed flex transition-all duration-400 ease-in-out ${isOpen ? 'w-[280px] 2xl:w-[360px]' : 'w-[120px]'} overflow-hidden`}
      >
        {isOpen ? <OpenSidebar /> : <CloseSidebar />}
      </div>
      <div className={`fixed  ${isOpen ? 'left-[280px] 2xl:left-[360px]' : 'left-[120px]'} top-[400px] bg-[#DD8383] flex flex-col justify-center h-[125px] w-[45px] rounded-r-3xl hover:w-[55px] cursor-pointer transition-all duration-400 ease-in-out`}
        onClick={() => setIsOpen(!isOpen)}>
        <div className='flex justify-center items-center'>
          <Image src={hotdog} alt={'Hotdog Icon'} className='w-[35px] h-auto object-cover' />
        </div>
      </div>
    </div>
  )
}

export default MainLayout