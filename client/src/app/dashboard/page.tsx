"use client"
import CustomCalendar from '@/components/calendar/CustomCalendar';
import CardHeader from '@/components/pages/dashboard/CardHeader';
import { useSidebarContext } from '@/context/SidebarContext';
import { IoMdClock } from "react-icons/io";
import { MdDarkMode } from 'react-icons/md';
import { GiFactory, GiMoneyStack } from "react-icons/gi";
import { FaCircleArrowDown, FaCircleArrowUp, FaArrowTrendUp } from "react-icons/fa6";
import { PiPackageFill } from "react-icons/pi";
import LineChart from '@/components/pages/dashboard/LineChart';

const DashboardPage = () => {
  const { isOpen, isAdmin } = useSidebarContext();

  return (
    <div className='bg-background px-[25px] mt-[30px] ml-[45px]'>
      <div className='flex justify-between'>
        <div className='flex flex-col flex-wrap w-[72%] 4xl:w-[75%]'>
          <h1 className={`${isOpen ? 'text-[34px] 2xl:text-[42px] 3xl:text-[52px] 4xl:text-[58px]' : 'text-[40px] 2xl:text-[55px] 3xl:text-[68px]'} truncate text-ellipsis text-[#414141] font-bold animate-color-pulse`}>
            Good Evening, <span className='animate-color-pulse2'>Kathea Mari!</span>
          </h1>
          <p className={`${isOpen ? 'text-[16px] 2xl:text-[18px] 3xl:text-[22px]' : 'text-[18px] 2xl:text-[20px] 3xl:text-[28px]'} font-medium text-[#868686]`}>Welcome to CostWise: Virginia’s Product Costing System!</p>
        </div>
        <div className='w-[27%] 4xl:w-[20%] flex flex-col justify-center mr-[5px]'>
          <h2 className={`${isOpen ? 'text-[18px] 2xl:text-[24px]' : 'text-[19px] 2xl:text-[25px] 3xl:text-[30px]'} text-[#414141] font-bold text-right`}>September 4, 2024</h2>
          <p className={`${isOpen ? 'text-[14px] 2xl:text-[16px]' : 'text-[16px] 3xl:text-[21px]'} text-[#414141] italic text-right`}>11:05 A.M.</p>
        </div>
        <div>
          <div className={`${isOpen ? 'text-[1.2em] 2xl:text-[1.8em]' : 'text-[1.2em] 2xl:text-[1.5em] 3xl:text-[2.2em]'} text-primary p-3 drop-shadow-lg bg-white rounded-full cursor-pointer hover:brightness-95`}>
            <MdDarkMode />
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'gap-3' : 'gap-8'} my-[30px] flex justify-between`}>
        <div className='w-[70%]'>
          <CardHeader cardName='Analytics Overview' />
          <div className={`${isOpen ? 'min-h-[316px]' : 'min-h-[304px]'} bg-white rounded-b-[10px] drop-shadow-lg px-[40px] py-[20px]`}>
            <div className='flex items-center'>
              <IoMdClock className='text-[25px] 2xl:text-[28px] 3xl:text-[32px] text-[#C6C6C6] mr-[5px]' />
              <h2 className='text-[#C6C6C6] font-light text-[20px]'>Last Update: <span className='italic'>2:15 AM</span></h2>
            </div>
            <div className='my-[30px] 3xl:my-[20px] flex justify-between'>
              <div className='w-[20%] flex flex-col items-center'>
                <div className='animate-border-pulse w-24 h-24 flex p-4 justify-center items-center rounded-full border border-primary bg-white drop-shadow-lg relative'>
                  <GiFactory className='text-primary text-[68px] hover:animate-shake-tilt' />
                </div>
                <div>
                  <div className='flex items-center mr-[-20px] justify-end'>
                    <FaCircleArrowDown className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#CD3939] mr-[5px] ' />
                    <p className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#CD3939] font-semibold'>-40%</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <h1 className='text-[16px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary'>₱10,200,000</h1>
                    <p className='italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]'>Total Production Cost</p>
                  </div>
                </div>
              </div>
              <div className='w-[20%] flex flex-col items-center'>
                <div className='animate-border-pulse w-24 h-24 flex p-4 justify-center items-center rounded-full border border-primary bg-white drop-shadow-lg relative'>
                  <PiPackageFill className='text-primary text-[68px] hover:animate-shake-tilt' />
                </div>
                <div>
                  <div className='flex items-center mr-[-20px] justify-end'>
                    <FaCircleArrowDown className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#CD3939] mr-[5px]' />
                    <p className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#CD3939] font-semibold'>-23%</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <h1 className='text-[16px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary'>₱35.50</h1>
                    <p className='italic text-center font-medium text-[12px] 3xl:text-[14px] text-[#969696]'>Average Cost Per Product</p>
                  </div>
                </div>
              </div>
              <div className='w-[20%] flex flex-col items-center'>
                <div className='animate-border-pulse2 w-24 h-24 flex p-4 justify-center items-center rounded-full border-2 border-white bg-primary drop-shadow-lg relative'>
                  <FaArrowTrendUp className='text-white text-[68px] hover:animate-shake-tilt' />
                </div>
                <div>
                  <div className='flex items-center mr-[-20px] justify-end'>
                    <FaCircleArrowUp className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] mr-[5px]' />
                    <p className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] font-semibold'>+50%</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <h1 className='text-[16px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary'>5%</h1>
                    <p className='italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]'>Recent Cost Trend</p>
                  </div>
                </div>
              </div>
              <div className='w-[20%] flex flex-col items-center'>
                <div className='animate-border-pulse2 w-24 h-24 flex p-4 justify-center items-center rounded-full border-2 border-white bg-primary drop-shadow-lg relative'>
                  <GiMoneyStack className='text-white text-[68px] hover:animate-shake-tilt' />
                </div>
                <div>
                  <div className='flex items-center mr-[-20px] justify-end'>
                    <FaCircleArrowUp className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] mr-[5px]' />
                    <p className='text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] font-semibold'>0%</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <h1 className='text-[16px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary'>₱50,000</h1>
                    <p className='italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]'>Budget Variance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-[30%]'>
          <CustomCalendar className={`${isOpen ? 'min-h-[366px] 2xl:min-h-[378px]' : 'min-h-[355px] 2xl:min-h-[366px]'} w-full`} />
        </div>
      </div>

      <div className='my-[30px] flex justify-between gap-8'>
        <div className={`${isAdmin ? 'w-[70%]' : 'w-full'}`}>
          <CardHeader cardName='Projected Costing' />
          <div className='bg-white min-h-[347px] rounded-b-[10px] drop-shadow-lg'>
            <LineChart />
          </div>
        </div>
        {isAdmin &&
          <div className='w-[30%]'>
            <CardHeader cardName='User Activity' />
            <div className='bg-white min-h-[347px] rounded-b-[10px] drop-shadow-lg overflow-y-auto'>
              <div className='flex items-center'>
                <div>
                  <img
                    src="https://i.imgur.com/AZOtzD7.jpg"
                    alt={'Profile Picture'}
                    className='flex object-cover size-[50px] rounded-full'
                  />
                </div>
                <div>
                  <h1>Kathea Mari Mayol</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <p>2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default DashboardPage