"use client";

import React from 'react'
import Image from 'next/image';
import background from '@/assets/virginia-mascot-bg.png';
import { FcImageFile } from "react-icons/fc";
import { useSidebarContext } from '@/context/SidebarContext';


const AccountCreation = () => {
    const { isOpen } = useSidebarContext();

    return (
        <div className="w-full h-full flex font-lato">
            <div className='flex h-full bg-cover bg-center w-[550px]' style={{ backgroundImage: `url(${background.src})` }} />
            {/* Wait lang butngan panig margin */}
            <div className={` ${isOpen ? 'w-full' : 'w-full'} 
                    h-full bg-white shadow-2xl`}>
                {/* Title */}
                <div className={`${isOpen ? '' : 'pt-5 3xl:pt-2'} flex flex-col w-full h-[7.3rem] justify-center items-center`}>
                    <div className='font-black text-[1.9em] 3xl:text-[2.2em]'> Account Creation </div>
                    <div className='mb-2 text-[1.1em] 3xl:text-[1.4em]'> Create an employee account </div>
                    <div className='w-full h-full bg-[#B22222]'></div>
                </div>

                {/* Upload Picture */}
                <div className='flex h-[18rem] justify-center items-center border-b-3 border-[#929090] bg-white cursor-pointer'>
                    <div className='w-[90%] h-[13rem] font-semibold border-2 border-dashed rounded-xl hover:bg-[#FFD3D3] hover:border-primary transition-all duration-300 ease-in-out'>
                        <div className='flex flex-col items-center justify-center h-full hover:scale-90 transition-all duration-300 ease-in-out'>
                            <div className='text-[5em] 4xl:text-[5.5em]'>
                                <FcImageFile />
                            </div>
                            <div className='flex flex-col text-[1em] 4xl:text-[1.1em] mt-4 items-center'>
                                <div className='flex'> Drag your image here, or <div className='text-[#B22222] ml-2'> browse </div> </div>
                                <div className='text-[#BABABA]'> Support: JPG, JPEG2000, PNG</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className={`${isOpen ? '' : ''} flex justify-center mt-9 text-[#5B5353] text-[0.8em] 2xl:text-[1.2em] mx-[30px] 2xl:mx-[50px] mb-12 2xl:mb-9 justify-between`}>
                    {/* 1st Col */}
                    <div className={` ${isOpen ? '' : ''} flex flex-col flex-1 mr-5 2xl:mr-9 gap-10`}>
                        <div className='flex flex-col justify-start'>
                            <p>First Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base`}
                                        type="fname"
                                        name="fname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p>Email Address*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        type="email"
                                        name="email"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p>Department*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <select
                                        className={` ${isOpen ? 'text-[10px] text-ellipsis' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Choose department</option>
                                        <option value="cost-accounting">Cost Accounting</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Col */}
                    <div className='flex flex-col flex-1 mr-5 2xl:mr-9 gap-10'>
                        <div className='flex flex-col justify-start'>
                            <p>Middle Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        type="mname"
                                        name="mname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p>Employee Number*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        type="enum"
                                        name="enum"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p>Phone Number*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        type="contactnum"
                                        name="contactnum"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3rd Col */}
                    <div className='flex flex-col flex-1 gap-10'>
                        <div className='flex flex-col justify-start'>
                            <p>Last Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        type="lname"
                                        name="lname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p>Suffix</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        type="suffix"
                                        name="suffix"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start'>
                            <p>Role*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className={` ${isOpen ? '' : ''} bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline text-[13px] 2xl:text-base `}
                                        type="role"
                                        name="role"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex flex-col w-full text-[1.1em] 2xl:text-[1.2em] items-center gap-[10px]'>
                    <div className="relative inline-flex bg-white border border-primary overflow-hidden text-primary w-[240px] h-[2.5em] 4xl:h-[3rem] flex items-center justify-center rounded-[10px] cursor-pointer transition-all rounded hover:border-1 hover:border-primary group">
                        <button className="font-black">
                            <span className="w-full h-48 rounded bg-primary absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                            <span className="relative w-full text-left text-primary transition-colors duration-300 ease-in-out group-hover:text-white">Add Password</span>
                        </button>
                    </div>
                    <div className="relative inline-flex bg-primary overflow-hidden text-white w-[240px] h-[2.5em] 4xl:h-[3rem] flex items-center justify-center rounded-[10px] cursor-pointer transition-all rounded hover:border-1 hover:border-primary group">
                        <button className="font-black">
                            <span className="w-full h-48 rounded bg-white absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                            <span className="relative w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-primary">Confirm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default AccountCreation;