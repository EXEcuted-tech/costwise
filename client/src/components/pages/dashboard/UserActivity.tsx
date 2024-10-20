import React from 'react'

export type UserActivityProps = {
    url: string;
    name: string;
    activity: string;
    time: string;
}

const UserActivity: React.FC<UserActivityProps> = ({ url, name, activity, time }) => {
    return (
        <div className='flex px-[20px] py-[18px] bg-[#FFFAF8] dark:bg-[#3C3C3C]'>
            <div className='mr-[15px] flex justify-center'>
                <div
                    className='mt-[2px] size-[40px] rounded-full bg-cover bg-center'
                    style={{ backgroundImage: `url(${url})` }}
                />
            </div>
            <div>
                <h1 className='text-[18px] font-bold text-[#000000] dark:text-gray-200'>{name}</h1>
                <p className='text-[13px] text-[#000000] dark:text-gray-200'>{activity}</p>
                <p className='text-[13px] text-[#9B9B9B]'>{time}</p>
            </div>
        </div>
    )
}

export default UserActivity