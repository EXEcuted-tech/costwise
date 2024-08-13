import Header from '@/components/header/Header'
import { PiBookOpenText } from "react-icons/pi";
import { FaCompass } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { GrHelpBook } from "react-icons/gr";

const UserManualPage = () => {

  const divShadows = {
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
  }

  return (
    <div className='overflow-hidden bg-cover bg-center items-center justify-center shadow-2xl bg-[#FFC24B] bg-opacity-20' style={{ backgroundImage: "url('/images/usermanbg.png')" }}>
      <div>
        <Header icon={PiBookOpenText} title="User's Management"></Header>
      </div>
      <div className='w-full h-[90vh] flex flex-col items-end justify-center ml-[45px] pr-[45px]
            '>
        {/* Top Div */}
        <div className='flex flex-col h-[55%] w-full items-center justify-center'>
          <div className='flex h-[40%] w-full items-end justify-center'>
            <img
              src="images/howcanihelp.png"
              alt="Logout Image"
              className="h-auto max-h-[95%] mr-[5%]"
            />
          </div>
          <div className='flex h-[60%] w-full items-end justify-center relative'>
            <img
              src="images/designelipse.png"
              alt="Logout Image"
              className="h-auto max-h-[85%] mr-[5%]"
            />
            <img
              src="images/virginiamaskot.png"
              alt="Logout Image"
              className="h-auto max-h-[95%] absolute mr-[5%]"
            />
          </div>

        </div>
        {/* Bottom Div */}
        <div className='flex flex-row h-[45%] w-[105%] bg-[#FFFAF8] items-center justify-center px-5 overflow-b-hidden z-10'>
          <div className='flex  w-[33.33%] h-[120%] items-start justify-end '>
            <div className='flex flex-row h-[75%] bg-white w-[80%] rounded-xl  px-5 py-5 ' style={divShadows}>
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
                <div className='flex h-full justify-start items-end z-50'>
                  <div className='flex bg-primary px-[10%] py-[5%] text-white rounded-lg drop-shadow-xl cursor-pointer'>
                    <button>
                      <p>View Articles &gt;</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex  w-[33.33%] h-[120%] items-start justify-center '>
            <div className='flex flex-row h-[75%] bg-white w-[80%] rounded-xl  px-5 py-5 ' style={divShadows}>
              <div className='flex w-[20%] items-start justify-center'>
                <CgProfile className='text-[30px]' />
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
          <div className='flex w-[33.33%] h-[120%]'>
            <div className='flex flex-row h-[75%] bg-white w-[80%] rounded-xl px-5 py-5' style={divShadows}>
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