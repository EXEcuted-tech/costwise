import React from "react";
import Link from "next/link";
function LogoutPage() {
  return (
    <div className="w-[100%] h-[100%] bg-[#A60000] flex-row rounded-3xl drop-shadow-4xl font-poppins">
      <div className="flex h-[60%] items-center bg-white justify-center rounded-t-3xl">
        <img
          src="images/statsimage.png"
          alt=""
          className="sm:w-[100%] md:w-[95%] 2xl:w-[90%] xl:w-[85%] 3xl:w-[80%] h-auto"
        />
      </div>

      <div className="bg-green h-[40%] w-[100%] flex-row items-center justify-center">
        <div className="flex items-center justify-center h-[40%] w-[100%] font">
          <p className="lg:text-[4.7em] md:text-[4.5em] sm:text-[4.3em] 2xl:text-[4.9em] 3xl:text-[5em] 4xl:text-[5em] font-bold">
            Logged Out!
          </p>
        </div>
        <div className="flex items-center justify-center h-[10%] w-[100%]">
          <p className="lg:text-[1.2em] md:text-[1.4em] sm:text-[1.2em] 2xl:text-[1.4em]">
            Thank you for using CostWise!
          </p>
        </div>
        <div className="flex items-center justify-center h-[10%] w-[100%]">
          <p className="lg:text-[1.2em] md:text-[1.4em] sm:text-[1.2em] 2xl:text-[1.4em]">
            To access the page, please log in again.
          </p>
        </div>
        <div className="flex items-center justify-center h-[30%] w-[100%] font">
          <div className="bg-[#FEF200] w-[50%] flex items-center justify-center h-[60%] rounded-3xl">
            <Link href="/login">
              <button className="2xl:text-[1.4em] lg:text-[1.2em] md:text-[1.4em] sm:text-[1.2em] text-[#A60000] font-black">
                Return to Login Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
