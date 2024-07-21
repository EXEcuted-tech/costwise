import React from 'react'
import background from '@/assets/virginia-mascot-bg.png';
import { FcImageFile } from "react-icons/fc";

const AccountCreation = () => {
    return (
        <div className="w-screen h-full flex justify-end">
            <div className='w-[57rem] h-full bg-white shadow-2xl'> 
                {/* Title */}
                <div className='flex flex-col w-full h-[7.3rem] justify-center items-center'>
                    <div className='text-[2.6em] font-bold'> Account Creation </div>
                    <div className='text-[1.3em] mb-2'> Create an employee account </div>
                    <div className='w-full h-full bg-[#B22222]'></div>
                </div>

                {/* Upload Picture */}
                <div className='flex h-[15rem] justify-center items-center border-b-3 border-[#929090] bg-white cursor-pointer '>
                    <div className='flex flex-col w-[50rem] h-[12rem] font-semibold items-center justify-center border-5 border-dashed rounded-xl hover:animate-shrink-in'>
                        <div className='text-[5.5em]'>
                            <FcImageFile />
                        </div>
                        <div className='flex flex-col text-[1.1em] mt-4 items-center'>
                            <div className='flex'> Drag your image here, or <div className='text-[#B22222] ml-2'> browse </div> </div>
                            <div className='text-[#BABABA]'> Support: JPG, JPEG2000, PNG</div>
                        </div>
                    </div>
                </div>

                 {/* Form */}
                 <div className='flex justify-center mt-9 text-[#5B5353]'>
                    {/* 1st Col */}
                    <div className='flex flex-col mr-12 ml-9'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>First Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="fname"
                                        name="fname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Email Address*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="email"
                                        name="email"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Department*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <select
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        name="dept"
                                    >
                                        <option selected>Choose department</option>
                                        <option value="?">Cost Accounting</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Col */}
                    <div className='flex flex-col mr-12'>
                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Middle Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="mname"
                                        name="mname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Employee Number*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="enum"
                                        name="enum"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Phone Number*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
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
                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Last Name*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="lname"
                                        name="lname"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Suffix*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
                                        type="suffix"
                                        name="suffix"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-start text-[1.2em] mb-10'>
                            <p>Role*</p>
                            <div className="flex flex-col w-full">
                                <div className="mt-2 text-gray-600">
                                    <input
                                        className="bg-white h-12 w-[15rem] px-5 border-2 border-[#B3B3B3] rounded-lg focus:outline"
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
                 <div className='flex flex-col w-full mt-2 items-center'>
                    <button className='w-[10rem] h-[3rem] p-1 text-center text-[1.2em] font-semibold bg-white text-[#A60000] border-3 border-[#A60000] mb-4 rounded-xl'> Add Password </button>
                    <button className='w-[10rem] h-[3rem] p-1 text-center text-[1.2em] font-semibold bg-[#A60000] text-white rounded-xl'> Confirm </button>
                </div>
            </div>
        
        </div>
    )

}

export default AccountCreation;