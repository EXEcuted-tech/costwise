import Header from '@/components/header/Header'
import React from 'react'
import { PiBookOpenText } from "react-icons/pi";
import { FaCompass } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { GrHelpBook } from "react-icons/gr";

const UserManualPage = () => {
  return (
    <div className="w-full animate-fade-in overflow-hidden">
      <div>
        <Header icon={PiBookOpenText} title="User's Management"></Header>
      </div>
      <div className='w-full h-[100vh] flex flex-col items-end justify-center 
             shadow-md bg-[#FFC24B] bg-opacity-20 overflow-hidden'>
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
        <div className='flex flex-row h-[45%] w-[100%] bg-[#FFFAF8] items-center justify-center px-5 overflow '>
          <div className='flex items-start justify-end bg-yellow-200 w-[33.33%] h-[120%]'>
            <div className='flex flex-row h-[65%] bg-white w-[80%] rounded-xl z-[4] px-5 py-5'>
              <div className='flex w-[20%] items-start justify-center'>
                <FaCompass className='text-[30px]' />
              </div>
              <div className='flex flex-col pl-[5%] w-[80%] text-tertiary'>
                <div className='text-[16px] font-bold'><p>Getting Started</p></div>
                <div className='text-[14px] pt-[3%]'><p>Learn how to use Product Costing System.</p></div>
                <div className='flex flex-col h-10% pl-[15%] pt-[10%]'>
                  <ul className='list-disc'>
                    <li>
                      Lorem ipsum
                    </li>
                    <li>
                      Lorem ipsum
                    </li>
                    <li>
                      Lorem ipsum
                    </li>
                  </ul>
                </div>
                <div className='flex h-full justify-start items-end'>
                  <div className='flex bg-primary px-[10%] py-[5%] text-white rounded-lg drop-shadow-xl cursor-pointer'>
                    <button>
                      <p>View Articles &gt;</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex bg-green-200 w-[33.33%] h-[120%] items-start justify-center '>
            <div className='flex flex-row h-[65%] bg-white w-[80%] rounded-xl z-[4] px-5 py-5'>
              <div className='flex w-[20%] items-start justify-center'>
                <CgProfile className='text-[30px]' />
              </div>
              <div className='flex flex-col pl-[5%] w-[80%] text-tertiary'>
                <div className='text-[16px] font-bold'><p>Essential features</p></div>
                <div className='text-[14px] pt-[3%]'><p>Learn how to use Product Costing System.</p></div>
                <div className='flex flex-col h-10% pl-[15%] pt-[10%]'>
                  <ul className='list-disc'>
                    <li>
                      Lorem ipsum
                    </li>
                    <li>
                      Lorem ipsum
                    </li>
                    <li>
                      Lorem ipsum
                    </li>
                  </ul>
                </div>
                <div className='flex h-full justify-start items-end'>
                  <div className='flex bg-primary px-[10%] py-[5%] text-white rounded-lg drop-shadow-xl cursor-pointer'>
                    <button>
                      <p>View Articles &gt;</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex bg-red-300 w-[33.33%] h-[120%]'>
            <div className='flex flex-row h-[65%] bg-white w-[80%] rounded-xl z-[4] px-5 py-5'>
              <div className='flex w-[20%] items-start justify-center'>
                <GrHelpBook className='text-[30px]' />
              </div>
              <div className='flex flex-col pl-[5%] w-[80%] text-tertiary'>
                <div className='text-[16px] font-bold'><p>Getting Started</p></div>
                <div className='text-[14px] pt-[3%]'><p>Learn how to use Product Costing System.</p></div>
                <div className='flex flex-col h-10% pl-[15%] pt-[10%]'>
                  <ul className='list-disc'>
                    <li>
                      Lorem ipsum
                    </li>
                    <li>
                      Lorem ipsum
                    </li>
                    <li>
                      Lorem ipsum
                    </li>
                  </ul>
                </div>
                <div className='flex h-full justify-start items-end'>
                  <div className='flex bg-primary px-[10%] py-[5%] text-white rounded-lg drop-shadow-xl cursor-pointer'>
                    <button>
                      <p>View Articles &gt;</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManualPage