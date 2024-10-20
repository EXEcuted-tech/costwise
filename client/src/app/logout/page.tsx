"use client"
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LogoutPage() {
  const router = useRouter();
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
          <p className="text-[5.5vh] 2xl:text-[7.5vh] font-semibold">
            Logged Out!
          </p>
        </div>
        <div className="flex pb-[1%] items-center justify-center h-[10%] w-[100%] font-poppins">
          <p className="text-10 sm:text-[1.1em] md:text-[1.3em] 2xl:text-[1.5em]">
            Thank you for using CostWise!
          </p>
        </div>
        <div className="flex items-center justify-center h-[10%] w-[100%] font-poppins">
          <p className="text-10 sm:text-[1.1em] md:text-[1.3em] 2xl:text-[1.5em]">
            To access the page, please log in again.
          </p>
        </div>
        <div className="flex items-center justify-center h-[30%] w-[100%] font">
          <div className="bg-secondary w-[50%] flex items-center justify-center h-[60%] rounded-3xl cursor-pointer overflow-hidden  transition-transform transform hover:scale-105"
          onClick={() => router.push('/')}>
            <button className="text-[1.4em] 2xl:text-[1.6em] text-[#A60000] font-bold">
              Return to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
