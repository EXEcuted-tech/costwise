import React, { useEffect, useState } from 'react'
import { RiFileWarningFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import api from '@/utils/api';
import EmailSent from './EmailSent';
import Spinner from '@/components/loaders/Spinner'
import Alert from '../alerts/Alert';
import { MdEmail } from 'react-icons/md';
import { IoPerson } from 'react-icons/io5';
import { useUserContext } from '@/contexts/UserContext';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

interface SendEmailDialogProps {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  email: string | undefined;
  employeeNum: string | undefined;
}

const SendEmailDialog: React.FC<SendEmailDialogProps> = ({ setDialog, email, employeeNum }) => {

  const [currentPass, setCurrentPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [access, setAccess] = useState(false);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [alertStatus, setAlertStatus] = useState<string>('');
  const [emailError, setEmailError] = useState(false);
  const [employeeNumError, setEmployeeNumError] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {currentUser} = useUserContext();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setModal(true);
    setIsLoading(true);
    setEmailError(false);
    setEmployeeNumError(false);

    const newAlertMessages: string[] = [];

    if (!currentPass) {
      newAlertMessages.push("Password is required.");
    } else if (currentPass.length < 8) {
      newAlertMessages.push("Incorrect Password.");
    } else if (!/[A-Z]/.test(currentPass)) {
      newAlertMessages.push("Incorrect Password.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(currentPass)) {
      newAlertMessages.push("Incorrect Password.");
    }

    if (!confirmPass) {
      newAlertMessages.push("Confirm Password is required.");
    } else if (currentPass != confirmPass && currentPass) {
      newAlertMessages.push("Please make sure your passwords match.");
    }

    if (newAlertMessages.length > 0) {
      setAlertMessages(newAlertMessages);
      setAlertStatus("critical");
      setIsLoading(false);
      return;
    }

    try {
      const validationResponse = await api.post('/pass-reset/confirmpass', {
          password: currentPass,
          email: currentUser?.email
      });

      if (validationResponse.status !== 200) {
          setAlertMessages(["Invalid current password."]);
          setAlertStatus("critical");
          setIsLoading(false);
          return;
      }
    } catch (error) {
        setAlertMessages(["Incorrect Password."]);
        setAlertStatus("critical");
        setIsLoading(false);
        return;
    }

    try {
      const responses = await api.post('/password-reset/email', { 
          email:currentUser?.email , 
          employeeNum: currentUser?.empNum 
      });
      if (responses.status === 404) {
          setAlertMessages([responses.data.message]);
          setAlertStatus("warning");
      } else {
          setAccess(true);
          setAlertMessages(["Email sent successfully."]);
          setAlertStatus("success");
      }
    } catch (error) {
        setAlertMessages(["User not found."]);
        setAlertStatus("critical");
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
        <div className="flex flex-col items-end space-y-2">
          {alertMessages && alertMessages.map((msg, index) => (
            <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
              setAlertMessages(prev => prev.filter((_, i) => i !== index));
            }} />
          ))}
        </div>
      </div>
      {access &&
        <EmailSent onClose={setAccess} email={currentUser?.email} />
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
                Enter Current Password:
                <span className='text-[#B22222] font-bold'>*</span>
              </p>
              <div className='relative flex justify-center items-center'>
                <input
                  className={`${emailError ? 'text-[#B22222] focus:!outline-[#B22222] border-2 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} text-[20px] dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Current password"
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-[25px] -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? <VscEyeClosed size={30} className="text-black mr-2" /> : <VscEye size={30} className="text-black mr-2" />}
                </button>
              </div>
              <p className={`${employeeNumError ? 'text-[#B22222]' : 'dark:text-[#d1d1d1]'} text-[20px] flex items-center gap-2`}>
                <IoPerson />  
                Enter New Password
                <span className='text-[#B22222] font-bold'>*</span>
              </p>
              <div className='relative flex justify-center items-center'>
                <input
                  className={`${employeeNumError ? 'text-[#B22222] focus:!outline-[#B22222] border-2 border-[#B22222]' : 'border-[#B3B3B3]  focus:outline '} text-[20px] dark:bg-[#3C3C3C] dark:text-white bg-white h-10 3xl:h-12 w-full px-2 2xl:px-5 border-2 rounded-lg`}
                  type={showPassword2 ? "text" : "password"}
                  name="fname"
                  maxLength={13}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-[25px] -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? <VscEyeClosed size={30} className="text-black mr-2" /> : <VscEye size={30} className="text-black mr-2" />}
                </button>
              </div>
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