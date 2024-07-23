import React from 'react'
import Image from 'next/image';
import background from '@/assets/virginia-mascot-bg.png';
import { FcImageFile } from "react-icons/fc";

const AccountCreation = () => {
    return (
        <div className="w-full h-full flex font-lato animate-fade-in">
            <div className='flex z-0'>
                <Image
                    src={background}
                    alt={'Virginia Mascot BG'}
                    width={2000}
                    height={1000}
                />
            </div>
        <div className='w-[90rem] h-full fixed bg-white ml-[21%] shadow-2xl max-4xl:w-[70rem] max-3xl:w-[65rem] max-3xl:ml-[20%] max-2xl:w-[55rem] max-xl:w-[45rem]'> 
            {/* Title */}
            <div className='flex flex-col w-full h-[7.3rem] justify-center items-center'>
                <div className='text-[2.6em] font-bold max-3xl:text-[2.2em] max-xl:text-[1.9em]'> Account Creation </div>
                <div className='text-[1.3em] mb-2 max-xl:text-[1.1em]'> Create an employee account </div>
                <div className='w-full h-full bg-[#B22222]'></div>
            </div>

            {/* Upload Picture */}
            <div className='flex h-[18rem] justify-center items-center border-b-3 border-[#929090] bg-white cursor-pointer max-4xl:h-[15rem] '>
                <div className='flex flex-col w-[70rem] h-[13rem] font-semibold items-center justify-center border-5 border-dashed rounded-xl max-4xl:w-[55rem] max-4xl:h-[11rem] max-3xl:w-[45rem] max-2xl:w-[40rem] max-xl:w-[30rem] hover:animate-shrink-in'>
                    <div className='text-[5.5em] max-4xl:text-[5em]'>
                        <FcImageFile />
                    </div>
                    <div className='flex flex-col text-[1.1em] mt-4 items-center max-4xl:text-[1em]'>
                        <div className='flex'> Drag your image here, or <div className='text-[#B22222] ml-2'> browse </div> </div>
                        <div className='text-[#BABABA]'> Support: JPG, JPEG2000, PNG</div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className='flex justify-center mt-9 text-[#5B5353] text-[1.2em] max-3xl:text-[1.1em]'>
                {/* 1st Col */}
                <div className='flex flex-col mr-20 max-4xl:mr-12 max-3xl:mr-10 max-xl:mr-6'>
                    <div className='flex flex-col justify-start mb-10'>
                        <p>First Name*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    type="fname"
                                    name="fname"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start mb-10'>
                        <p>Email Address*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    type="email"
                                    name="email"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start mb-10'>
                        <p>Department*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <select
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    name="dept"
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
                <div className='flex flex-col mr-20 max-4xl:mr-12 max-3xl:mr-10 max-xl:mr-6'>
                    <div className='flex flex-col justify-start mb-10'>
                        <p>Middle Name*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    type="mname"
                                    name="mname"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start mb-10'>
                        <p>Employee Number*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    type="enum"
                                    name="enum"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start mb-10'>
                        <p>Phone Number*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    type="contactnum"
                                    name="contactnum"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3rd Col */}
                <div className='flex flex-col mr-6'>
                    <div className='flex flex-col justify-start mb-10'>
                        <p>Last Name*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    type="lname"
                                    name="lname"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start mb-10'>
                        <p>Suffix</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
                                    type="suffix"
                                    name="suffix"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start mb-10'>
                        <p>Role*</p>
                        <div className="flex flex-col w-full">
                            <div className="mt-2 text-gray-600">
                                <input
                                    className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline max-3xl:h-10 max-2xl:w-[13rem] max-xl:w-[11rem]"
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
                <div className='flex flex-col w-full mt-1 text-[1.2em] items-center max-4xl:text-[1.1em]'>
                    <button className='w-[10rem] h-[3rem] p-1 text-center font-semibold bg-white text-[#A60000] border-3 border-[#A60000] mb-4 rounded-xl  cursor-pointer max-4xl:h-[2.5em] hover:bg-[#A60000] hover:border-white hover:text-white'> 
                        Add Password </button>
                    <button className='w-[10rem] h-[3rem] p-1 text-center font-semibold bg-[#A60000] text-white rounded-xl cursor-pointer max-4xl:h-[2.5em] hover:bg-[#c01820]'> 
                        Confirm </button>
                </div>
            </div>
        </div>
    )

}

export default AccountCreation;