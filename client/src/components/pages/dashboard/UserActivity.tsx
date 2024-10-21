import React from 'react'

enum ActionType {
    General = 'general',
    Crud = 'crud',
    Import = 'import',
    Export = 'export',
    Stock = 'stock'
  }

export type UserActivityProps = {
    url?: string | null;
    name: string;
    activity: ActionType;
    description: string,
    time: Date;
}

const UserActivity: React.FC<UserActivityProps> = ({ url, name, activity ,description , time }) => {
    const formattedTime = time.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    return (
        <div className='flex px-[20px] py-[18px] bg-[#FFFAF8]'>
            <div className='mr-[15px] flex justify-center'>
                <div
                    className='mt-[2px] size-[40px] rounded-full bg-cover bg-center'
                    style={{ backgroundImage: `url(${url})` }}
                />
            </div>
            <div>
                <h1 className='text-[18px] font-bold text-[#000000]'>{name}</h1>
                <p className='text-[13px] text-[#000000]'>{description} {activity}</p>
                <p className='text-[13px] text-[#9B9B9B]'>{formattedTime}</p>
            </div>
        </div>
    )
}

export default UserActivity