import { FaAt } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { MdLock, MdEmail } from "react-icons/md";
import Link from "next/link";
import { GiSmartphone } from "react-icons/gi";

function ForgotPassPage() {
  return (
    <div className="flex h-full max-h-[670px] z-10">
      <div className="bg-primary p-6 flex flex-col items-center rounded-l-3xl py-[90px] px-[45px] 2xl:p-[55px] !z-1">
        <img
          src="images/virginialogo.png"
          alt=""
          className="w-[70%] sm:w-[60%] xl:w-[70%] h-auto mt-[9.9px]"
        />
        <div className="w-[270px] 2xl:w-[330px] text-center mt-[9.9px]">
          <div className="border-y-3 border-solid py-[16px] w-full h-[84px] flex items-center justify-center">
            <p className="!text-[22.4px] 2xl:!text-[26px] !text-background">Forgot Password</p>
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
            <FaAt className="mr-[1%]" />
            <p>example.virginia.com</p>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-r-3xl w-[540px] 2xl:w-[660px] px-[30px] pt-[20px]">
        <Link href="/" className="">
          <GoArrowLeft className="text-[#6D6D6D] text-[50px] hover:opacity-75 hover:animate-shrink-in transition ease-in-out duration-200" />
        </Link>
        <div className="flex flex-col items-center justify-center gap-[20px] px-[25px]">
          <div className="flex flex-col items-center justify-center max-w-[315px] text-center">
            <MdLock className="text-[3.5em] sm:text-[4em] xl:text-[6em] 2xl:text-[7em] text-tertiary" />
            <p className="text-[39px] font-semibold">Forgot Password?</p>
            <p className="text-[18px]">No worries! Enter your email, and an administrator will reach on you.</p>
          </div>
          <div className="w-full">
            <div className="flex items-center">
              <MdEmail className="mx-[1%] mr-[1.2%] lg:text-[1.6em] text-[1.3em]"/>
              <p className="text-[1.2em] text-[#6D6D6D]">Email Address</p>
            </div>
            <input className="text-[1.2em] font-semibold w-full rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%] h-[56px] mt-[5px]"/>
            <div className="flex items-center mt-[15px]">
              <FaAddressCard className="mx-[1%] mr-[1.2%] lg:text-[1.6em] text-[1.3em]"/>
              <p className="text-[1.2em] text-[#6D6D6D]">Employee Number</p>
            </div>
            <input className="text-[1.2em] font-semibold w-full rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%] h-[56px] mt-[5px]"/>
          </div>
          <div className="h-[15%] xl:h-[10%] items-end flex justify-center w-[100%]">
            <div className="relative inline-flex bg-primary overflow-hidden text-white w-[50%] flex items-center justify-center rounded-[30px] h-[70%] xl:h-[70%] xl:w-[50%] cursor-pointer transition-all rounded hover:border-1 hover:border-white group">
              <button className="flex items-center text-[1em] xl:text-[1.2em] 2xl:text-[1.4em] font-black py-[5px]">
                <span className="w-full h-48 rounded bg-white absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                <span className="relative w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-primary">
                  Reset Password
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassPage;