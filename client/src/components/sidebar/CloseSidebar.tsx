"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/virginia-logo.png';
import { iconMap } from '@/utils/iconMap';
import { Tooltip } from "@nextui-org/react";
import usePath from '@/hooks/usePath';
import MiniSidebar from './MiniSidebar';
import Link from 'next/link';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import api from '@/utils/api';
import config from '@/server/config';
import { removeTokens } from '@/utils/removeTokens';
import { useNotificationContext } from '@/contexts/NotificationContext';

interface IconClosedConfig {
  iconName: string;
  className?: string;
  tooltip?: string;
  route?: string;
  routes?: string[];
}

const CloseSidebar: React.FC = () => {
  const { isAdmin } = useSidebarContext();
  const [isMore, setIsMore] = useState(false);
  const path = usePath();
  const router = useRouter();
  const { currentUser } = useUserContext();
  const { hasNewNotifications } = useNotificationContext();

  const handleLogout = async () => {
    await removeTokens();
    router.push('/logout');
  }
  
  return (
    <>
      <div className='flex justify-center w-full bg-primary min-h-screen'>
        <div className='relative top-0'>
          {/* Logo */}
          <div className={`${path == 'profile' ? 'mt-[25px] mb-[5px]' : 'my-[25px]'} flex justify-center`}>
            <Image src={logo} alt={'Virginia Logo'} className='w-[90px] h-auto' />
          </div>

          {/* Account Profile */}
          <div className={`${path == 'profile' && 'bg-[#CD3939] w-[128px] h-[100px] items-center mb-0'} flex justify-center mb-[10px]`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* @TODO: Display Profile Pictures Properly */}
            <img
              src={currentUser?.displayPicture ?? "https://i.imgur.com/AZOtzD7.jpg"}
              alt={'Profile Picture'}
              className='flex object-cover w-[80px] h-[80px] rounded-full border cursor-pointer'
              onClick={() => { router.push('/profile') }}
            />
          </div>

          {/* Pages */}
          <div className='mx-auto h-auto'>
            <ul className='flex flex-col justify-center items-center text-white'>
              {mainMenu.map(({ iconName, className, tooltip, route }, index) => {
                const IconComponent = iconMap[iconName];
                return (
                  <Tooltip
                    key={index}
                    content={tooltip}
                    placement={"right"}
                    classNames={{
                      base: [
                        "before:bg-[#FFD3D3]",
                      ],
                      content: [
                        "py-2 px-4 shadow-xl",
                        "font-lato text-primary text-[20px] font-bold bg-[#FFD3D3] from-white to-neutral-400",
                      ],
                    }}
                  >
                    <Link href={`/${route}`}>
                      <li key={index} className={`hover:animate-shrink-in cursor-pointer ${path === route ?
                        'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                        'my-[15px] hover:text-[#FFD3D3] '}`}>
                        <IconComponent className={className} />
                      </li>
                    </Link>
                  </Tooltip>
                );
              })}
            </ul>
          </div>
          <hr className='mx-[15px] my-[15px]' />
          {/* Others */}
          <div className='bg-primary'>
            <ul className='flex flex-col justify-center items-center text-white'>
              {!isAdmin
                ?
                (userDefaultMenu.map(({ iconName, className, tooltip, route }, index) => {
                  if(iconName === 'FaBell' && hasNewNotifications){
                    iconName = 'MdNotificationsActive';
                  }
                  const IconComponent = iconMap[iconName];
                  return (
                    <Tooltip
                      key={index}
                      content={tooltip}
                      placement={"right"}
                      classNames={{
                        base: [
                          "before:bg-[#FFD3D3]",
                        ],
                        content: [
                          "py-2 px-4 shadow-xl",
                          "font-lato text-primary text-[20px] font-bold bg-[#FFD3D3] from-white to-neutral-400",
                        ],
                      }}
                    >
                      {tooltip == 'Log Out' ?
                        < li
                          key={index}
                          onClick={handleLogout}
                          className={`hover:animate-shrink-in cursor-pointer my-[12px] hover:text-[#FFD3D3]`}
                        >
                          <IconComponent className={className} />
                        </li>
                        :
                        <Link href={`/${route}`}>
                          <li key={index} className={`hover:animate-shrink-in cursor-pointer ${path === route ?
                            'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                            'my-[13px] hover:text-[#FFD3D3]'}`}>
                            <IconComponent className={`${iconName === 'MdNotificationsActive' && hasNewNotifications && 'animate-shake-infinte'} ${className}`} />
                          </li>
                        </Link>
                      }
                    </Tooltip>
                  );
                }))
                :
                (adminDefaultMenu.map(({ iconName, className, tooltip, route, routes }, index) => {
                  if(iconName === 'FaBell' && hasNewNotifications){
                    iconName = 'MdNotificationsActive';
                  }
                  const IconComponent = iconMap[iconName];
                  const isRoute = routes?.some(e => e === path);
                  return tooltip !== 'More' ? (
                    <Tooltip
                      content={tooltip}
                      placement={"right"}
                      classNames={{
                        base: [
                          "before:bg-[#FFD3D3]",
                        ],
                        content: [
                          "py-2 px-4 shadow-xl",
                          "font-lato text-primary text-[20px] font-bold bg-[#FFD3D3] from-white to-neutral-400",
                        ],
                      }}
                    >
                      {tooltip == 'Log Out' ?
                        < li
                          key={index}
                          onClick={handleLogout}
                          className={`hover:animate-shrink-in cursor-pointer my-[12px] hover:text-[#FFD3D3]`}
                        >
                          <IconComponent className={className} />
                        </li>
                        :
                        <Link href={`/${route}`}>
                          <li key={index} className={`hover:animate-shrink-in cursor-pointer ${path === route ?
                            'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                            'my-[13px] hover:text-[#FFD3D3]'}`}>
                            <IconComponent className={`${iconName === 'MdNotificationsActive' && hasNewNotifications && 'animate-shake-infinte'} ${className}`} />
                          </li>
                        </Link>
                      }
                    </Tooltip>
                  )
                    :
                    (
                      <li key={index} className={`hover:animate-shrink-in cursor-pointer ${isRoute ?
                        'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                        'my-[12px] hover:text-[#FFD3D3]'}`}
                        onMouseEnter={() => setIsMore(true)}>
                        <IconComponent className={className} />
                      </li>
                    )
                }))
              }
            </ul>
          </div>
        </div>
      </div >
      {isMore && <MiniSidebar setIsMore={setIsMore} />
      }
    </>
  );
};

