"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/virginia-logo.png';
import { iconMap } from '@/utils/iconMap';
import usePath from '@/hooks/usePath';
import MiniSidebar from './MiniSidebar';
import Link from 'next/link';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import config from '@/server/config';
import { removeTokens } from '@/utils/removeTokens';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { FaUser } from 'react-icons/fa';

export interface IconOpenConfig {
  iconName: string;
  menuName: string;
  className?: string;
  route?: string;
  routes?: string[];
}

import { FaUserCircle } from 'react-icons/fa';
import { useUserContext } from '@/contexts/UserContext';

const OpenSidebar: React.FC = () => {
  const { isAdmin, setIsAdmin } = useSidebarContext();
  const { hasNewNotifications } = useNotificationContext();
  const [isMore, setIsMore] = useState(false);
  const path = usePath();
  const router = useRouter();
  
  const { currentUser } = useUserContext();
  const sysRoles = currentUser?.roles;
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // useEffect(() => {
  //   const userString = localStorage.getItem('currentUser');
  //   if (userString) {
  //     try {
  //       const parsedUser = JSON.parse(userString);
  //       setCurrentUser(parsedUser);
  //       setProfilePicture(parsedUser.displayPicture);
  //       if (parsedUser.userType === 'Admin') {
  //         setIsAdmin(true);
  //       } else {
  //         setIsAdmin(false);
  //       }
  //     } catch (error) {
  //       console.error('Error parsing user data:', error);
  //     }
  //   }
  // }, [currentUser, setIsAdmin]);

  useEffect(() => {
    if (currentUser) {
      setProfilePicture(currentUser.displayPicture);
      if (currentUser.userType === 'Admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [currentUser, setIsAdmin]);

  const handleLogout = async () => {
    await removeTokens();
    localStorage.removeItem('currentUser');
    localStorage.clear();
    router.push('/logout');
  }

  const getProfilePictureUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${config.API}/storage/${path}`;
  };

  return (
    <>
      <div className='font-lato flex justify-start bg-primary min-h-screen w-[280px] 2xl:w-[360px] h-full'>
        <div className='animate-crop-left-to-right relative top-0'>
          {/* Logo */}
          <div className='flex items-end my-[20px] px-[20px] 2xl:px-[40px] w-[280px] 2xl:w-[360px]'>
            <Image src={logo} alt={'Virginia Logo'} className='w-[80px] 2xl:w-[90px] h-auto mr-[10px]' />
            <p className='font-bold italic text-white text-[18px] 2xl:text-[22px] mb-[5px]'>Virginia Food, Inc.</p>
          </div>

          {/* Account Profile */}
          <div className='w-[280px] 2xl:w-[360px] flex items-center bg-[#CD3939] mb-[15px] px-[20px] 2xl:px-[40px] py-[15px]'>
            <div
              className='flex justify-center items-center size-[70px] 2xl:size-[80px] rounded-full border border-white hover:brightness-90 cursor-pointer overflow-hidden'
              onClick={() => { router.push('/profile') }}
            >
              {currentUser?.displayPicture ? (
                <div
                  className="w-full h-full object-cover"
                  style={{
                    backgroundImage: `url(${getProfilePictureUrl(profilePicture) || '/default-profile.png'})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                  }}
                />
              ) : (
                <div
                className='flex justify-center items-center w-[80px] h-[80px] rounded-full border border-white hover:brightness-90 cursor-pointer bg-gray-200'
                onClick={() => { router.push('/profile') }}
              >
                  <FaUser className='text-gray-500 text-3xl' />
                </div>
              )}
            </div>
            <div className='text-white ml-[15px] mt-[-8px]'>
              <h1 className='font-extrabold text-[24px] 2xl:text-[28px]'>{currentUser?.name}</h1>
              <p className='font-light text-[16px] 2xl:text-[20px] mt-[-8px] cursor-pointer hover:text-[#dbdbdb]'
                onClick={() => { router.push('/profile') }}>My Account</p>
            </div>
          </div>

          {/* Pages */}
          <div className='animate-crop-left-to-right mx-auto h-auto'>
            <ul className='flex flex-col text-white'>
              {mainMenu.map(({ iconName, className, menuName, route }, index) => {
                const IconComponent = iconMap[iconName];
                const showAuditLog = (isAdmin || (sysRoles && sysRoles.includes(4))) && menuName === 'Audit Log';
                return (
                  showAuditLog || menuName !== 'Audit Log' ? (
                    <Link href={`/${route}`} key={index}>
                    <li
                      className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                        ? 'w-[88%] 2xl:w-[86%] text-primary bg-[#FFD3D3] ml-[17px] 2xl:ml-[25px] pr-[20px] pl-[10px] 2xl:pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                        : 'my-[15px] 2xl:my-[12px] hover:text-[#FFD3D3] px-[25px] 2xl:px-[40px]'
                        }`}
                    >
                      <IconComponent className={`${className} justify-center`} />
                      <p className='font-lato text-[20px] 2xl:text-[25px]'>{menuName}</p>
                    </li>
                    </Link>
                  ) : null
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
                  if (iconName === 'FaBell' && hasNewNotifications) {
                    iconName = 'MdNotificationsActive';
                  }
                  const IconComponent = iconMap[iconName];
                  return (
                    <>
                      {menuName == 'Log Out' ?
                        <li
                          className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                            ? 'w-[90%] 2xl:w-[88%] text-primary bg-[#FFD3D3] ml-[17px] 2xl:ml-[25px] pr-[20px] pl-[10px] 2xl:pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                            : 'my-[14px] 2xl:my-[11px] hover:text-[#FFD3D3] px-[25px] 2xl:px-[40px]'
                            }`}
                          onClick={handleLogout}
                        >
                          <IconComponent className={`${className} justify-center`} />
                          <p className='font-lato ml-[8px] text-[20px] 2xl:text-[25px]'>{menuName}</p>
                        </li>
                        :
                        <Link href={`/${route}`} key={index}>
                          <li
                            className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                              ? 'w-[90%] 2xl:w-[88%] text-primary bg-[#FFD3D3] ml-[17px] 2xl:ml-[25px] pr-[20px] pl-[10px] 2xl:pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                              : 'my-[14px] 2xl:my-[11px] hover:text-[#FFD3D3] px-[25px] 2xl:px-[40px]'
                              }`}
                          >
                            <IconComponent className={`${className} ${iconName === 'MdNotificationsActive' && 'animate-shake-infinite'} justify-center`} />
                            <p className='font-lato ml-[8px] text-[20px] 2xl:text-[25px]'>{menuName}</p>
                          </li>
                        </Link>
                      }
                    </>
                  );
                }))
                :
                (adminDefaultMenu.map(({ iconName, className, menuName, route, routes }, index) => {
                  if (iconName === 'FaBell' && hasNewNotifications) {
                    iconName = 'MdNotificationsActive';
                  }
                  const IconComponent = iconMap[iconName];
                  const isRoute = routes?.some(e => e === path);
                  return menuName !== 'More' ? (
                    <>
                      {menuName == 'Log Out' ?
                        <li
                          key={index}
                          className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                            ? 'w-[90%] 2xl:w-[88%] text-primary bg-[#FFD3D3] ml-[17px] 2xl:ml-[25px] pr-[20px] pl-[10px] 2xl:pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                            : 'my-[14px] 2xl:my-[11px] hover:text-[#FFD3D3] px-[25px] 2xl:px-[40px]'
                            }`}
                          onClick={handleLogout}
                        >
                          <IconComponent className={`${className} ml-[5px] 2xl:ml-0 justify-center`} />
                          <p className='font-lato ml-[8px] text-[20px] 2xl:text-[25px]'>{menuName}</p>
                        </li>
                        :
                        <Link href={`/${route}`}>
                          <li
                            key={index}
                            className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${path === route
                              ? 'w-[90%] 2xl:w-[88%] text-primary bg-[#FFD3D3] ml-[17px] 2xl:ml-[25px] pr-[20px] pl-[10px] 2xl:pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                              : 'my-[14px] 2xl:my-[11px] hover:text-[#FFD3D3] px-[25px] 2xl:px-[40px]'
                              }`}
                          >
                            <IconComponent className={`${className} ${iconName === 'MdNotificationsActive' && 'animate-shake-infinite'} ml-[5px] 2xl:ml-0 justify-center`} />
                            <p className='font-lato ml-[8px] text-[20px] 2xl:text-[25px]'>{menuName}</p>
                          </li>
                        </Link>
                      }
                    </>
                  )
                    :
                    (
                      <li
                        key={index}
                        className={`flex items-center hover:animate-shrink-in grid grid-cols-[auto_1fr] gap-x-5 items-center cursor-pointer ${isRoute
                          ? 'w-[90%] 2xl:w-[88%] text-primary bg-[#FFD3D3] ml-[17px] 2xl:ml-[25px] pr-[20px] pl-[10px] 2xl:pl-[15px] py-[5px] my-[8px] rounded-[20px]'
                          : 'my-[14px] 2xl:my-[11px] hover:text-[#FFD3D3] px-[25px] 2xl:px-[40px]'
                          }`}
                        onMouseEnter={() => setIsMore(true)}>
                        <IconComponent className={`${className} ml-[5px] 2xl:ml-0 justify-center`} />
                        <p className='font-lato ml-[8px] text-[20px] 2xl:text-[25px]'>{menuName}</p>
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

export default OpenSidebar;

const mainMenu: IconOpenConfig[] = [
  { iconName: 'RiDashboard2Fill', route: 'dashboard', menuName: 'Dashboard', className: 'text-[2.4em] 2xl:text-[2.8em]' },
  { iconName: 'BsFillFolderFill', route: 'file-manager', menuName: 'File Manager', className: 'text-[2.4em] 2xl:text-[2.8em]' },
  { iconName: 'RiFormula', route: 'formulation', menuName: 'Formulations', className: 'text-[2.4em] 2xl:text-[2.8em]' },
  { iconName: 'BiSolidReport', route: 'cost-calculation', menuName: 'Cost Calculation', className: 'text-[2.4em] 2xl:text-[2.8em]' },
  { iconName: 'GiMoneyStack', route: 'projected-costing', menuName: 'Projected Costing', className: 'text-[2.4em] 2xl:text-[2.8em]' },
  { iconName: 'MdOutlineInventory', route: 'inventory', menuName: 'Inventory', className: 'text-[2.4em] 2xl:text-[2.8em]' },
  { iconName: 'GoHistory', route: 'audit-log', menuName: 'Audit Log', className: 'text-[2.4em] 2xl:text-[2.8em]' },
];

const userDefaultMenu: IconOpenConfig[] = [
  { iconName: 'FaBell', route: 'notification', menuName: 'Notifications', className: 'text-[1.9em] 2xl:text-[2.3em]' },
  { iconName: 'MdOutlineQuestionMark', route: 'help', menuName: 'Help', className: 'text-[1.9em] 2xl:text-[2.3em]' },
  { iconName: 'MdLogout', route: 'logout', menuName: 'Log Out', className: 'text-[1.9em] 2xl:text-[2.3em] pl-[3px]' },
];

const adminDefaultMenu: IconOpenConfig[] = [
  { iconName: 'FaBell', route: 'notification', menuName: 'Notifications', className: 'text-[1.9em] 2xl:text-[2.3em]' },
  { iconName: 'MdMoreHoriz', routes: ["help", "maintenance", "user-management"], menuName: 'More', className: 'text-[1.9em] 2xl:text-[2.3em]' },
  { iconName: 'MdLogout', route: 'logout', menuName: 'Log Out', className: 'text-[1.9em] 2xl:text-[2.3em] pl-[3px]' },
];