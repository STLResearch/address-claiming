import React, { ReactNode, useEffect, useRef } from "react";
import { DashboardIcon, DroneIcon, HelpQuestionIcon, LogoutIcon, MapIcon, ShoppingBagsIcon, WalletIcon } from "./Icons";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EarthIconsidebar, GiftIconsidebar } from "./Shared/Icons";

interface PropsI {
  setShowMobileNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SidebarItemProps {
  href?: string;
  text: string;
  children: ReactNode;
  style?: string;
  onClick?: () => void;
  numberOfUnseenNotifications?: number;
  target?: string;
}

const MobileNavbar = ({ setShowMobileNavbar }: PropsI) => {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { user } = useAuth();

  const SidebarItem = ({
    href,
    text,
    children,
    style,
    onClick,
    numberOfUnseenNotifications,
    target = "_self",
  }: SidebarItemProps) => {
    const isActive = href ? pathname?.includes(href) : false;

    if (onClick !== undefined) {
      return (
        <div
          title={text}
          onClick={onClick}
          className={`${style || ""} flex w-full cursor-pointer items-center gap-[14.64px] px-[14.64px] py-[7.32px] hover:bg-[#E9F5FE] hover:font-semibold hover:text-[#4285F4] ${isActive && "bg-[#E9F5FE] text-[#4285F4]"} rounded-[3.66px]`}
        >
          <div className="flex h-6 w-6 items-center justify-center">
            {React.cloneElement(children as React.ReactElement, { isActive })}
          </div>
          {
            <p
              className={`${isActive ? "font-semibold text-[#4285F4]" : "font-normal text-[#5D7285]"} text-[14.64px] tracking-[1%]`}
            >
              {text}
            </p>
          }
        </div>
      );
    }

    return (
      <Link
        title={text}
        target={target}
        href={href || ""}
        className={`${style || ""} ${href ? "cursor-pointer" : "cursor-not-allowed"} relative flex w-full items-center gap-[14.64px] px-[14.64px] py-[7.32px] hover:bg-[#E9F5FE] hover:font-semibold hover:text-[#4285F4] ${isActive && "bg-[#E9F5FE] text-[#4285F4]"} rounded-[3.66px]`}
      >
        <div className="relative flex h-6 w-6 items-center justify-center">
          {React.cloneElement(children as React.ReactElement, { isActive })}
          {numberOfUnseenNotifications !== undefined && numberOfUnseenNotifications >= 1 && (
            <div className="absolute left-[110%] top-1/2 flex h-[19px] w-[18px] -translate-y-1/2 items-center justify-center rounded-[3px] bg-[#E04F64] p-[7px] text-[11.89px] font-normal leading-[0px] text-white">
              {numberOfUnseenNotifications}
            </div>
          )}
        </div>
        {
          <>
            <p
              className={`${isActive ? "font-semibold text-[#4285F4]" : "font-normal text-[#5D7285]"} text-[14.64px] tracking-[1%]`}
            >
              {text}
            </p>
            {numberOfUnseenNotifications !== undefined && numberOfUnseenNotifications >= 1 && (
              <div className="ml-auto flex h-[19px] w-[18px] items-center justify-center rounded-[3px] bg-[#E04F64] p-[7px] text-[11.89px] font-normal leading-[0px] text-white">
                {numberOfUnseenNotifications}
              </div>
            )}
          </>
        }
      </Link>
    );
  };

  const logoutHandler = async () => {
    await signOut();
  };

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowMobileNavbar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  return (
    <div className="z-50 h-[70%] w-full">
      <div ref={divRef} className="fixed bottom-0 h-[70%] w-full">
        <div className="h-full w-full overflow-y-scroll rounded-t-3xl bg-white">
          <div onClick={() => setShowMobileNavbar(false)} className="flex flex-col items-center justify-center gap-4">
            <p className="mt-4 w-[20%] rounded-md border-4 border-dark-grey"></p>
            <p className="text-xl font-medium">Menu</p>
          </div>
          <div className="mt-4 flex flex-col gap-4 bg-white px-6 text-lg">
            <SidebarItem href={"/dashboard"} text={"Dashboard"}>
              <DashboardIcon isActive={false} />
            </SidebarItem>
            <SidebarItem href={"/airspaces"} text={"Airspaces"}>
              <EarthIconsidebar isActive={false} />
            </SidebarItem>
            <SidebarItem href={"/points"} text={"Points Program"}>
              <GiftIconsidebar isActive={false} />
            </SidebarItem>
            <div className="h-[1px] w-full bg-[#00000012]" />
            <p className="self-start px-[14.64px] font-normal tracking-[1%] text-[#5D7285]">MARKETPLACE</p>
            <SidebarItem href={"https://sky.trade/waitlist"} target="_blank" text={"Buy Airspace"}>
              <MapIcon isActive={false} />
            </SidebarItem>
            <SidebarItem href={"/rent"} text={"Rent Airspace"}>
              <DroneIcon isActive={false} />
            </SidebarItem>
            <SidebarItem href={"/portfolio"} text={"Portfolio"} numberOfUnseenNotifications={0}>
              <ShoppingBagsIcon isActive={false} />
            </SidebarItem>
            <SidebarItem href={"/funds"} text={"Funds"}>
              <WalletIcon isActive={false} />
            </SidebarItem>
            <div className="h-[1px] w-full bg-[#00000012]" />
            <SidebarItem href={"https://skytrade.tawk.help"} target="_blank" text={"Help Center"}>
              <HelpQuestionIcon isActive={false} color={undefined} />
            </SidebarItem>
            {user?.blockchainAddress && (
              <div
                onClick={logoutHandler}
                className="mb-8 flex w-full cursor-pointer items-center gap-[14.64px] rounded-[3.66px] px-[14.64px] hover:bg-[#E9F5FE] hover:font-semibold hover:text-[#4285F4]"
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  <LogoutIcon isActive={false} />
                </div>
                <p className="text-[14.64px] font-normal tracking-[1%] text-[#5D7285]">Logout</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
