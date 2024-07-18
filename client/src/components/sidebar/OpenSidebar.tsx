"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/virginia-logo.png';
import { iconMap } from '@/utils/iconMap';
import usePath from '@/hooks/usePath';
import MiniSidebar from './MiniSidebar';

export interface IconOpenConfig {
  iconName: string;
  menuName: string;
  className?: string;
  route?: string;
}
const OpenSidebar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const path = usePath();

  return (
    <>
      <div className='flex justify-center bg-primary min-h-screen w-full h-full'>
        <div className='relative top-0'>
          {/* Logo */}
          <div className='flex justify-center my-[25px]'>
            <Image src={logo} alt={'Virginia Logo'} className='w-[90px] h-auto' />
          </div>

          {/* Account Profile */}
          <div className='flex justify-center mb-[10px]'>
            <img
              src="https://i.imgur.com/AZOtzD7.jpg"
              alt={'Profile Picture'}
              className='flex object-cover w-[80px] h-[80px] rounded-full border cursor-pointer'
            />
          </div>

          {/* Pages */}
          <div className='mx-auto h-auto'>
            <ul className='flex flex-col justify-center items-center text-white'>
              {mainMenu.map(({ iconName, className, menuName, route }, index) => {
                const IconComponent = iconMap[iconName];
                return (
                    <li key={index} className={`hover:animate-shrink-in hover:text-[#FFD3D3] cursor-pointer ${path === route ?
                      'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                      'my-[15px]'}`}>
                      <IconComponent className={className} />
                    </li>
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
                (userDefaultMenu.map(({ iconName, className, menuName, route }, index) => {
                  const IconComponent = iconMap[iconName];
                  return (
                      <li key={index} className={`hover:animate-shrink-in hover:text-[#FFD3D3] cursor-pointer ${path === route ?
                        'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                        'my-[13px]'}`}>
                        <IconComponent className={className} />
                      </li>
                  );
                }))
                :
                (adminDefaultMenu.map(({ iconName, className, menuName, route }, index) => {
                  const IconComponent = iconMap[iconName];
                  return menuName !== 'More' ? (
                      <li key={index} className={`hover:animate-shrink-in hover:text-[#FFD3D3] cursor-pointer ${path === route ?
                        'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                        'my-[12px]'}`}>
                        <IconComponent className={className} />
                      </li>
                  )
                    :
                    (
                      <li key={index} className={`hover:animate-shrink-in hover:text-[#FFD3D3] cursor-pointer ${path === route ?
                        'bg-[#FFD3D3] text-primary px-[20px] py-[5px] my-[8px] rounded-[20px]' :
                        'my-[12px]'}`}
                        onMouseEnter={() => setIsMore(true)}>
                        <IconComponent className={className} />
                      </li>
                    )
                }))
              }
            </ul>
          </div>
        </div>
      </div>
      {isMore && <MiniSidebar setIsMore={setIsMore}/>}
    </>
  );
};

export default OpenSidebar;

const mainMenu: IconOpenConfig[] = [
  { iconName: 'RiDashboard2Fill', route: 'dashboard', menuName: 'Dashboard', className: 'text-[2.8em]' },
  { iconName: 'BsFillFolderFill', menuName: 'File Manager', className: 'text-[2.3em]' },
  { iconName: 'RiFormula', menuName: 'Formulations', className: 'text-[2.3em]' },
  { iconName: 'BiSolidReport', menuName: 'Report Generation', className: 'text-[2.8em]' },
  { iconName: 'GiMoneyStack', menuName: 'Projected Costing', className: 'text-[2.8em]' },
  { iconName: 'MdOutlineInventory', menuName: 'Inventory', className: 'text-[2.8em]' },
  { iconName: 'GoHistory', menuName: 'Audit Log', className: 'text-[2.8em]' },
];

const userDefaultMenu: IconOpenConfig[] = [
  { iconName: 'FaBell', menuName: 'Notifications', className: 'text-[2.3em]' },
  { iconName: 'MdOutlineQuestionMark', menuName: 'Help', className: 'text-[2.8em] mr-[5px]' },
  { iconName: 'MdLogout', menuName: 'Log Out', className: 'text-[2.3em]' },
];

const adminDefaultMenu: IconOpenConfig[] = [
  { iconName: 'FaBell', menuName: 'Notifications', className: 'text-[2.3em]' },
  { iconName: 'MdMoreHoriz', menuName: 'More', className: 'text-[2.8em]' },
  { iconName: 'MdLogout', menuName: 'Log Out', className: 'text-[2.3em]' },
];