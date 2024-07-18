"use client"
import React, { useState } from 'react'
import CloseSidebar from '../sidebar/CloseSidebar'
import Image from 'next/image';
import hotdog from '@/assets/hotdog.png';
import OpenSidebar from '../sidebar/OpenSidebar';

function UserLayout() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='flex'>
      <div
        className={`flex transition-all duration-400 ease-in-out ${isOpen ? 'w-[390px]' : 'w-[120px]'} overflow-hidden`}
      >
        {isOpen ? <OpenSidebar /> : <CloseSidebar />}
      </div>
      <div className='bg-[#DD8383] flex flex-col justify-center my-[20%] h-[125px] w-[45px] rounded-r-3xl hover:w-[55px] cursor-pointer transition-all duration-300 ease-in-out'
          onClick={()=>setIsOpen(!isOpen)}>
        <div className='flex justify-center items-center'>
          <Image src={hotdog} alt={'Hotdog Icon'} className='w-[35px] h-auto object-cover' />
        </div>
      </div>
    </div>
  )
}

export default UserLayout