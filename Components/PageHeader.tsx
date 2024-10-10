import React from "react";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { UserIcon } from "./Shared/Icons";
import { useMobile } from "@/hooks/useMobile";

interface PageHeaderProps {
  pageTitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle }) => {
  const { user } = useAuth();
  const { isMobile } = useMobile();

  return (
    <div className="z-30 flex w-full flex-col">
      <div
        className="flex items-center justify-between bg-white py-[25.5px] text-[#222222] md:pb-[23px] md:pl-[39.71px] md:pr-[41px] md:pt-[32px]"
        style={
          isMobile ?
            { boxShadow: "0px 2px 12px 0px rgba(58, 77, 233, 0.2)" }
          : { boxShadow: "0px 2px 12px 0px #00000014" }
        }
      >
        <h1 className="mx-auto text-xl font-normal md:m-0 md:mx-0 md:text-2xl">{pageTitle}</h1>

        <div className="hidden md:block">
          <div className="flex items-center justify-center">
            {user?.blockchainAddress ?
              <Link href={"/my-account"} className="absolute left-[19px] items-center gap-[14px] md:relative md:flex">
                <div className="h-6 w-6">
                  <UserIcon />
                </div>
                <p className="max-w-[300px] overflow-hidden truncate text-ellipsis whitespace-nowrap">{user?.name}</p>
              </Link>
            : <Link href={"/auth"} className="absolute left-[19px] items-center gap-[14px] md:relative md:flex">
                <div className="h-6 w-6">
                  <UserIcon />
                </div>
                <p>Login or Register</p>
              </Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
