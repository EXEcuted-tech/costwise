import React, { useState } from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { useRouter } from 'next/router';
import api from '@/utils/api';

interface PasswordResetDialogProps { 
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({ setDialog }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await api.post('/password/reset' , {
        token,
        email: router.query.email,
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
    <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]'>
      <div className='flex flex-col animate-pop-out bg-white w-[550px] h-auto pb-[30px] rounded-[20px] px-[10px] gap-5'>
        <div className='flex justify-end'>
            <h1 className='font-black text-[30px] mt-[20px] mr-[65px]'>Password Change</h1>
            <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:brightness-90' onClick={() => setDialog(false)}/>
        </div>

        {/* <div className='flex flex-col w-full px-5 gap-5'>
          <input
              className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
              type="password"
              name="opassword"
              placeholder="Old Password"
          />
          <input
              className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
              type="password"
              name="npassword"
              placeholder="New Password"
          />
        </div> */}

        <form onSubmit={handleSubmit}>
          <label>
            New Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
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
    </div>
  )
}

export default PasswordResetDialog