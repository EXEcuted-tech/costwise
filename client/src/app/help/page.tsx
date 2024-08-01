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
              <div className='flex h-[45%] w-[100%] bg-[#FFFAF8]'>
                Bottom Div
                <div>

                </div>
                <div>

                </div>
                <div>
                  
                </div>
              </div>
            </div>
        </div>
  )
}

export default UserManualPage