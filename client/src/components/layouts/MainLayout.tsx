"use client"
import React, { useEffect, useState } from 'react'
import CloseSidebar from '../sidebar/CloseSidebar'
import Image from 'next/image';
import hotdog from '@/assets/hotdog.png';
import OpenSidebar from '../sidebar/OpenSidebar';
import { useSidebarContext } from '@/contexts/SidebarContext';
import api from '@/utils/api';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useUserContext } from '@/contexts/UserContext';
import Alert from '../alerts/Alert';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { useSilentModeContext } from '@/contexts/SilentModeContext';

const MainLayout = () => {
  const { isOpen, setIsOpen } = useSidebarContext();
  const { setHasNewNotifications } = useNotificationContext();
  const [notificationSound, setNotificationSound] = useState<HTMLAudioElement | null>(null);
  const { setError, error } = useUserContext();
  const { silentMode, setSilentMode } = useSilentModeContext();
  
  const notificationSoundSrc = '/notification-ring.mp3';

  useTokenRefresh(5);
  
  useEffect(() => {
    setNotificationSound(new Audio(notificationSoundSrc));
  }, []);

  useEffect(() => {
    let lastCheckedAt = new Date().toISOString();

    const checkForNewNotifications = async () => {
      try {
        const response = await api.get('/notifications/new', {
          params: { last_checked_at: lastCheckedAt }
        });

        if (response.data.data.length > 0) {
          setHasNewNotifications(true);
          if (!silentMode) {
            notificationSound?.play();
          }
        } else {
          setHasNewNotifications(false);
        }

        lastCheckedAt = new Date().toISOString();
      } catch (error) {
        console.error('Error checking for notifications:', error);
      }
    };

    const intervalId = setInterval(checkForNewNotifications, 15000);

    return () => clearInterval(intervalId);
  }, [notificationSound, setHasNewNotifications]);

  // useEffect(() => {
  //   let lastCheckedAt = new Date().toISOString();
  //   let isPolling = false;

  //   const checkForNewNotifications = async () => {
  //     if (isPolling) return;
  //     isPolling = true;

  //     try {
  //       const response = await api.get('/notifications/new', {
  //         params: { last_checked_at: lastCheckedAt },
  //         timeout: 30000 // 30 seconds timeout
  //       });

  //       if (response.data.data.length > 0) {
  //         setHasNewNotifications(true);
  //         notificationSound?.play();
  //       } else {
  //         setHasNewNotifications(false);
  //       }

  //       lastCheckedAt = new Date().toISOString();
  //     } catch (error) {

  //     } finally {
  //       isPolling = false;
  //       checkForNewNotifications(); // Start the next long poll
  //     }
  //   };

  //   checkForNewNotifications(); // Start the initial long poll

  //   return () => {
  //     isPolling = false; // Stop polling on unmount
  //   };
  // }, [notificationSound, setHasNewNotifications]);

  return (
    <>
      {error && <Alert message={error} variant='critical' setClose={() => setError('')} />}
      <div className='flex !font-lato'>
        <div
          className={`fixed flex transition-all duration-400 ease-in-out ${isOpen ? 'w-[280px] 2xl:w-[360px]' : 'w-[120px]'} overflow-hidden z-[1000]`}
        >
          {isOpen ? <OpenSidebar /> : <CloseSidebar />}
        </div>
        <div className={`fixed  ${isOpen ? 'left-[280px] 2xl:left-[360px]' : 'left-[120px]'} top-[400px] bg-[#DD8383] flex flex-col justify-center h-[125px] w-[45px] rounded-r-3xl hover:w-[55px] cursor-pointer transition-all duration-400 ease-in-out z-10`}
          onClick={() => setIsOpen(!isOpen)}>
          <div className='flex justify-center items-center'>
            <Image src={hotdog} alt={'Hotdog Icon'} className='w-[35px] h-auto object-cover' />
          </div>
        </div>
      </div>
    </>
  )
}

export default MainLayout