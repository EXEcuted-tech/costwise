"use client"
import CardHeader from '@/components/pages/dashboard/CardHeader';
import { useSidebarContext } from '@/context/SidebarContext';
import React from 'react'
import { MdDarkMode } from 'react-icons/md';
import { Calendar } from "@nextui-org/calendar";

const DashboardPage = () => {
  const { isOpen, isAdmin } = useSidebarContext();

  return (
    <div className='bg-background px-[25px] mt-[30px] ml-[45px]'>
      <div className='flex justify-between'>
        <div className='flex flex-col flex-wrap w-[72%] 4xl:w-[75%]'>
          <h1 className={`${isOpen ? 'text-[34px] 2xl:text-[42px] 3xl:text-[52px] 4xl:text-[58px]' : 'text-[40px] 2xl:text-[55px] 3xl:text-[68px]'} text-[#414141] font-bold`}>Good Evening, Kathea Mari!</h1>
          <p className={`${isOpen ? 'text-[16px] 2xl:text-[18px] 3xl:text-[22px]' : 'text-[18px] 2xl:text-[20px] 3xl:text-[28px]'} font-medium text-[#868686]`}>Welcome to CostWise: Virginia’s Product Costing System!</p>
        </div>
        <div className='w-[27%] 4xl:w-[20%] flex flex-col justify-center'>
          <h2 className={`${isOpen ? 'text-[18px] 2xl:text-[24px]' : 'text-[19px] 2xl:text-[25px] 3xl:text-[30px]'} text-[#414141] font-bold text-right`}>September 4, 2024</h2>
          <p className={`${isOpen ? 'text-[14px] 2xl:text-[16px]' : 'text-[16px] 3xl:text-[21px]'} text-[#414141] italic text-right`}>11:05 A.M.</p>
        </div>
        <div>
          <div className={`${isOpen ? 'text-[1.2em] 2xl:text-[1.8em]' : 'text-[1.2em] 2xl:text-[1.5em] 3xl:text-[2.2em]'} text-primary p-3 drop-shadow-lg bg-white rounded-full`}>
            <MdDarkMode className='cursor-pointer' />
          </div>
        </div>
      </div>

      <div className='my-[30px] flex justify-between gap-8'>
        <div className='w-[50%]'>
          <CardHeader cardName='Analytics Overview' />
          <div className='bg-white h-[300px] rounded-b-[10px] drop-shadow-lg'>

          </div>
        </div>
        <div className='w-[50%]'>
          <Calendar className='w-full h-[360px]' aria-label="Date (Uncontrolled)" />
        </div>
      </div>

      <div className='my-[30px] flex justify-between gap-8'>
        <div className='w-[70%]'>
          <CardHeader cardName='Projected Costing' />
          <div className='bg-white h-[300px] rounded-b-[10px] drop-shadow-lg'>

          </div>
        </div>
        {isAdmin &&
          <div className='w-[30%]'>
            <CardHeader cardName='User Activity' />
            <div className='bg-white h-[300px] rounded-b-[10px] drop-shadow-lg'>

            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default DashboardPage