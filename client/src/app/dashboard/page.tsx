"use client"
import CustomCalendar from '@/components/calendar/CustomCalendar';
import CardHeader from '@/components/pages/dashboard/CardHeader';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { IoMdClock } from "react-icons/io";
import { MdDarkMode } from 'react-icons/md';
import { GiFactory, GiMoneyStack } from "react-icons/gi";
import { FaCircleArrowDown, FaCircleArrowUp, FaArrowTrendUp } from "react-icons/fa6";
import { PiPackageFill } from "react-icons/pi";
import LineChart from '@/components/pages/dashboard/LineChart';
import UserActivity, { UserActivityProps } from '@/components/pages/dashboard/UserActivity';
import CostTable from '@/components/pages/dashboard/CostTable';

const DashboardPage = () => {
  const { isOpen, isAdmin } = useSidebarContext();

  return (
    <div className={`${isOpen ? 'px-[10px] 2xl:px-[25px]' : 'px-[25px]'} bg-background mt-[30px] ml-[45px]`}>
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
          <div className={`${isOpen ? 'text-[1.2em] 2xl:text-[1.8em]' : 'text-[1.2em] 2xl:text-[1.5em] 3xl:text-[2.2em]'} text-primary p-3 drop-shadow-lg bg-white rounded-full cursor-pointer hover:text-white hover:bg-primary transition-colors duration-300 ease-in-out`}>
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

      <div className={`${isOpen ? 'gap-3' : 'gap-8'} flex-col 3xl:flex-row flex my-[30px] justify-between`}>
        <div className={`${isAdmin ? 'w-full 3xl:w-[70%]' : 'w-full'}`}>
          <CardHeader cardName='Projected Costing' />
          <div className='flex bg-white min-h-[347px] rounded-b-[10px] drop-shadow-lg px-[5px] 2xl:px-[20px]'>
              <LineChart className={`${isOpen ? 'w-full 3xl:w-[60%]' : 'w-full'} h-[347px]`} />
              <div className='flex justify-center mt-[30px] pr-[20px] w-full'>
                <CostTable className='h-[280px] w-full'/>
              </div>
          </div>
        </div>
        {isAdmin &&
          <div className='w-full 3xl:w-[30%]'>
            <CardHeader cardName='User Activity' />
            <div id="scroll-style" className='bg-white h-[347px] rounded-b-[10px] drop-shadow-lg overflow-y-auto py-[15px]'>
              {fakeData.map((data, index) => (
                <div key={index}>
                  <UserActivity url={data.url} name={data.name} activity={data.activity} time={data.time} />
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default DashboardPage

const fakeData: UserActivityProps[] = [
  { url: 'https://i.imgur.com/AZOtzD7.jpg', name: "Kathea Mari Mayol", activity: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", time: "2 minutes ago" },
  { url: 'https://i.imgur.com/SeymIUb.jpg', name: "John Doe", activity: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", time: "5 minutes ago" },
  { url: 'https://i.imgur.com/dm51tBF.jpg', name: "Jane Smith", activity: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", time: "10 minutes ago" },
  { url: 'https://i.imgur.com/AN69p1a.jpg', name: "Michael Johnson", activity: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.", time: "15 minutes ago" },
  { url: 'https://i.imgur.com/zb1h8kj.jpg', name: "Emily Davis", activity: "Excepteur sint occaecat cupidatat non proident, sunt in culpa.", time: "20 minutes ago" },
  { url: 'https://i.imgur.com/nzcwr8x.jpg', name: "Chris Lee", activity: "Mollit anim id est laborum.", time: "25 minutes ago" }
];
