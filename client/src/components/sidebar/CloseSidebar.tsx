"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/virginia-logo.png';
import { iconMap } from '@/utils/iconMap';
import { Tooltip } from "@nextui-org/react";
import usePath from '@/hooks/usePath';
import MiniSidebar from './MiniSidebar';
import Link from 'next/link';
import { useSidebarContext } from '@/context/SidebarContext';

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

  return (
    <>
      <div className='flex justify-center w-full bg-primary min-h-screen'>
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
              {mainMenu.map(({ iconName, className, tooltip, route }, index) => {
                const IconComponent = iconMap[iconName];
                return (
                  <Tooltip
                    key="#FFD3D3"
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
                  const IconComponent = iconMap[iconName];
                  return (
                    <Tooltip
                      key="#FFD3D3"
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
                          'my-[13px] hover:text-[#FFD3D3]'}`}>
                          <IconComponent className={className} />
                        </li>
                      </Link>
                    </Tooltip>
                  );
                }))
                :
                (adminDefaultMenu.map(({ iconName, className, tooltip, route, routes }, index) => {
                  const IconComponent = iconMap[iconName];
                  const isRoute = routes?.some(e => e === path);
                  return tooltip !== 'More' ? (
                    <Tooltip
                      key="#FFD3D3"
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
                          'my-[12px] hover:text-[#FFD3D3]'}`}>
                          <IconComponent className={className} />
                        </li>
                      </Link>
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
      </div>
      {isMore && <MiniSidebar setIsMore={setIsMore} />}
    </>
  );
};

export default CloseSidebar;

const mainMenu: IconClosedConfig[] = [
  { iconName: 'RiDashboard2Fill', route: 'dashboard', tooltip: 'Dashboard', className: 'text-[2.8em]' },
  { iconName: 'BsFillFolderFill', route: 'file-manager', tooltip: 'File Manager', className: 'text-[2.3em]' },
  { iconName: 'RiFormula', route: 'formulation', tooltip: 'Formulations', className: 'text-[2.3em]' },
  { iconName: 'BiSolidReport', route: 'report-generation', tooltip: 'Report Generation', className: 'text-[2.8em]' },
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
  { iconName: 'MdMoreHoriz', routes: ["help", "maintenance", "user-managemenet"], tooltip: 'More', className: 'text-[2.8em]' },
  { iconName: 'MdLogout', route: 'logout', tooltip: 'Log Out', className: 'text-[2.3em]' },
];

