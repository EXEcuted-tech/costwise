"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/virginia-logo.png';
import { iconMap } from '@/utils/iconMap';
import usePath from '@/hooks/usePath';
import MiniSidebar from './MiniSidebar';
import Link from 'next/link';

export interface IconOpenConfig {
  iconName: string;
  menuName: string;
  className?: string;
  route?: string;
  routes?: string[];
}
const OpenSidebar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isMore, setIsMore] = useState(false);
  const path = usePath();

  return (
    <>
      <div className='font-lato flex justify-start bg-primary min-h-screen w-[360px] h-full'>
        <div className='animate-crop-left-to-right relative top-0'>
          {/* Logo */}
          <div className='flex items-end my-[20px] px-[40px]'>
            <Image src={logo} alt={'Virginia Logo'} className='w-[90px] h-auto mr-[10px]' />
            <p className='font-bold italic text-white text-[22px] mb-[5px]'>Virginia Food, Inc.</p>
          </div>

          {/* Account Profile */}
          <div className='w-[360px] flex items-center bg-[#CD3939] mb-[15px] px-[40px] py-[15px]'>
            <img
              src="https://i.imgur.com/AZOtzD7.jpg"
              alt={'Profile Picture'}
              className='flex object-cover w-[80px] h-[80px] rounded-full border cursor-pointer'
            />
            <div className='text-white ml-[15px] mt-[-8px]'>
              <h1 className='font-extrabold text-[28px]'>Kathea Mari</h1>
              <p className='font-light text-[20px] mt-[-8px] cursor-pointer hover:text-[#dbdbdb]'>My Account</p>
            </div>
          </div>

          {/* Pages */}
          <div className='animate-crop-left-to-right mx-auto h-auto'>
            <ul className='flex flex-col text-white'>
              {mainMenu.map(({ iconName, className, menuName, route }, index) => {
                const IconComponent = iconMap[iconName];
                return (
                  <Link href={`/${route}`}>
                    <li
                      key={index}
                      className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                        ? 'w-[86%] text-primary bg-[#FFD3D3] ml-[25px] pr-[20px] pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                        : 'my-[12px] hover:text-[#FFD3D3] px-[40px]'
                        }`}
                    >
                      <IconComponent className={`${className} justify-center`} />
                      <p className='font-lato text-[25px]'>{menuName}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <hr className='my-[15px] mx-[30px]' />
          {/* Others */}
          <div className='bg-primary'>
            <ul className='flex flex-col text-white'>
              {!isAdmin
                ?
                (userDefaultMenu.map(({ iconName, className, menuName, route }, index) => {
                  const IconComponent = iconMap[iconName];
                  return (
                    <Link href={`/${route}`}>
                      <li
                        key={index}
                        className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                          ? 'w-[88%] text-primary bg-[#FFD3D3] ml-[25px] pr-[20px] pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                          : 'my-[11px] hover:text-[#FFD3D3] px-[40px]'
                          }`}
                      >
                        <IconComponent className={`${className} justify-center`} />
                        <p className='font-lato ml-[8px] text-[25px]'>{menuName}</p>
                      </li>
                    </Link>
                  );
                }))
                :
                (adminDefaultMenu.map(({ iconName, className, menuName, route, routes }, index) => {
                  const IconComponent = iconMap[iconName];
                  const isRoute = routes?.some(e => e === path);
                  return menuName !== 'More' ? (
                    <Link href={`/${route}`}>
                      <li
                        key={index}
                        className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                          ? 'w-[88%] text-primary bg-[#FFD3D3] ml-[25px] pr-[20px] pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                          : 'my-[11px] hover:text-[#FFD3D3] px-[40px]'
                          }`}
                      >
                        <IconComponent className={`${className} justify-center`} />
                        <p className='font-lato ml-[8px] text-[25px]'>{menuName}</p>
                      </li>
                    </Link>
                  )
                    :
                    (
                        <li
                          key={index}
                          className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${isRoute
                            ? 'w-[88%] text-primary bg-[#FFD3D3] ml-[25px] pr-[20px] pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                            : 'my-[11px] hover:text-[#FFD3D3] px-[40px]'
                            }`}
                          onMouseEnter={() => setIsMore(true)}>
                          <IconComponent className={`${className} justify-center`} />
                          <p className='font-lato ml-[8px] text-[25px]'>{menuName}</p>
                        </li>
                    )
                }))
              }
            </ul>
          </div>
        </div>
      </div>
      {isMore && <MiniSidebar setIsMore={setIsMore} isAdmin={isAdmin} />}
    </>
  );
};

export default OpenSidebar;

const mainMenu: IconOpenConfig[] = [
  { iconName: 'RiDashboard2Fill', route: 'dashboard', menuName: 'Dashboard', className: 'text-[2.8em]' },
  { iconName: 'BsFillFolderFill', route: 'file-manager', menuName: 'File Manager', className: 'text-[2.8em]' },
  { iconName: 'RiFormula', route: 'formulation', menuName: 'Formulations', className: 'text-[2.8em]' },
  { iconName: 'BiSolidReport', route: 'report-generation', menuName: 'Report Generation', className: 'text-[2.8em]' },
  { iconName: 'GiMoneyStack', route: 'projected-costing', menuName: 'Projected Costing', className: 'text-[2.8em]' },
  { iconName: 'MdOutlineInventory', route: 'inventory', menuName: 'Inventory', className: 'text-[2.8em]' },
  { iconName: 'GoHistory', route: 'audit-log', menuName: 'Audit Log', className: 'text-[2.8em]' },
];

const userDefaultMenu: IconOpenConfig[] = [
  { iconName: 'FaBell', route: 'notification', menuName: 'Notifications', className: 'text-[2.3em]' },
  { iconName: 'MdOutlineQuestionMark', route: 'help', menuName: 'Help', className: 'text-[2.3em]' },
  { iconName: 'MdLogout', route: 'logout', menuName: 'Log Out', className: 'text-[2.3em] pl-[3px]' },
];

const adminDefaultMenu: IconOpenConfig[] = [
  { iconName: 'FaBell', route: 'notification', menuName: 'Notifications', className: 'text-[2.3em]' },
  { iconName: 'MdMoreHoriz', routes: ["help", "maintenance", "user-management"], menuName: 'More', className: 'text-[2.3em]' },
  { iconName: 'MdLogout', route: 'logout', menuName: 'Log Out', className: 'text-[2.3em]' },
];