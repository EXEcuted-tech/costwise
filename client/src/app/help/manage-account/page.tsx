import Header from '@/components/header/Header'
import Link from 'next/link';
import { FaPencilAlt } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import { PiBookOpenText } from "react-icons/pi";

const GettingStartedPage = () => {

    return (
        <div className='bg-cover bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20 h-[100vh] overflow-hidden'>
            <div>
                <Header icon={PiBookOpenText} title="User's Manual"></Header>
            </div>
            <div className='flex h-[90%] w-[98%] pl-[90px] pt-[15px] -z-50'>
                <div className='flex flex-col bg-white w-full rounded-xl p-10 drop-shadow-lg'>
                    <div className='flex flex-row w-full items-center justify-start border-b border-[#ACACAC] gap-[15px]'>
                        <Link href="/help">
                            <GoArrowLeft className="text-primary text-[1em] xl:text-[2em] hover:opacity-75 hover:animate-shrink-in transition ease-in-out duration-200" />
                        </Link>
                        <p className='flex items-center justify-start text-primary text-[40px] font-bold'>Manage your account</p>
                        <div className='flex justify-center items-center h-[50%] cursor-pointer transition-colors duration-200 ease-in-out'>
                            <FaPencilAlt className='w-[30px] h-auto text-primary' />
                        </div>
                    </div>
                    <div id='scroll-style' className='overflow-y-scroll'>
                        <div className='flex flex-col pt-[50px] text-[30px] text-tertiary'>
                            Heading 1
                            <div className='flex flex-col text-[24px] pt-[10px] text-tertiary'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum vel arcu nec faucibus. Nam placerat porttitor eros vitae dictum. Cras velit dolor, hendrerit volutpat metus non, egestas elementum enim. Maecenas id tincidunt risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque mattis lorem eget augue finibus, eu tincidunt mi convallis. Nulla facilisi.</p>
                            </div>
                        </div>
                        <div className='flex flex-col pt-[50px] text-[30px] text-tertiary'>
                            Heading 2
                            <div className='flex flex-col text-[24px] pt-[10px] text-tertiary'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum vel arcu nec faucibus. Nam placerat porttitor eros vitae dictum. Cras velit dolor, hendrerit volutpat metus non, egestas elementum enim. Maecenas id tincidunt risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque mattis lorem eget augue finibus, eu tincidunt mi convallis. Nulla facilisi.</p>
                            </div>
                        </div>
                        <div className='flex flex-col pt-[50px] text-[30px] text-tertiary'>
                            Heading 3
                            <div className='flex flex-col text-[24px] pt-[10px] text-tertiary'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum vel arcu nec faucibus. Nam placerat porttitor eros vitae dictum. Cras velit dolor, hendrerit volutpat metus non, egestas elementum enim. Maecenas id tincidunt risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque mattis lorem eget augue finibus, eu tincidunt mi convallis. Nulla facilisi.</p>
                            </div>
                        </div>
                        <div className='flex flex-col pt-[50px] text-[30px] text-tertiary'>
                            Heading 4
                            <div className='flex flex-col text-[24px] pt-[10px] text-tertiary'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum vel arcu nec faucibus. Nam placerat porttitor eros vitae dictum. Cras velit dolor, hendrerit volutpat metus non, egestas elementum enim. Maecenas id tincidunt risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque mattis lorem eget augue finibus, eu tincidunt mi convallis. Nulla facilisi.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default GettingStartedPage