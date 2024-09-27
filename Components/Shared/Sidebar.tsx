"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowCompressIcon,
  ArrowExpandIcon,
  DashboardIcon,
  GiftIconsidebar,
  EarthIconsidebar,
  HelpQuestionIcon,
  LogoutIcon,
  MapIcon,
  ShoppingBagsIcon,
  MenuIcon,
  DroneIconsidebar,
  WalletIconsidebar,
} from "./Icons";
import useAuth from "@/hooks/useAuth";
import { SidebarContext } from "@/hooks/sidebarContext";
import { useMobile } from "@/hooks/useMobile";
import navbarTabs from "@/helpers/navbarTabs";
import { usePathname } from "next/navigation";
import MobileNavbar from "../MobileNavbar";

interface SidebarItemProps {
  href?: string;
  text: string;
  children: ReactNode;
  style?: string;
  onClick?: () => void;
  numberOfUnseenNotifications?: number;
  target?: string;
}

interface SidebarItemMobileProps {
  href?: string;
  text: string;
  children: ReactNode;
  onClick?: () => void;
  numberOfUnseenNotifications?: number;
}

const Sidebar = () => {
  const pathname = usePathname();

  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { signOut } = useAuth();
  const [showMobileNavbar, setShowMobileNavbar] = useState(false);
  const { isMobile } = useMobile();
  const { user } = useAuth();

  useEffect(() => {
    if (navbarTabs.includes(String(pathname))) {
      localStorage.setItem("currentTab", String(pathname));
    }
  }, []);

  const SidebarItem = ({
    href,
    text,
    children,
    style,
    onClick,
    numberOfUnseenNotifications,
    target = "_self",
  }: SidebarItemProps) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      const currentTab = localStorage.getItem("currentTab");
      const isActiveVal = href
        ? href.includes(currentTab || window.location.pathname)
        : false;
      setIsActive(isActiveVal);
    }, [href]);

    const content = (
      <>
        <div className="w-6 h-6 flex items-center justify-center">
          {React.cloneElement(children as React.ReactElement, { isActive })}
        </div>
        {!isCollapsed && (
          <p
            className={`${isActive ? "font-semibold text-[#4285F4]" : "font-normal text-[#5D7285]"} text-[14.64px] tracking-[1%]`}
          >
            {text}
          </p>
        )}
        {!isCollapsed &&
          numberOfUnseenNotifications !== undefined &&
          numberOfUnseenNotifications >= 1 && (
            <div className="bg-[#E04F64] p-[7px] text-white w-[18px] h-[19px] text-[11.89px] font-normal flex items-center justify-center rounded-[3px] ml-auto leading-[0px]">
              {numberOfUnseenNotifications}
            </div>
          )}
      </>
    );

    if (onClick) {
      return (
        <div
          title={text}
          onClick={onClick}
          className={`${style || ""} cursor-default py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && "bg-[#E9F5FE] text-[#4285F4]"} rounded-[3.66px]`}
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        title={text}
        target={target}
        href={href || ""}
        className={`${style || ""} ${href ? "cursor-pointer" : "cursor-not-allowed"} relative py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && "bg-[#E9F5FE] text-[#4285F4]"} rounded-[3.66px]`}
      >
        {content}
      </Link>
    );
  };

  const SidebarItemMobile = ({
    href,
    text,
    children,
    onClick,
    numberOfUnseenNotifications,
  }: SidebarItemMobileProps) => {
    const isActive = href ? String(pathname).includes(href) : false;

    if (onClick !== undefined) {
      return (
        <div
          onClick={onClick}
          className={`py-[16.87px] flex flex-col items-center gap-1 px-[11.77px] w-full ${isActive && "text-[#4285F4]"} rounded-[3.66px] `}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            {React.cloneElement(children as React.ReactElement, { isActive })}
          </div>
          <p
            className={`${isActive ? "font-semibold text-[#4285F4]" : "font-normal text-[#5D7285]"} text-[11px] tracking-[1%]`}
          >
            {text}
          </p>
        </div>
      );
    }

    return (
      <Link
        href={href || ""}
        className={`${href ? "cursor-pointer" : "cursor-not-allowed"} py-[16.87px] flex flex-col items-center gap-2 px-[11.77px] w-full ${isActive && "text-[#4285F4]"} rounded-[3.66px]`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {React.cloneElement(children as React.ReactElement, { isActive })}
          {numberOfUnseenNotifications !== 0 && (
            <div className="bg-[#E04F64] rounded-[50%] absolute -bottom-1 -right-1 w-3 h-3"></div>
          )}
        </div>
        <p
          className={`${isActive ? "font-semibold text-[#4285F4]" : "font-normal text-[#5D7285]"} text-[11px] tracking-[1%]`}
        >
          {text}
        </p>
      </Link>
    );
  };

  const logoutHandler = async () => {
    await signOut();
  };

  const handleMenuClick = () => {
    setShowMobileNavbar(true);
  };

  return (
    <div className={"relative z-20"}>
      <aside
        className="md:flex overflow-y-scroll no-scrollbar hidden relative border-e-2 bg-white px-[21.95px] py-[29.27px] items-center flex-col gap-[14.64px]"
        style={{
          width: !isCollapsed ? "297.29px" : "98.2833px",
          height: "100vh",
          transition: "width 0.3s ease",
        }}
      >
        <Link href={"/dashboard"}>
          <Image
            src={"/images/logo-no-chars-1.png"}
            alt="Company's logo"
            width={isCollapsed ? 44.62 : 0}
            height={isCollapsed ? 51 : 0}
            className={`${isCollapsed ? "opacity-100 mb-[29.27px] w-[44.62px] h-[51px]" : "opacity-0 mb-0 w-0 h-0"}`}
            style={{ transition: "all 0.3s ease" }}
          />
        </Link>
        <Link href={"/dashboard"}>
          <Image
            src={"/images/logo-1.svg"}
            alt="Company's logo"
            width={isCollapsed ? 0 : 147}
            height={isCollapsed ? 0 : 58}
            className={`${isCollapsed ? "opacity-0 mb-0 w-0 h-0" : "opacity-100 mt-[-14.64px] mb-[29.27px] w-52 h-16 flex justify-center items-center"}`}
            style={{ transition: "all 0.3s ease" }}
          />
        </Link>

        <SidebarItem href={"/dashboard"} text={"Dashboard"}>
          <DashboardIcon isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/airspaces"} text={"Airspaces"}>
          <EarthIconsidebar isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/points"} text={"Points Program"}>
          <GiftIconsidebar isActive={false} />
        </SidebarItem>
        <div className="bg-[#00000012] w-full h-[1px]" />
        {!isCollapsed && (
          <p className="font-normal tracking-[1%] text-[#5D7285] self-start px-[14.64px]">
            MARKETPLACE
          </p>
        )}
        <SidebarItem
          href={"https://sky.trade/waitlist"}
          target={"_blank"}
          text={"Buy Airspace"}
        >
          <MapIcon isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/rent"} text={"Rent Airspace"}>
          <DroneIconsidebar isActive={false} />
        </SidebarItem>
        <SidebarItem
          href={"/portfolio"}
          text={"Portfolio"}
          numberOfUnseenNotifications={0}
        >
          <ShoppingBagsIcon isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/funds"} text={"Funds"}>
          <WalletIconsidebar isActive={false} />
        </SidebarItem>
        <div className="bg-[#00000012] w-full h-[1px]" />
        <SidebarItem
          href={"https://skytrade.tawk.help"}
          target={"_blank"}
          text={"Help Center"}
        >
          <HelpQuestionIcon isActive={false} color={undefined} />
        </SidebarItem>
        {user?.blockchainAddress && (
          <SidebarItem onClick={logoutHandler} text={"Logout"}>
            <LogoutIcon isActive={false} />
          </SidebarItem>
        )}
        <SidebarItem
          onClick={() => setIsCollapsed((prev) => !prev)}
          text={"Collapse"}
        >
          {isCollapsed ? (
            <ArrowExpandIcon isActive={false} />
          ) : (
            <ArrowCompressIcon isActive={false} />
          )}
        </SidebarItem>
      </aside>
      {isMobile && !showMobileNavbar && (
        <nav className="flex fixed bottom-0 left-0 w-full z-50 bg-white overflow-y-scroll no-scrollbar border-t-2 ">
          <SidebarItemMobile
            href={"/dashboard"}
            text={"Dashboard"}
            numberOfUnseenNotifications={0}
          >
            <DashboardIcon isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile
            href={"/airspaces"}
            text={"Airspaces"}
            numberOfUnseenNotifications={0}
          >
            <GiftIconsidebar isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile
            href={"/marketplace"}
            text={"Marketplace"}
            numberOfUnseenNotifications={0}
          >
            <MapIcon isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile
            href={"/portfolio"}
            text={"Portfolio"}
            numberOfUnseenNotifications={0}
          >
            <ShoppingBagsIcon isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile
            onClick={handleMenuClick}
            text={"Menu"}
            numberOfUnseenNotifications={0}
          >
            <MenuIcon isActive={false} />
          </SidebarItemMobile>
        </nav>
      )}
      {showMobileNavbar && isMobile && (
        <MobileNavbar setShowMobileNavbar={setShowMobileNavbar} />
      )}
    </div>
  );
};

export default Sidebar;
