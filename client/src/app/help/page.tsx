import Header from '@/components/header/Header'
import React from 'react'
import { PiBookOpenText } from "react-icons/pi";

const UserManualPage = () => {
  return (
    <div className="w-full animate-fade-in">
            <div>
                <Header icon={PiBookOpenText} title="User's Management"></Header>
            </div>
            <div className='w-full h-[100vh] flex flex-col items-end justify-center 
             shadow-md bg-[#FFC24B] bg-opacity-20 '>
              {/* Top Div */}
              <div className='flex flex-col h-[55%] w-full bg-cover bg-center items-center justify-center shadow-2xl z-[3]' style={{ backgroundImage: "url('/images/usermanbg.png')" }}>
                <div className='flex h-[40%] w-full items-end justify-center'>
                <img
                  src="images/howcanihelp.png"
                  alt="Logout Image"
                  className="h-auto max-h-[95%]"
                />
                </div>
                <div className='flex h-[60%] w-full items-end justify-center relative'>
                <img
                  src="images/designelipse.png"
                  alt="Logout Image"
                  className="h-auto max-h-[85%]" 
                />
                <img
                  src="images/virginiamaskot.png"
                  alt="Logout Image"
                  className="h-auto max-h-[95%] absolute"
                />
</div>
                
              </div>
              {/* Bottom Div */}
              <div className='flex flex-row h-[45%] w-[100%] bg-[#FFFAF8] items-center justify-center px-5'>
                <div className='flex items-start justify-end bg-yellow-200 w-[33.33%] h-[150%]'>
                <div className='h-[65%] bg-white w-[80%] rounded-xl z-[4] px-5 py-10'>
                1st Div 
                </div>
                </div>
                <div className='flex bg-green-200 w-[33.33%] h-[150%] items-start justify-center px-5'>
<div className='h-[65%] bg-white w-[80%] rounded-xl z-[4] px-5 py-10'>
2nd Div
                </div>
                </div>
                <div className='flex bg-red-300 w-[33.33%] h-[150%]'>
                <div className='h-[65%] bg-white w-[80%] rounded-xl z-[4] items-start justify-start px-5'>
3rd Div
                </div>
                </div>
              </div>
            </div>
        </div>
  )
}

export default UserManualPage