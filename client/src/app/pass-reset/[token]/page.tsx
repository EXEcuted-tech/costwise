"use client";
import React, { useEffect, useState } from 'react'
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import api from '@/utils/api';
import { useSearchParams, useParams } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import PasswordChangeComplete from '@/components/modals/PasswordChangeComplete';
import Alert from '@/components/alerts/Alert';
import Spinner from '@/components/loaders/Spinner';
import ErrorToken from '@/components/modals/ErrorToken';
import { IoMdInformationCircle } from "react-icons/io";
import { BsExclamationCircle } from 'react-icons/bs';


const PasswordReset = () => {

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [access, setAccess] = useState(false);
  const [unavail, setUnavail] = useState(false);
  const [modal, setModal] = useState(false);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { currentUser } = useUserContext();
  //   const router = useRouter();
  //   const { token } = router.query;
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const params = useParams();
  const token = params.token;

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      let errors: string[] = [];

      if (!password) {
        errors.push("Password is required.");
      } else if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
      }

      if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character.");
      }

      if (!passwordConfirmation) {
        errors.push("Confirm Password is required.");
      } else if (password != passwordConfirmation && password) {
        errors.push("Please make sure your passwords match.");
      }

      if (errors.length > 0) {
        setAlertMessages(errors);
        setIsLoading(false);
        return;
      }

      const response = await api.post('/password-reset/reset', {
        token: token as string,
        email: email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setAccess(true);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {

      try {
        const tokens = await api.get(`/password-reset/${token}`, { params: { email } });
        if (tokens.data.message === 'Invalid or expired token') {
          setUnavail(true);
        }
      } catch (error: any) {
        setUnavail(true);
        console.error('Error fetching token:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {access && <PasswordChangeComplete />}
      {unavail && < ErrorToken />}

      <div className="fixed top-4 right-4 z-[1500]">
        <div className="flex flex-col items-end space-y-2">
          {alertMessages && alertMessages.map((msg, index) => (
            <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
              setAlertMessages(prev => prev.filter((_, i) => i !== index));
            }} />
          ))}
        </div>
      </div>
      <div className='flex flex-col animate-pop-out bg-white w-[550px] h-auto pb-[30px] rounded-[20px] px-[10px] gap-3'>
        <div className='flex justify-center'>
          <div className='absolute left-[30px] top-[30px] group z-[1000]'>
            <BsExclamationCircle className='text-[2em] cursor-pointer text-[#c26565] hover:text-[#B22222] hover:animate-shake-tilt transition-all duration-300 ease-in-out 4xl:text-[2em] 3xl:text-[1.8em] 2xl:text-[1.8em] xl:text-[1.6em]' />
            <div className="absolute w-[340px] h-auto bg-[#FFD3D3] text-[1em] text-[#B22222] p-4 left-[35px] top-[20px] rounded-lg drop-shadow-lg invisible opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 4xl:text-[1em] 3xl:text-[1em] 2xl:text-[0.8em] xl:text-[0.8em]">
              <p className='text-[18px] font-bold'>Password must contain at least:</p>
              <div className='text-[16px] pl-[20px]'>
                <p>- 8 characters.</p>
                <p>- 1 uppercase letter.</p>
                <p>- 1 special letter &#40;e.g. *&#91;&#93;@#$%*^&+=&#41;</p>
              </div>
            </div>
          </div>
          <h1 className='font-black text-[30px] mt-[20px]'>Password Change</h1>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col w-full px-5 gap-5'>
          <label className='relative'>
            Enter New Password:
            <div className='relative flex justify-center items-center'>
              <input
                className="bg-white h-12 text-[16px] relative 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
                type={showPassword1 ? "text" : "password"}
                name="npassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                {showPassword1 ? <VscEyeClosed size={30} className="text-black mr-2" /> : <VscEye size={30} className="text-black mr-2" />}
              </button>
            </div>
          </label>
          <label className='relative'>
            Confirm Password:
            <div className='relative flex justify-center items-center'>
              <input
                className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
                type={showPassword2 ? "text" : "password"}
                name="cpassword"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <VscEyeClosed size={30} className="text-black mr-2" /> : <VscEye size={30} className="text-black mr-2" />}
              </button>
            </div>
          </label>

          <div className='flex w-full justify-center'>
            <button className='flex justify-center items-center w-[50%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] bg-primary text-white rounded-xl hover:bg-[#9c1c1c]'
              type='submit'
            >
              {isLoading ?
                <>
                  <Spinner />
                  <p className='ml-2'>Reset Password</p>
                </>
                :
                'Reset Password'}
            </button>
          </div>
        </form>
      </div >
    </>
  )
}

export default PasswordReset