export default CloseSidebar;

const mainMenu: IconClosedConfig[] = [
  { iconName: 'RiDashboard2Fill', route: 'dashboard', tooltip: 'Dashboard', className: 'text-[2.8em]' },
  { iconName: 'BsFillFolderFill', route: 'file-manager', tooltip: 'File Manager', className: 'text-[2.3em]' },
  { iconName: 'RiFormula', route: 'formulation', tooltip: 'Formulations', className: 'text-[2.3em]' },
  { iconName: 'BiSolidReport', route: 'cost-calculation', tooltip: 'Cost Calculation', className: 'text-[2.8em]' },
  { iconName: 'GiMoneyStack', route: 'projected-costing', tooltip: 'Projected Costing', className: 'text-[2.8em]' },
  { iconName: 'MdOutlineInventory', route: 'inventory', tooltip: 'Inventory', className: 'text-[2.8em]' },
  { iconName: 'GoHistory', route: 'audit-log', tooltip: 'Audit Log', className: 'text-[2.8em]' },
];

const userDefaultMenu: IconClosedConfig[] = [
  { iconName: 'FaBell', route: 'notification', tooltip: 'Notifications', className: 'text-[2.3em]' },
  { iconName: 'MdOutlineQuestionMark', route: 'help', tooltip: 'Help', className: 'text-[2.8em] mr-[5px]' },
  { iconName: 'MdLogout', route: 'logout', tooltip: 'Log Out', className: 'text-[2.3em]' },
];

const adminDefaultMenu: IconClosedConfig[] = [
  { iconName: 'FaBell', route: 'notification', tooltip: 'Notifications', className: 'text-[2.3em]' },
  { iconName: 'MdMoreHoriz', routes: ["help", "maintenance", "user-management"], tooltip: 'More', className: 'text-[2.8em]' },
  { iconName: 'MdLogout', route: 'logout', tooltip: 'Log Out', className: 'text-[2.3em]' },
];

