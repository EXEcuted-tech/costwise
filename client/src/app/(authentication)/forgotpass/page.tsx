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
          <Link href="/login">
            <button>
              <GoArrowLeft className="text-[#6D6D6D] text-[3em] xl:text-[4em] xl:ml-[50%] 2xl:ml-0  hover:xl:text-[4.5em] transition" />
            </button>
          </Link>
        </div>
        <div className="h-[15%] 2xl:h-[20%] flex items-center justify-center ">
          <MdLock className="text-[3.5em] sm:text-[4em] xl:text-[7em] 2xl:text-[8em] text-tertiary" />
        </div>
        <div className="h-[12%] xl:h-[10%] flex items-center justify-center">
          <p className=" lg:text-[2.7em] 2xl:text-[3em] font-semibold text-[1.6em]">
            Forgot Password
          </p>
        </div>
        <div className="h-[10%] flex-row items-center justify-center">
          <div className="flex h-[50%] items-center justify-center">
            <p className="text-[1em] xl:text-[1.2em]">
              No worries! Enter your email, and an
            </p>
          </div>
          <div className="flex h-[50%] items-center justify-center">
            <p className="text-[1em] xl:text-[1.2em]">
              administrator will reach out to you.
            </p>
          </div>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%] px-[10%]">
          <MdEmail className="mx-[1%] lg:text-[1.6em] text-[1.3em] xl:mb-[1%]" />
          <p className="text-[1em] xl:text-[24px]">Email Address</p>
        </div>
        <div className=" h-[10%] flex w-[100%] px-[10%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%]"></input>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%] px-[10%]">
          <FaAddressCard className="mx-[1%] lg:text-[1.6em] text-[1.3em] xl:mb-[1%]" />
          <p className="text-[1em] xl:text-[24px]">Employee Number</p>
        </div>
        <div className=" h-[10%] flex w-[100%] px-[10%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9] pr-[5%] text-tertiary px-[5%]"></input>
        </div>
        <div className=" h-[20%] items-center flex justify-end w-[100%] pr-[10%] pb-[2%]">
          <div className="bg-primary text-white flex items-center justify-center rounded-3xl h-[50%] xl:h-[40%] w-[50%] sm:w-[40%] transition hover:bg-white hover:border-2 hover:border-primary hover:text-primary cursor-pointer font-extrabold">
            <button className="text-[1em] xl:text-[1.3em]">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassPage;
