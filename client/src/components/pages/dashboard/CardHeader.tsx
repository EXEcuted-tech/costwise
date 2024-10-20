import { useSidebarContext } from '@/contexts/SidebarContext';
import React from 'react'

const CardHeader = ({ cardName }: { cardName: string }) => {
  const { isOpen } = useSidebarContext();
  
  return (
    <div className='bg-primary dark:bg-[#8B0000] rounded-t-[10px] drop-shadow-lg'>
        <div className='flex items-center py-[10px] ml-[35px]'>
            <div className='bg-[#F67575] h-[25px] 2xl:h-[35px] w-[7px] rounded-[20px]'></div>
            <div className='bg-white h-[25px] 2xl:h-[35px] w-[7px] rounded-[20px]'></div>
            <p className={`text-[20px] 2xl:text-[28px] ml-[10px] font-bold text-white`}>{cardName}</p>
        </div>
    </div>
  )
}

export default CardHeader