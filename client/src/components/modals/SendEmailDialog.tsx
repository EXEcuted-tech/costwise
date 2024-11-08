import React, { useEffect, useState } from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import api from '@/utils/api';
import EmailSent from './EmailSent';
import Spinner from '@/components/loaders/Spinner'
import Alert from '../alerts/Alert';
import { MdEmail } from 'react-icons/md';
import { IoPerson } from 'react-icons/io5';

interface SendEmailDialogProps {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendEmailDialog: React.FC<SendEmailDialogProps> = ({ setDialog }) => {

  const [email, setEmail] = useState('');
  const [employeeNum, setEmployeeNum] = useState('');
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [access, setAccess] = useState(false);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [alertStatus, setAlertStatus] = useState<string>('');
  const [emailError, setEmailError] = useState(false);
  const [employeeNumError, setEmployeeNumError] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    const newAlertMessages: string[] = [];

    e.preventDefault();
    setModal(true);
    setIsLoading(true);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|virginiafood\.com\.ph)$/i;

    try {
      if(!email){
        setEmailError(true);
        newAlertMessages.push("Email address is required.");
      }else if (!emailRegex.test(email)){
        setEmailError(true);
        newAlertMessages.push("Invalid email address.");
      }
      if(!employeeNum){
        setEmployeeNumError(true);
        newAlertMessages.push("Employee number is required.");
      } else if (employeeNum.length !== 10){
        setAlertMessage("Invalid employee number.");
      }

      const response = await api.post('/password-reset/email', { email, employeeNum });
      if(response.status==404){
        setAlertMessages([response.data.message]);
        setAlertStatus('success');
      } else {
        setAccess(true);
      }
    } catch (error) {
      newAlertMessages.push("User not found.");
      setAlertStatus('critical');
      console.error('Error sending reset email:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setDialog(false);
        }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
        document.removeEventListener('keydown', handleEscapeKey);
    };
}, [setDialog]);


  return (
    <>
      <div className="fixed top-4 right-4 z-[3000]">
          {alertMessages && alertMessages.map((msg, index) => (
            <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
              setAlertMessages(prev => prev.filter((_, i) => i !== index));
            }} />
          ))}
      </div>
      {access &&
        <EmailSent onClose={setAccess} email={email} />
      }
      <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[2000]'>
        <div className='flex flex-col animate-pop-out bg-white w-[550px] h-auto pb-[30px] rounded-[20px] py-[20px] px-[10px] gap-2 dark:bg-[#3C3C3C] dark:text-white'>
          <div className='flex justify-between items-center'>
            <div className="w-full flex justify-center">
              <h1 className='font-black text-[30px] ml-[40px]'>Password Change</h1>
            </div>
            <IoIosClose className=' text-[50px] text-[#CECECE] cursor-pointer hover:brightness-90' onClick={() => setDialog(false)} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col w-full px-5 gap-2'>
              <p className={`${emailError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} text-[20px] flex items-center gap-2`}>
                <MdEmail />
                Email Address
                <span className='text-[#B22222] font-bold'>*</span>
              </p>
              <input
                className={`${emailError ? 'text-[#B22222] focus:!outline-[#B22222] border-2 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} text-[20px] dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                type="email"
                name="fname"
                placeholder="Enter email address"
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className={`${employeeNumError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} text-[20px] flex items-center gap-2`}>
                <IoPerson />  
                Employee Number
                <span className='text-[#B22222] font-bold'>*</span>
              </p>
              <input
                className={`${employeeNumError ? 'text-[#B22222] focus:!outline-[#B22222] border-2 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} text-[20px] dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                type="text"
                name="fname"
                maxLength={13}
                placeholder="Enter employee number"
                onChange={(e) => setEmployeeNum(e.target.value)}
              />
              <div className='flex w-full justify-center mt-4'>
                <button className='w-[50%] h-[3rem] p-2 text-center text-[1.2em] font-semibold bg-primary text-white rounded-xl hover:bg-[#9c1c1c]'
                  type='submit'
                >
                  {isLoading ? <span className='flex justify-center items-center gap-2'><Spinner /> Send Reset Email</span> : 'Send Reset Email'}
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