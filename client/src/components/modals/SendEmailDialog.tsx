import React, { useState } from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import api from '@/utils/api';
import EmailSent from './EmailSent';
import { Spinner } from '@nextui-org/react';

interface SendEmailDialogProps { 
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendEmailDialog: React.FC<SendEmailDialogProps> = ({ setDialog }) => {

  const [email, setEmail] = useState('');
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [access, setAccess] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setModal(true);
    setIsLoading(true);
    try {
      const response = await api.post('/password-reset/email', { email });
      const respo = "Success!";
      console.log(respo);
      setAccess(true);
      
    } catch (error) {
      console.error('Error sending reset email:', error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {access && 
          <EmailSent onClose={setAccess} email={email}/>
      }
      <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[500]'>
        <div className='flex flex-col animate-pop-out bg-white w-[550px] h-auto pb-[30px] rounded-[20px] py-[20px] px-[10px] gap-2'>
          <div className='flex justify-between items-center'>
              <div className="w-full flex justify-center">
                <h1 className='font-black text-[30px] ml-[40px]'>Password Change</h1>
              </div>
              <IoIosClose className=' text-[50px] text-[#CECECE] cursor-pointer hover:brightness-90' onClick={() => setDialog(false)}/>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col w-full px-5 gap-2'>
              <p className='text-[20px]'>Enter your email address</p>
              <input
                  className="bg-white h-12 text-[16px] 2xl:text-[18px] 3xl:text-[20px] w-full px-5 border border-[#B3B3B3] rounded-lg focus:outline"
                  type="email"
                  name="fname"
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
              />
              <div className='flex w-full justify-center'>
                  <button className='w-[50%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-[#00930F] bg-primary text-white rounded-xl hover:bg-[#9c1c1c]'
                  type='submit'
                  >
                    {isLoading? <Spinner /> : 'Send Reset Email'}
                  </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SendEmailDialog