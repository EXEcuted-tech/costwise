"use client"
import { FaAt } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { MdLock, MdEmail } from "react-icons/md";
import Link from "next/link";
import { GiSmartphone } from "react-icons/gi";
import Spinner from "@/components/loaders/Spinner";
import { useState } from "react";
import api from "@/utils/api";
import EmailSent from "@/components/modals/EmailSent";
import Alert from "@/components/alerts/Alert";


function ForgotPassPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [onClose, setOnClose] = useState(false);
  const [email, setEmail] = useState('');
  const [employeeNum, setemployeeNum] = useState('');
  const [message, setMessage] = useState('');

  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [errors, setErrors] = useState(false);

  const [modal, setModal] = useState(false);
  const [access, setAccess] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setModal(true);
    setIsLoading(true);

    let errors: string[] = [];

    if (!email) {
      errors.push("Email address is required.");
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      errors.push("Invalid email address.");
    }
    if (!employeeNum) {
      errors.push("Employee number is required.");
    } else if (!/^\d{10}$/.test(employeeNum)) {
      errors.push("Invalid employee number.");
    }

    if (errors.length > 0) {
      setAlertMessages(errors);
      setIsLoading(false);
      return;
    }
    try {
      const response = await api.post('/password-reset/email', { email, employeeNum });
      setAccess(true);
      setMessage(response.data.message);
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const errorMessages = [];
        for (const key in error.response.data.errors) {
          if (error.response.data.errors.hasOwnProperty(key)) {
            errorMessages.push(...error.response.data.errors[key]);
          }
          if (key === 'email' || key === 'employeeNum') {
            setErrors(true);
          }
        }
        setAlertMessages(errorMessages);
      } else if (error.response && error.response.data.message) {
        setErrors(true);
        setAlertMessages([error.response.data.message]);
      }
    } finally {
      setIsLoading(false);
    }

  };
  return (
    <>
      {access &&
        <EmailSent onClose={setAccess} email={email} />
      }
      <div className="absolute top-0 right-0">
        {alertMessages && alertMessages.map((msg, index) => (
          <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
            setAlertMessages(prev => prev.filter((_, i) => i !== index));
          }} />
        ))}
      </div>
      <div className="font-lato animate-pop-out flex h-full max-h-[670px] z-10">
        <div className="bg-primary p-6 flex flex-col items-center rounded-l-3xl py-[90px] px-[45px] 2xl:p-[55px] !z-1">
          <img
            src="images/virginialogo.png"
            alt=""
            className="w-[70%] sm:w-[60%] xl:w-[70%] h-auto mt-[9.9px]"
          />
          <div className="w-[270px] 2xl:w-[330px] text-center mt-[9.9px]">
            <div className="border-y-3 border-solid py-[16px] w-full h-[84px] flex items-center justify-center">
              <p className="!text-[22.4px] 2xl:!text-[30px] !text-background">Forgot Password</p>
            </div>
            <p className="!text-[19px] 2xl:!text-[24px] !text-background font-light !leading-[28px] mt-[9.9px]">Enter pertinent details and retrieve your account.</p>
          </div>
          <div className="h-[35%] items-center flex flex-col w-[100%] justify-center text-[1em] xl:text-[1.3em] 2xl:h-[25%] gap-[5px] text-white 2xl:mt-[18px]">
            <div className="flex items-end justify-center h-[60%]">
              <p className="font-bold">Have Any Concerns?</p>
            </div>
            <div className="flex justify-center items-center h-[15%]">
              <GiSmartphone className="mr-[1%] text-[1em] xl:text-[1.4em]" />
              <p className="w-full">(032) 239-8800</p>
            </div>
            <div className="flex items-center justify-center h-[15%]">
              <p>customercare@virginiafood.com.ph</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-r-3xl w-[540px] 2xl:w-[660px] px-[30px] pt-[20px]">
          <Link href="/" className="">
            <GoArrowLeft className="text-[#6D6D6D] text-[50px] hover:opacity-75 hover:animate-shrink-in transition ease-in-out duration-200" />
          </Link>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-[20px] px-[25px]">
              <div className="flex flex-col items-center justify-center max-w-[315px] text-center">
                <MdLock className="text-[3.5em] sm:text-[4em] xl:text-[6em] 2xl:text-[7em] text-tertiary" />
                <p className="text-[39px] font-semibold">Forgot Password?</p>
                <p className="text-[18px]">No worries! Enter your email, and an administrator will reach on you.</p>
              </div>

              <div className="w-full">
                <div className="flex items-center">
                  <MdEmail className="mx-[1%] mr-[1.2%] lg:text-[1.6em] text-[1.3em]" />
                  <p className="text-[1.2em] text-[#828282]"
                  >Email Address</p>
                </div>
                <input className="text-[1.2em] font-semibold w-full rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%] h-[56px] mt-[5px]"
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex items-center mt-[15px]">
                  <FaAddressCard className="mx-[1%] mr-[1.2%] lg:text-[1.6em] text-[1.3em]" />
                  <p className="text-[1.2em] text-[#828282]">Employee Number</p>
                </div>
                <input className="text-[1.2em] font-semibold w-full rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%] h-[56px] mt-[5px]"
                  value={employeeNum}
                  onChange={(e) => setemployeeNum(e.target.value)}
                />
              </div>
              <div className="h-[15%] xl:h-[10%] items-end flex justify-center w-[100%]">
                <div className="relative inline-flex bg-primary overflow-hidden text-primary w-[50%] flex items-center justify-center rounded-[30px] h-[70%] xl:h-[70%] xl:w-[50%] cursor-pointer transition-all rounded hover:border-1 hover:border-primary group"
                >
                  <button className="flex items-center text-[1em] xl:text-[1.2em] 2xl:text-[1.5em] font-black" type='submit'>
                    <span className="w-full h-48 rounded bg-white absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>

                    <span className="relative flex justify-center items-center w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-primary">
                      {isLoading ?
                        <>
                          <Spinner />
                          <p className='ml-2'>Reset Password</p>
                        </>
                        :
                        'Reset Password'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassPage;