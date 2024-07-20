import { FaAt, FaMobileButton, FaRegEnvelope } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";
function LoginPage() {
  return (
    <div className="flex items-center justify-center h-full z-1">
      {/* Left Div */}
      <div className="w-[40%] flex-row h-full p-[5%] text-primary py-[10%]">
        <div className="bg-white h-[30%] items-end flex justify-center w-[100%] pb-[3%]">
          <img
            src="images/virginialogo.png"
            alt=""
            className="lg:w-[70%] h-auto "
          />
        </div>
        <div className="bg-white h-[15%] items-center flex w-[100%] justify-center lg:text-[1.8em] font-medium border-y-2 border-primary">
          <p>
            Welcome to <strong>CostWise</strong>
          </p>
        </div>
        <div className=" h-[10%] items-center flex-row justify-center w-[100%] lg:text-[1.1em] font-light">
          <div className=" h-[70%] items-center flex justify-center w-[100%] lg:text-[1em] 2xl:text-[1em] font-light">
            <p>Streamline your costs with CostWise</p>
          </div>
          <div className=" h-[30%] items-center flex justify-center w-[100%] lg:text-[1em] font-light">
            <p>Log In Now!</p>
          </div>
        </div>
        <div className="bg-white h-[45%] items-center flex-row w-[100%] justify-center text-[1.2em]">
          <div className="flex items-end justify-center h-[80%]">
            <p className="font-bold">Have Any Concerns?</p>
          </div>
          <div className="flex items-center justify-center h-[15%]">
            <FaMobileButton className="mr-[1%] text-[1.3em]" />
            <p>09551957592</p>
          </div>
          <div className="flex items-center justify-center h-[15%]">
            <FaAt className="mr-[1%] text-[1.3em]" />
            <p>example.virginia.com</p>
          </div>
        </div>
      </div>
      {/* Right Div */}
      <div className="w-[60%] flex-row h-full bg-primary p-[5%] py-[10%] text-white rounded-e-3xl drop-shadow-3xl">
        <div className=" h-[20%] items-end flex justify-center w-[100%]">
          <p className="text-[2.5em] font-semibold">Login To Your Account</p>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%]">
          <FaRegEnvelope className="mx-[1%] text-[1.7em]" />
          <p className="text-[1.2em]">Email Address</p>
        </div>
        <div className=" h-[10%] flex w-[100%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl"></input>
        </div>
        <div className=" h-[10%] items-end flex justify-start w-[100%] pb-[1%]">
          <MdLockOutline className="mx-[1%] mb-[0.5%] text-[1.7em]" />
          <p className="text-[1.2em]">Password</p>
        </div>
        <div className=" h-[10%] flex w-[100%]">
          <input className="text-[1.2em] font-semibold w-[100%] rounded-xl"></input>
        </div>
        <div className=" h-[10%] items-center flex justify-end w-[100%] pr-[2%] pb-[2%]">
          <Link href="/forgotpass">
            <button className="text-[1em] font-extralight">
              Forgot password?
            </button>
          </Link>
        </div>
        <div className=" h-[20%] items-end flex justify-center w-[100%] pr-[2%] pb-[2%]">
          <div className="bg-white text-primary w-[30%] flex items-center justify-center rounded-2xl h-[35%]">
            <button className="text-[1em] font-semibold ">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
