"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/virginia-logo.png';
import { iconMap } from '@/utils/iconMap';

interface IconConfig {
  iconName: string;
  className?: string;
  route?: string;
}

const mainMenu: IconConfig[] = [
  { iconName: 'RiDashboard2Fill', className: 'text-[3em]', route: 'dashboard' },
  { iconName: 'BsFillFolderFill', className: 'text-[2.5em]'},
  { iconName: 'RiFormula', className: 'text-[2.5em]'},
  { iconName: 'BiSolidReport', className: 'text-[3em]' },
  { iconName: 'GiMoneyStack', className: 'text-[3em]' },
  { iconName: 'MdOutlineInventory', className: 'text-[3em]' },
  { iconName: 'GoHistory', className: 'text-[3em]' },
];

const userDefaultMenu: IconConfig[] = [
  { iconName: 'RiDashboard2Fill', className: 'text-[3em]', route: 'dashboard' },
  { iconName: 'BsFillFolderFill', className: 'text-[2.5em]'},
  { iconName: 'RiFormula', className: 'text-[2.5em]'},
];

const adminDefaultMenu: IconConfig[] = [
  { iconName: 'RiDashboard2Fill', className: 'text-[3em]', route: 'dashboard' },
  { iconName: 'BsFillFolderFill', className: 'text-[2.5em]'},
  { iconName: 'RiFormula', className: 'text-[2.5em]'},
];

const CloseSidebar: React.FC = () => {
  const [isAdmin,setIsAdmin]= useState(false);
  
  return (
    <div className='fixed flex flex-col w-[120px] bg-primary h-full'>
      {/* Logo */}
      <div className='flex justify-center my-[20px]'>
        <Image src={logo} alt={'Virginia Logo'} className='w-[90px]' />
      </div>
      {/* Account Profile */}
      <div className='flex justify-center my-[10px]'>
        <img
          src="https://i.imgur.com/AZOtzD7.jpg"
          alt={'Profile Picture'}
          className='flex object-cover w-[89px] h-[89px] rounded-full border cursor-pointer'
        />
      </div>
      {/* Pages */}
      <div className='mx-auto'>
        <ul className='flex flex-col justify-center items-center text-white'>
          {mainMenu.map(({ iconName, className }, index) => {
            const IconComponent = iconMap[iconName];
            return (
              <li key={index} className='my-[13px]'>
                <IconComponent className={className} />
              </li>
            );
          })}
        </ul>
      </div>
      <hr className='mx-[15px] my-[12px]' />
      {/* Others */}
      <div>
      <ul className='flex flex-col justify-center items-center text-white'>
        {isAdmin 
        ?
          (userDefaultMenu.map(({ iconName, className }, index) => {
            const IconComponent = iconMap[iconName];
            return (
              <li key={index} className='my-[12px]'>
                <IconComponent className={className} />
              </li>
            );
          }))
        :
          (adminDefaultMenu.map(({ iconName, className }, index) => {
            const IconComponent = iconMap[iconName];
            return (
              <li key={index} className='my-[12px]'>
                <IconComponent className={className} />
              </li>
            );
          }))
        }
        </ul>
      </div>
    </div>
  );
};

export default CloseSidebar;
