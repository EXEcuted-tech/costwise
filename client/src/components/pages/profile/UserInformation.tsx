import Link from "next/link";
import React, { useState } from "react";
import { MdModeEdit } from "react-icons/md";
import EditInformation from "./EditInformation";
import PasswordChangeDialog from "@/components/modals/SendEmailDialog";
import ConfirmChangeInfo from "@/components/modals/ConfirmChangeInfo";
import Spinner from "@/components/loaders/Spinner";
import { BsPersonLock } from "react-icons/bs";
import ViewUserRoles from "../user-management/ViewUserRoles";

type UserInformationProps = {
  isOpen: boolean;
  userAcc: any;
  isLoading: boolean;
};

const UserInformation: React.FC<UserInformationProps> = ({
  isOpen,
  userAcc,
  isLoading,
}) => {
  const [props, setProps] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showRolesSelectModal, setShowRolesSelectModal] = useState(false);

  const handleShowRolesSelectModal = () => {
    setShowRolesSelectModal(true);
  };

  return (
    <>
      {dialog && <PasswordChangeDialog setDialog={setDialog} />}
      {successModal && <ConfirmChangeInfo setSuccessModal={setSuccessModal} />}
      {showRolesSelectModal && (
        <ViewUserRoles
          onClose={() => setShowRolesSelectModal(false)}
          user_id={userAcc.user_id}
        />
      )}
      {props ? (
        <EditInformation
          setProps={setProps}
          setSuccessModal={setSuccessModal}
          setDialog={setDialog}
          isOpen={isOpen}
          userAcc={userAcc}
        />
      ) : (
        <div className="mx-8 2xl:mx-12 transition-all duration-400 ease-in-out">
          <div className="flex justify-between">
            <div
              className={`${
                isOpen
                  ? "text-[20px] 2xl:text-[32px]"
                  : "text-[22px] 2xl:text-[32px]"
              } flex text-[#8E8E8E] dark:text-[#d1d1d1] font-semibold mt-3 mb-2`}
            >
              User Information
              <button
                className={`${
                  isOpen
                    ? "text-[26px] 2xl:text-[36px]"
                    : "text-[30px] 2xl:text-[36px]"
                } px-3 text-black mr-2 mt-1 rounded-lg`}
                onClick={() => setProps(true)}
              >
                <MdModeEdit className="hover:text-primary hover:animate-shake-tilt dark:text-white hover:dark:text-primary" />
              </button>
            </div>
            {/* Roles */}
            <div className="flex items-center">
              <button
                className="flex items-center ml-12 bg-gray-100 dark:text-black rounded-lg p-2 px-3 border border-gray-300 hover:bg-gray-200 cursor-pointer transition-colors duration-300 ease-in-out"
                onClick={handleShowRolesSelectModal}
              >
                <BsPersonLock className="text-[1.7em] mr-2 text-[#5B5353]" />
                User Roles
              </button>
            </div>
          </div>

          <div
            className={`${
              isOpen
                ? "text-[13px] 2xl:text-[17px] 3xl:text-[22px] 4xl:text-[24px]"
                : "text-[18px] 2xl:text-[22px] 3xl:text-[24px]"
            } flex h-[310px] justify-center border-2 border-[#D9D9D9] py-5 text-black rounded-[15px] transition-all duration-400 ease-in`}
          >
            {isLoading ? (
              <div className="flex h-[260px] pt-[100px]">
                <Spinner className="!size-[50px]" />{" "}
              </div>
            ) : (
              <div className="flex w-full justify-center gap-[5%]">
                {/* 1st Col */}
                <div className="flex flex-col ml-3">
                  <div className="flex flex-col justify-start mb-4">
                    <p className="text-[#8E8E8E] font-semibold dark:text-[#d1d1d1]">First Name</p>
                    <p className="dark:text-white">{userAcc?.fName}</p>
                  </div>

                  <div className="flex flex-col justify-start mb-4">
                    <p className="text-[#8E8E8E] font-semibold dark:text-[#d1d1d1]">
                      Employee Number
                    </p>
                    <p className="dark:text-white">{userAcc?.employeeNum}</p>
                  </div>

                  <div className="flex flex-col justify-start mb-4">
                    <p className="text-[#8E8E8E] font-semibold dark:text-[#d1d1d1]">Phone Number</p>
                    <p className="dark:text-white">{userAcc?.phoneNum}</p>
                  </div>


                </div>

                {/* 2nd Col */}
                <div className="flex flex-col">
                  <div className="flex flex-col justify-start mb-4">
                    <p
                      className={`${
                        !userAcc?.mName ? "opacity-25 dark:text-[#d1d1d1]" : "text-[#808080] dark:text-[#d1d1d1]"
                      } font-semibold`}
                    >
                      Middle Name
                    </p>
                    <p className={`${!userAcc?.mName && "opacity-25 dark:text-white"} dark:text-white`}>
                      {!userAcc?.mName ? "N/A" : userAcc?.mName}
                    </p>
                  </div>

                  <div className="flex flex-col justify-start mb-4">
                    <p className="text-[#8E8E8E] font-semibold dark:text-[#d1d1d1]">Position</p>
                    <p className="dark:text-white">{userAcc?.position}</p>
                  </div>

                  <div className="flex flex-col justify-start mb-4">
                    <p className="text-[#8E8E8E] font-semibold dark:text-[#d1d1d1]">
                      Email Address
                    </p>
                    <p className="dark:text-white">{userAcc?.email}</p>
                  </div>

                </div>

                {/* 3rd Col */}
                <div className="flex flex-col">
                  <div className="flex flex-col justify-start mb-4">
                    <p className="text-[#8E8E8E] font-semibold dark:text-[#d1d1d1]">Last Name</p>
                    <p className="dark:text-white">{userAcc?.lName}</p>
                  </div>

                  <div className="flex flex-col justify-start mb-4">
                    <p className="text-[#8E8E8E] font-semibold dark:text-[#d1d1d1]">Department</p>
                    <p className="dark:text-white">{userAcc?.dept}</p>
                  </div>
                </div>

                {/* 4th Col */}
                <div className="flex flex-col mr-6">
                  <div className="flex flex-col justify-start mb-4">
                      <p
                        className={`${
                          !userAcc?.suffix ? "opacity-25 dark:text-[#d1d1d1]" : "text-[#808080] dark:text-[#d1d1d1]"
                        } font-semibold`}
                      >
                        Suffix
                      </p>
                      <p className={`${!userAcc?.suffix && "opacity-25 dark:text-white"} dark:text-white`}>
                        {!userAcc?.suffix ? "N/A" : userAcc?.suffix}
                      </p>
                    </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserInformation;
