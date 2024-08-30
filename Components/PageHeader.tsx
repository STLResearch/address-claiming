import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { UserIcon } from "./Shared/Icons";
import {AccountNotificationIcon, ChevronRightIcon} from "./Icons";
import { useState } from "react";
import { useMobile } from "@/hooks/useMobile";
import VerificationNotification from "./Notification";

interface PageHeaderProps {
  pageTitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle }) => {
  const { user } = useAuth();
  const { isMobile } = useMobile();
  

  return (
    <div className=" w-full z-30 flex flex-col">
      <div
        className="flex items-center justify-between py-[25.5px] md:pb-[23px] md:pt-[32px] md:pl-[39.71px] md:pr-[41px] text-[#222222] bg-white"
        style={isMobile ?{ boxShadow: "0px 2px 12px 0px rgba(58, 77, 233, 0.2)" }:{boxShadow: "0px 2px 12px 0px #00000014"}}
      >
    {isMobile ? (
        <div className="flex items-center justify-center  mx-auto gap-4">
          <VerificationNotification />
          <p className="text-xl font-normal">
            {pageTitle}
          </p>
        </div>
    ) : (
      <p className="text-2xl font-medium m-0">
      {pageTitle}
     </p>
    )}
    <div className=" md:block hidden">
      <div className=" flex  justify-center items-center">
        <div className="relative  border-r-2 border-gray-300 pr-4">
        <VerificationNotification />
         </div>
      
          {
              user?.blockchainAddress?<Link href={'/my-account'} className="gap-[14px] items-center absolute md:flex md:relative left-[19px]">
                  <div className="w-6 h-6  "><UserIcon /></div>
                  <p className=''>{user?.name}</p>
              </Link>
              :
              <Link href={'/auth'} className="gap-[14px] items-center absolute md:flex md:relative left-[19px]">
                  <div className="w-6 h-6"><UserIcon /></div>
                  <p className=''>Login or Register</p>
              </Link>
          }
       </div>
       </div>
      </div>
      </div>
  );
};
export default PageHeader;