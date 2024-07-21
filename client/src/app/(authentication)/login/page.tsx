import { FaAt, FaMobileButton, FaRegEnvelope } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";
function LoginPage() {
  return (
    <div className="flex-row lg:flex items-center justify-center h-full z-1">
      {/* Left Div */}
      <div className="lg:w-[40%] lg:h-full flex-row  text-primary lg:px-[5%] p-[10%] 2xl:p-[5%] w-full h-[50%]">
        <div className="bg-white h-[30%] items-end flex justify-center w-[100%] pb-[3%]">
          <img
            src="images/virginialogo.png"
            alt=""
            className="w-[70%] sm:w-[60%] xl:w-[70%]  h-auto "
          />
        </div>
        <div className="bg-white items-center flex w-[100%] justify-center text-[1.2em]  font-medium border-y-2 border-primary h-[20%] lg:h-[15%] xl:text-[1.4em] 2xl:text-[1.6em]">
          <p className="flex-col justify-center">
            Welcome to <strong>CostWise</strong>
          </p>
        </div>
        <div className=" h-[15%] items-center flex-row justify-center w-[100%] text-[1em] xl:text-[16px] 2xl:text-[1.3em] font-light">
          <div className=" h-[70%] items-center flex justify-center w-[100%] font-light">
            <p className="flex-wrap justify-center">
              Streamline your costs with CostWise
            </p>
          </div>
          <div className=" h-[30%] items-center flex justify-center w-[100%] font-light 2xl:pb-[5%]">
            <p className="flex items-center justify-center">Log In Now!</p>
          </div>
        </div>
        <div className="bg-white h-[35%] items-center flex-row w-[100%] justify-center text-[1em] 2xl:text-[1.3em] 2xl:h-[40%]">
          <div className="flex items-end justify-center h-[60%]">
            <p className="font-bold">Have Any Concerns?</p>
          </div>
          <div className="flex items-center justify-center h-[15%]">
            <FaMobileButton className="mr-[1%]" />
            <p>09551957592</p>
          </div>
          <div className="flex items-center justify-center h-[15%]">
            <FaAt className="mr-[1%]" />
            <p>example.virginia.com</p>
          </div>
        </div>
      </div>
      {/* Right Div */}
      <div className="lg:w-[60%] flex-row lg:h-full bg-primary p-[5%] py-[10%] text-white rounded-b-3xl lg:rounded-e-3xl lg:rounded-none drop-shadow-3xl h-[50%] w-full 2xl:p-[5%]">
        <div className="h-[25%] 2xl:h-[20%] items-center 2xl:items-end flex justify-center w-[100%]">
          <p className=" lg:text-[2.5em] 2xl:text-[3em] font-semibold text-[1.6em]">
            Login To Your Account
          </p>
        </div>
        <div className="h-[10%] items-end flex justify-start w-[100%] 2xl:pb-[1%] pb-[1%]">
          <FaRegEnvelope className="mx-[1%] lg:text-[1.6em] text-[1.3em]" />
          <p className="text-[1em] 2xl:text-[1.2em]">Email Address</p>
        </div>
        <div className=" h-[10%] flex w-[100%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-2xl"></input>
        </div>
        <div className="h-[15%] 2xl:h-[10%] items-end flex justify-start w-[100%] 2xl:pb-[1%] pb-[1%]">
          <MdLockOutline className="mx-[1%] mb-[0.5%] lg:text-[1.6em] text-[1.3em]" />
          <p className="text-[1.2em]">Password</p>
        </div>
        <div className=" h-[10%] flex w-[100%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-2xl"></input>
        </div>
        <div className=" h-[10%] items-center flex justify-end w-[100%] pr-[2%] pb-[2%]">
          <Link href="/forgotpass">
            <button className="text-[1em] font-extralight">
              Forgot password?
            </button>
          </Link>
        </div>
        <div className=" 2xl:h-[20%] items-end flex justify-center w-[100%] pr-[2%] pb-[2%]">
          <div className="bg-white text-primary w-[50%] flex items-center justify-center rounded-2xl h-[50%] md:h-[10%] 2xl:h-[35%] 2xl:w-[35%]">
            <button className=" text-[1em] 2xl:text-[1.6em] font-semibold ">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
