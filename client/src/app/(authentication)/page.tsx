"use client"
import { FaAt, FaRegEnvelope } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";
import { GiSmartphone } from "react-icons/gi";
import config from "@/server/config";
import { useRouter } from 'next/navigation';
import api from "@/utils/api";
import { SetStateAction, useEffect, useState, KeyboardEvent } from "react";
import { useUserContext } from "@/contexts/UserContext";
import Alert from "@/components/alerts/Alert";
import Spinner from "@/components/loaders/Spinner";
import { isTokenExpired, refreshToken } from "@/utils/expirationCheck";
import { removeTokens } from "@/utils/removeTokens";

function LoginPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

    // if (tokenExpiresAt && isTokenExpired()) {
    //   try {
    //     const refreshed = refreshToken();
    //     if (!refreshed) {
    //       removeTokens();
    //       router.push('/');
    //     }
    //   } catch (error) {
    //     console.error('Failed to refresh token:', error);
    //   }
    // }
    
    if (accessToken && tokenExpiresAt) {
      const expiresAt = new Date(tokenExpiresAt);
      // console.log(expiresAt, new Date(), expiresAt > new Date());
      if (expiresAt > new Date()) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError(false);
    setEmailError(false);
    setAlertMessages([]);

    try {
      const response = await api.post('/login', {
        "email_address": email,
        password
      });

      if (response.status === 200) {
        const { access_token, refresh_token, access_token_expiration } = response.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('tokenExpiresAt', access_token_expiration);

        const user = await api.get('/user');

        const currentUs = {
          userId: user.data.user_id,
          empNum: user.data.employee_number,
          name: user.data.first_name, // Can be full name if needed najud
          email: user.data.email_address,
          userType: user.data.user_type,
          displayPicture: user.data.display_picture,
          roles: user.data.sys_role
        }

        setCurrentUser(currentUs);
        console.log(currentUser?.email);
        localStorage.setItem('currentUser', JSON.stringify(currentUs));

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

        router.push('/dashboard');
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const errorMessages = [];
        for (const key in error.response.data.errors) {
          if (error.response.data.errors.hasOwnProperty(key)) {
            errorMessages.push(...error.response.data.errors[key]);
          }
          if (key === 'email_address') {
            setEmailError(true);
          } else if (key === 'password') {
            setPasswordError(true);
          }
        }
        setAlertMessages(errorMessages);
      } else if (error.response && error.response.data.message) {
        setEmailError(true);
        setPasswordError(true);
        setAlertMessages([error.response.data.message]);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="absolute top-0 right-0">
        {alertMessages && alertMessages.map((msg, index) => (
          <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
            setAlertMessages(prev => prev.filter((_, i) => i !== index));
          }} />
        ))}
      </div>
      <div className="animate-pop-out relative z-10 flex-col h-[670px] w-[350px] sm:w-[500px] lg:w-[900px] 2xl:w-[1100px] rounded-3xl bg-white font-lato drop-shadow-3xl">

        <div className="flex-row lg:flex items-center justify-center h-full z-1">
          {/* Left Div */}
          <div className="lg:w-[40%] lg:h-full flex-row  text-primary lg:px-[5%] p-[10%] 2xl:p-[5%] w-full h-[50%]">
            <div className="bg-white h-[30%] items-end flex justify-center w-[100%] 2xl:mt-[3%]">
              <img
                src="images/virginialogo.png"
                alt=""
                className="w-[70%] sm:w-[60%] xl:w-[70%]  h-auto "
              />
            </div>
            <div className="bg-white items-center flex w-[100%] justify-center text-[1.4em] mt-[3%] font-medium border-y-2 border-primary h-[20%] lg:h-[15%] 2xl:text-[1.6em]">
              <p className="flex-col justify-center">
                Welcome to <strong>CostWise</strong>
              </p>
            </div>
            <div className=" h-[15%] items-center flex-row justify-center w-[100%] text-[1em] xl:text-[19px] 2xl:text-[24px] font-light">
              <div className=" h-[50%] items-center flex justify-center w-[100%] font-light">
                <p className="flex-wrap justify-center">
                  Streamline your costs with ease.
                </p>
              </div>
              <div className=" h-[30%] items-center flex justify-center w-[100%] font-light 2xl:pb-[5%]">
                <p className="flex items-center justify-center">Log In Now!</p>
              </div>
            </div>
            <div className="bg-white h-[35%] items-center flex flex-col w-[100%] justify-center text-[1em] xl:text-[1.3em] 2xl:h-[25%] gap-[5px]">
              <div className="flex items-end justify-center h-[60%]">
                <p className="font-bold">Have Any Concerns?</p>
              </div>
              <div className="flex justify-center items-center h-[15%]">
                <GiSmartphone className="mr-[1%] text-[1em] xl:text-[1.4em]" />
                <p className="w-full">(032) 239-8800</p>
              </div>
              <div className="flex items-center justify-center h-[15%]">
                <FaAt className="mr-[1%]" />
                <p>customercare@virginiafood.com.ph</p>
              </div>
            </div>
          </div>
          {/* Right Div */}
          <div className="lg:w-[60%] flex-row lg:h-full bg-primary p-[5%] py-[10%] text-white rounded-b-3xl lg:rounded-e-3xl lg:rounded-none drop-shadow-3xl h-[50%] w-full 2xl:p-[5%]">
            <div className="h-[25%] 2xl:h-[20%] items-center 2xl:items-end flex justify-center w-[100%] my-[4%]">
              <p className=" lg:text-[2.5em] 2xl:text-[3em] font-semibold text-[1.6em]">
                Login To Your Account
              </p>
            </div>
            <div className="h-[10%] items-end flex justify-start w-[100%] 2xl:pb-[1%] pb-[1%]">
              <div className="flex items-center w-full">
                <FaRegEnvelope className="mx-[1%] mr-[1.2%] lg:text-[1.6em] text-[1.3em]" />
                <p className="text-[1em] xl:text-[1.2em]">Email Address</p>
              </div>
            </div>
            <div className={`h-[10%] flex w-[100%]`}>
              <input
                type="email"
                className={`${emailError ? 'text-[#ff2c2c] focus:!outline-[#ff2c2c] border-3 border-[#ff2c2c]' : 'text-black'} text-[1.2em] font-semibold w-[100%] rounded-2xl px-[5%]`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="h-[15%] 2xl:h-[10%] items-end flex justify-start w-[100%] 2xl:pb-[1%] pb-[1%]">
              <div className="flex items-center w-full">
                <MdLockOutline className="mx-[1%] mb-[0.5%] lg:text-[1.6em] text-[1.3em]" />
                <p className="text-[1em] xl:text-[1.2em]">Password</p>
              </div>
            </div>
            <div className=" h-[10%] flex w-[100%]">
              <input
                type="password"
                className={`${passwordError ? 'text-[#ff2c2c] focus:!outline-[#ff2c2c] border-3 border-[#ff2c2c]' : 'text-black'} text-[1.2em] font-semibold w-[100%] rounded-2xl px-[5%]`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className=" h-[10%] items-center flex justify-end w-[100%] pr-[2%] pb-[2%]">
              <Link href="/forgotpass">
                <button className="text-[1.1em] font-extralight hover:opacity-65">
                  Forgot password?
                </button>
              </Link>
            </div>
            <div className="h-[15%] xl:h-[10%] items-end flex justify-center w-[100%]">
              <div className="relative inline-flex bg-white overflow-hidden text-primary w-[50%] flex items-center justify-center rounded-[30px] h-[70%] xl:h-[70%] xl:w-[50%] cursor-pointer transition-all rounded hover:border-1 hover:border-white group"
                onClick={handleSubmit}
                tabIndex={0}
                role="button"
              >
                <button className="flex items-center text-[1em] xl:text-[1.2em] 2xl:text-[1.4em] font-black">
                  <span className="w-full h-48 rounded bg-primary absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                  {isLoading && <Spinner className="group-hover:!text-white mr-1 !size-[25px]" />}
                  <span className="relative w-full text-left text-primary transition-colors duration-300 ease-in-out group-hover:text-white">
                    Sign In
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
