import { FaAt } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { MdLock, MdEmail } from "react-icons/md";
import Link from "next/link";
import { GiSmartphone } from "react-icons/gi";

function ForgotPassPage() {
  return (
    <div className="flex-row lg:flex items-center justify-center h-full z-1 bg-primary rounded-3xl">
      {/* Left Div */}
      <div className="lg:w-[40%] lg:h-full flex-row  text-white lg:px-[5%] p-[10%] 2xl:p-[5%] w-full h-[50%] rounded-s-3xl lg:rounded-t-3xl lg:rounded-none">
        <div className="bg-primary h-[30%] items-end flex justify-center w-[100%] pb-[3%]">
          <img
            src="images/virginialogo.png"
            alt=""
            className="w-[70%] sm:w-[60%] xl:w-[70%]  h-auto "
          />
        </div>
        <div className="bg-primary items-center flex w-[100%] justify-center text-[1.2em]  font-medium border-y-2 border-white h-[20%] lg:h-[15%] xl:text-[1.6em]">
          <div className="flex h-[50%] items-center justify-center font-bold">
            <p>Forgot Password</p>
          </div>
        </div>
        <div className=" h-[15%] items-center flex-row justify-center w-[100%] text-[1em] xl:text-[19px] 2xl:text-[24px] font-light">
          <div className=" h-[50%] items-center flex justify-center w-[100%] font-light">
            <p>Enter pertinent details and</p>
          </div>
          <div className="h-[30%] items-center flex justify-center w-[100%] font-light 2xl:pb-[5%]">
            <p>retrieve your account.</p>
          </div>
        </div>
        <div className="bg-primary h-[35%] items-center flex flex-col w-[100%] justify-center text-[1em] xl:text-[1.3em] 2xl:h-[25%] gap-[5px]">
          <div className="flex items-end justify-center h-[65%]">
            <p className="font-bold">Have Any Concerns?</p>
          </div>
          <div className="flex items-center justify-center h-[15%]">
            <GiSmartphone className="mr-[1%]" />
            <p>09551957592</p>
          </div>
          <div className="flex items-center justify-center h-[15%]">
            <FaAt className="mr-[1%]" />
            <p>example.virginia.com</p>
          </div>
        </div>
      </div>
      {/* Right Div */}
      <div className="lg:w-[60%] flex-row lg:h-full bg-white p-[5%] 2xl:py-[5%] px-[5%] xl:px-0 text-tertiary rounded-b-3xl lg:rounded-e-3xl lg:rounded-none drop-shadow-3xl h-[50%] w-full 2xl:p-[5%]">
        <div className=" h-[5%] items-center flex justify-start w-[100%]">
          <Link href="/login" className="">
            <GoArrowLeft className="text-[#6D6D6D] text-[3em] xl:text-[4em] xl:ml-[50%] 2xl:ml-0 hover:opacity-75 hover:animate-shrink-in transition ease-in-out duration-200" />
          </Link>
        </div>
        <div className="h-[15%] 2xl:h-[20%] flex items-center justify-center ">
          <MdLock className="text-[3.5em] sm:text-[4em] xl:text-[6em] 2xl:text-[7em] text-tertiary" />
        </div>
        <div className="h-[12%] xl:h-[10%] flex items-center justify-center">
          <p className=" lg:text-[2.7em] 2xl:text-[3em] font-semibold text-[1.6em]">
            Forgot Password
          </p>
        </div>
        <div className="h-[10%] flex-row items-center justify-center">
          <div className="flex h-[50%] items-center justify-center">
            <p className="text-[1em] xl:text-[1.1em]">
              No worries! Enter your email, and an
            </p>
          </div>
          <div className="flex h-[50%] items-center justify-center">
            <p className="text-[1em] xl:text-[1.1em]">
              administrator will reach out to you.
            </p>
          </div>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%] px-[10%]">
          <div className="flex items-center w-full">
            <MdEmail className="mx-[1%]  text-[1.3em] lg:text-[1.6em]" />
            <p className="text-[1em] xl:text-[20px] mb-[1px]">Email Address</p>
          </div>
        </div>
        <div className=" h-[10%] flex w-[100%] px-[10%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%]"></input>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%] px-[10%]">
          <div className="flex items-center w-full">
            <FaAddressCard className="mx-[1%] text-[1.3em] lg:text-[1.6em]" />
            <p className="text-[1em] xl:text-[20px] mb-[1px]">Employee Number</p>
          </div>
        </div>
        <div className=" h-[10%] flex w-[100%] px-[10%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%]"></input>
        </div>
        <div className=" h-[21%] items-center flex justify-end w-[100%] pr-[10%] pb-[5%]">
          <div className="relative inline-flex bg-primary overflow-hidden text-white w-[50%] sm:w-[40%] flex items-center justify-center rounded-[30px] h-[50%] xl:h-[40%] cursor-pointer transition-all rounded hover:border-1 hover:border-primary hover:!text-primary group">
            <button className="text-[1em] xl:text-[1.2em] 2xl:text-[1.4em] font-black">
              <span className="w-full h-48 rounded bg-white absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-primary">Reset Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassPage;