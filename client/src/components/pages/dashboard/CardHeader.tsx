import React from 'react'

const CardHeader = ({ cardName }: { cardName: string }) => {
  return (
    <div className='bg-primary rounded-t-[10px] drop-shadow-lg'>
        <div className='flex items-center py-[10px] ml-[35px]'>
            <div className='bg-[#F67575] h-[25px] 2xl:h-[35px] w-[7px] rounded-[20px]'></div>
            <div className='bg-white h-[25px] 2xl:h-[35px] w-[7px] rounded-[20px]'></div>
            <p className='ml-[10px] font-bold text-[20px] 2xl:text-[28px] text-white'>{cardName}</p>
        </div>
    </div>
  )
}

export default CardHeader