import React from "react";
import Link from "next/link";
function LogoutPage() {
  return (
    <div className="w-[100%] h-[100%] bg-[#A60000] flex-row rounded-3xl drop-shadow-4xl">
      <div className="flex h-[60%] items-center bg-white justify-center rounded-t-3xl">
        <img
          src="images/statsimage.png"
          alt=""
          className="sm:w-[100%] md:w-[95%] lg:w-[90%] xl:w-[85%] h-auto"
        />
      </div>

      <div className="bg-green h-[40%] w-[100%] flex-row items-center justify-center">
        <div className="flex items-center justify-center h-[40%] w-[100%] font">
          <p className="text-[5em]">Logged Out!</p>
        </div>
        <div className="flex items-center justify-center h-[10%] w-[100%] font">
          <p className="text-[1.6em]">Thank you for using CostWise!</p>
        </div>
        <div className="flex items-center justify-center h-[10%] w-[100%] font">
          <p className="text-[1.6em]">
            To access the page, please log in again.
          </p>
        </div>
        <div className="flex items-center justify-center h-[30%] w-[100%] font">
          <div className="bg-[#FEF200] w-[50%] flex items-center justify-center h-[60%] rounded-3xl">
            <Link href="/login">
              <button className="text-[1.6em] text-[#A60000] font-bold">
                Return to login Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
