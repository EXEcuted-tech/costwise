import {
  FaArrowLeft,
  FaAt,
  FaMobileButton,
  FaRegEnvelope,
} from "react-icons/fa6";
import { MdLock, MdLockOutline } from "react-icons/md";
import Link from "next/link";
function ForgotPassPage() {
  return (
    <div className="flex items-center justify-center h-full z-1">
      {/* Left Div */}
      <div className="w-[40%] flex-row h-full p-[5%] text-white py-[10%] bg-primary rounded-s-3xl">
        <div className=" h-[30%] items-end flex justify-center w-[100%] pb-[3%]">
          <img
            src="images/virginialogo.png"
            alt=""
            className="lg:w-[70%] h-auto "
          />
        </div>
        <div className=" h-[20%] items-center flex-row w-[100%] justify-center lg:text-[2.2em] font-medium border-y-2 border-white">
          <div className="flex h-[50%] items-center justify-center pt-[2%]">
            <p>Forgot</p>
          </div>
          <div className="flex h-[50%] items-center justify-center pb-[2%]">
            <p>Password</p>
          </div>
        </div>
        <div className=" h-[15%] items-center flex-row justify-center w-[100%] lg:text-[1.1em] font-light">
          <div className=" h-[70%] items-center flex justify-center w-[100%] lg:text-[1.2em] font-normal">
            <p>Enter pertinent details and</p>
          </div>
          <div className=" h-[30%] items-center flex justify-center w-[100%] lg:text-[1.2em] font-normal">
            <p>retrieve your account.</p>
          </div>
        </div>
        <div className=" h-[25%] items-center flex-row w-[100%] justify-center text-[1.2em]">
          <div className="flex items-end justify-center h-[80%]">
            <p className="font-bold">Have Any Concerns?</p>
          </div>
          <div className="flex items-center justify-center h-[15%] mt-[2%]">
            <FaMobileButton className="mr-[1%] text-[1.3em]" />
            <p>09551957592</p>
          </div>
          <div className="flex items-center justify-center h-[15%] mt-[2%]">
            <FaAt className="mr-[1%] text-[1.3em]" />
            <p>example.virginia.com</p>
          </div>
        </div>
      </div>
      {/* Right Div */}
      <div className="w-[60%] flex-row h-full bg-white p-[2%] pb-[10%] text-tertiary rounded-e-3xl">
        <div className=" h-[10%] items-center flex justify-start w-[100%]">
          <Link href="/login">
            <button>
              <FaArrowLeft className="text-[#6D6D6D] text-[3em]" />
            </button>
          </Link>
        </div>
        <div className="h-[20%] flex items-center justify-center ">
          <MdLock className="text-[7em] text-tertiary" />
        </div>
        <div className="h-[10%] flex items-center justify-center ">
          <p className="text-[2em] font-bold">Forgot Password</p>
        </div>
        <div className="h-[10%] flex-row items-center justify-center ">
          <div className="flex h-[50%] items-center justify-center">
            <p className="text-[1.1em] ">
              No worries! Enter your email, and an{" "}
            </p>
          </div>
          <div className="flex h-[50%] items-center justify-center">
            <p className="text-[1.1em]">administrator will reach out to you.</p>
          </div>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%] px-[10%]">
          <FaRegEnvelope className="mx-[1%] text-[1.7em]" />
          <p className="text-[1.2em]">Email Address</p>
        </div>
        <div className=" h-[10%] flex w-[100%] px-[10%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9]"></input>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%] px-[10%]">
          <MdLockOutline className="mx-[1%] mb-[0.5%] text-[1.7em]" />
          <p className="text-[1.2em]">Employee Number</p>
        </div>
        <div className=" h-[10%] flex w-[100%] px-[10%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl bg-[#f3f3f3] border-2 border-[#d9d9d9]"></input>
        </div>
        <div className=" h-[20%] items-center flex justify-end w-[100%] pr-[10%] pb-[2%]">
          <div className="bg-primary text-white w-[30%] flex items-center justify-center rounded-2xl h-[40%]">
            <button className="text-[1em] font-semibold ">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassPage;
