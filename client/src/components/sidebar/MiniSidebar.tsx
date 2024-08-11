import React from 'react'
import { IconOpenConfig } from './OpenSidebar';
import { iconMap } from '@/utils/iconMap';
import useOutsideClick from '../../hooks/useOutsideClick';
import Link from 'next/link';

interface MiniSidebarProps {
    setIsMore: React.Dispatch<React.SetStateAction<boolean>>;
    isAdmin?: boolean;
}

const MiniSidebar: React.FC<MiniSidebarProps>  = ({ setIsMore, isAdmin }) => {
  const ref = useOutsideClick(() => setIsMore(false));
  return (
    
    <div ref={ref} className={`${isAdmin ? 'left-[280px] 2xl:left-[360px]' : 'left-[120px]'} font-lato fixed bottom-[100px] 2xl:bottom-[60px] animate-expand-width bg-[#FFD3D3] h-[120px] duration-300 ease-in-out rounded-r-lg z-20`}
        onMouseEnter={() => setIsMore(true)}
        onMouseLeave={() => (
            setTimeout(() => {
            setIsMore(false);
            }, 3000)
        )}>
        <ul className='animate-fade-in flex flex-col justify-start text-primary py-2 px-4'>
              {miniMenu.map(({ iconName, className, menuName, route }, index) => {
                const IconComponent = iconMap[iconName];
                return (
                  <Link href={`/${route}`}>
                    <li key={index} className='flex cursor-pointer hover:text-[#851313] items-center my-[5px]'>
                      <IconComponent className={`${className} mr-2`} />
                        <p className='font-semibold'>{menuName}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
    </div>
  )
}
export default MiniSidebar

const miniMenu: IconOpenConfig[] = [
    { iconName: 'ImUsers', route: 'user-management', menuName: 'Manage Users', className: 'text-[1.5em]' },
    { iconName: 'HiWrenchScrewdriver', route: 'maintenance', menuName: 'Maintain System', className: 'text-[1.5em]' },
    { iconName: 'GiBookmarklet', route: 'help', menuName: "User's Manual", className: 'text-[1.5em]' },
  ];