import config from '@/server/config';
import React from 'react'
import { FaUser } from 'react-icons/fa6';

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
    formattedTime: string;
}

const UserActivity: React.FC<UserActivityProps> = ({ url, name, activity, description, formattedTime }) => {
    // const formattedTime = time.toLocaleString('en-US', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     hour12: true,
    //   });
    const getProfilePictureUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        return `${config.API}/storage/${path}`;
    };

    return (
        <div className='flex px-[20px] py-[18px] bg-white dark:bg-[#3C3C3C]'>
            <div className='mr-[15px] flex justify-center'>
                {url != null ? (
                    <div
                        className='flex justify-center items-center size-[40px] rounded-full border border-white overflow-hidden'
                    >
                        <div
                            className="w-full h-full object-cover"
                            style={{
                                backgroundImage: `url(${getProfilePictureUrl(url) || '/default-profile.png'})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover'
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className='flex justify-center items-center size-[40px] rounded-full border border-white bg-gray-200'
                    >
                        <FaUser className='text-gray-500 text-xl' />
                    </div>
                )}
            </div>
            <div>
                <h1 className='text-[18px] font-bold text-[#000000] dark:text-gray-200'>{name}</h1>
                <p className='text-[13px] text-[#000000] dark:text-gray-200'>{description} {activity}</p>
                <p className='text-[13px] text-[#9B9B9B]'>{formattedTime}</p>
            </div>
        </div>
    )
}

export default UserActivity