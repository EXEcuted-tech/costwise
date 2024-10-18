"use client";
import React, { useState } from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import api from '@/utils/api';
import { useSearchParams, useParams } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';

interface PasswordResetProps { 
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ setDialog }) => {

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const { currentUser } = useUserContext();
//   const router = useRouter();
//   const { token } = router.query;
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const params = useParams();
    const token = params.token;

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
        console.log(token);
        console.log(email);
        console.log(password);
        console.log(passwordConfirmation);
      const response = await api.post('/password-reset/reset' , {
        token: token as string,
        email: email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password');
    }
  }

  return (
    <div className='flex flex-col animate-pop-out bg-white w-[550px] h-auto pb-[30px] rounded-[20px] px-[10px] gap-5'>
    <div className='flex justify-center'>
        <h1 className='font-black text-[30px] mt-[20px]'>Password Change</h1>
    </div>

    <form onSubmit={handleSubmit} className='flex flex-col w-full px-5 gap-5'>
        <label>
        Enter New Password:
        <input
            className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
            type="password"
            name="npassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
        />
        </label>
        <label>
        Confirm Password:
        <input
            className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
            type="password"
            name="cpassword"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Confirm Password"
        />
        </label>

        <div className='flex w-full justify-center'>
            <button className='w-[50%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] bg-primary text-white rounded-xl hover:bg-[#9c1c1c]'
            type='submit'
            >
            Reset Password
            </button>
        </div>
    </form>
    {message && <p>{message}</p>}
    </div>
  )
}

export default PasswordReset