import React from 'react'
import { IconOpenConfig } from './OpenSidebar';
import { iconMap } from '@/utils/iconMap';
import useOutsideClick from '../../hooks/useOutsideClick';

interface MiniSidebarProps {
    setIsMore: React.Dispatch<React.SetStateAction<boolean>>;
    isAdmin?: boolean;
}

const MiniSidebar: React.FC<MiniSidebarProps>  = ({ setIsMore, isAdmin }) => {
  const ref = useOutsideClick(() => setIsMore(false));
  return (
    
    <div ref={ref} className={`${isAdmin ? 'left-[360px]' : 'left-[120px]'} font-lato fixed bottom-[60px] animate-expand-width bg-[#FFD3D3] h-[120px] duration-300 ease-in-out rounded-r-lg`}
        onMouseEnter={() => setIsMore(true)}
        onMouseLeave={() => (
            setTimeout(() => {
            setIsMore(false);
            }, 3000)
        )}>
        <ul className='animate-fade-in flex flex-col justify-start text-primary py-2 px-4'>
              {miniMenu.map(({ iconName, className, menuName }, index) => {
                const IconComponent = iconMap[iconName];
                return (
                    <li key={index} className='flex cursor-pointer hover:text-[#851313] items-center my-[5px]'>
                      <IconComponent className={`${className} mr-2`} />
                        <p className='font-semibold'>{menuName}</p>
                    </li>
                );
              })}
            </ul>
    </div>
  )
}
export default MiniSidebar

const miniMenu: IconOpenConfig[] = [
    { iconName: 'ImUsers', menuName: 'Manage Users', className: 'text-[1.5em]' },
    { iconName: 'HiWrenchScrewdriver', menuName: 'Maintain System', className: 'text-[1.5em]' },
    { iconName: 'GiBookmarklet', menuName: "User's Manual", className: 'text-[1.5em]' },
  ];