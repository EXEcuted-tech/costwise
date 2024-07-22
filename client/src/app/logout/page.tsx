import React from "react";
import Link from "next/link";
function LogoutPage() {
  return (
    <div className="w-[100%] h-[100%] bg-[#A60000] flex-row rounded-3xl drop-shadow-4xl">
      <div className="flex h-[60%] items-center bg-white justify-center rounded-t-3xl">
        <img
          src="images/statsimage.png"
          alt="Logout Image"
          className="h-auto max-h-[95%]"
        />
      </div>

      <div className="bg-green h-[40%] w-[100%] flex-row items-center justify-center text-white">
        <div className="flex items-center justify-center h-[40%] w-[100%] max-h-[80%]">
          <p className="text-[6vh] md:text-[7vh] lg:text-[8vh] font-semibold">
            Logged Out!
          </p>
        </div>
        <div className="flex items-center justify-center h-[10%] w-[100%] font-poppins">
          <p className="text-10 sm:text-[1.2rem] md:text-[1.4em] lg:text-[1.6em]">
            Thank you for using CostWise!
          </p>
        </div>
        <div className="flex items-center justify-center h-[10%] w-[100%] font-poppins">
          <p className="text-10 sm:text-[1.2em] md:text-[1.4em] lg:text-[1.6em]">
            To access the page, please log in again.
          </p>
        </div>
        <div className="flex items-center justify-center h-[30%] w-[100%] font">
          <div className="bg-secondary w-[50%] flex items-center justify-center h-[60%] rounded-3xl cursor-pointer overflow-hidden transition">
            <Link href="/login">
              <button className="text-[1em] sm:text-[1.2em] md:text-[1.4em] lg:text-[1.6em] text-[#A60000] font-bold transition-transform transform hover:scale-105">
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
