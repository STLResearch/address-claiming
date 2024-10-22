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
      const isActiveVal = href ? pathname.includes(href) : false;
      setIsActive(isActiveVal);
    }, [href, pathname]);

    const content = (
      <>
        <div className="flex h-6 w-6 items-center justify-center">
          {React.cloneElement(children as React.ReactElement, { isActive })}
        </div>
        {!isCollapsed && (
          <p
            className={`${isActive ? "font-semibold text-[#4285F4]" : "font-normal text-[#5D7285]"} text-[14.64px] tracking-[1%]`}
          >
            {text}
          </p>
        )}
        {!isCollapsed && numberOfUnseenNotifications !== undefined && numberOfUnseenNotifications >= 1 && (
          <div className="ml-auto flex h-[19px] w-[18px] items-center justify-center rounded-[3px] bg-[#E04F64] p-[7px] text-[11.89px] font-normal leading-[0px] text-white">
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
          className={`${style || ""} flex w-full cursor-default items-center gap-[14.64px] px-[14.64px] py-[7.32px] hover:bg-[#E9F5FE] hover:font-semibold hover:text-[#4285F4] ${isActive && "bg-[#E9F5FE] text-[#4285F4]"} rounded-[3.66px]`}
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
        className={`${style || ""} ${href ? "cursor-pointer" : "cursor-not-allowed"} relative flex w-full items-center gap-[14.64px] px-[14.64px] py-[7.32px] hover:bg-[#E9F5FE] hover:font-semibold hover:text-[#4285F4] ${isActive && "bg-[#E9F5FE] text-[#4285F4]"} rounded-[3.66px]`}
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
          className={`flex w-full flex-col items-center gap-1 px-[11.77px] py-[16.87px] ${isActive && "text-[#4285F4]"} rounded-[3.66px]`}
        >
          <div className="relative flex h-6 w-6 items-center justify-center">
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
        className={`${href ? "cursor-pointer" : "cursor-not-allowed"} flex w-full flex-col items-center gap-2 px-[11.77px] py-[16.87px] ${isActive && "text-[#4285F4]"} rounded-[3.66px]`}
      >
        <div className="relative flex h-5 w-5 items-center justify-center">
          {React.cloneElement(children as React.ReactElement, { isActive })}
          {numberOfUnseenNotifications !== 0 && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-[50%] bg-[#E04F64]"></div>
          )}
        </div>
        <p
          className={`${isActive ? "font-semibold text-[#4285F4]" : "font-normal text-[#5D7285]"} truncate text-[11px] tracking-[1%]`}
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
    <div className={"relative !z-[200] sm:z-20"}>
      <aside
        className="no-scrollbar relative hidden flex-col items-center gap-[14.64px] overflow-y-scroll border-e-2 bg-white px-[21.95px] py-[29.27px] md:flex"
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
            className={`${isCollapsed ? "mb-[29.27px] h-[51px] w-[44.62px] opacity-100" : "mb-0 h-0 w-0 opacity-0"}`}
            style={{ transition: "all 0.3s ease" }}
          />
        </Link>
        <Link href={"/dashboard"}>
          <Image
            src={"/images/logo-1.svg"}
            alt="Company's logo"
            width={isCollapsed ? 0 : 147}
            height={isCollapsed ? 0 : 58}
            className={`${isCollapsed ? "mb-0 h-0 w-0 opacity-0" : "mb-[29.27px] mt-[-14.64px] flex h-16 w-52 items-center justify-center opacity-100"}`}
            style={{ transition: "all 0.3s ease" }}
          />
        </Link>

        <SidebarItem href={"/dashboard"} text={"Dashboard"}>
          <DashboardIcon isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/airspaces"} text={"Air Rights"}>
          <EarthIconsidebar isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/points"} text={"Points Program"}>
          <GiftIconsidebar isActive={false} />
        </SidebarItem>
        <div className="h-[1px] w-full bg-[#00000012]" />
        {!isCollapsed && (
          <p className="self-start px-[14.64px] font-normal tracking-[1%] text-[#5D7285]">MARKETPLACE</p>
        )}
        <SidebarItem href={"/buy"} text={"Buy Airspace"}>
          <MapIcon isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/rent"} text={"Rent Air Rights"}>
          <DroneIconsidebar isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/portfolio"} text={"Portfolio"} numberOfUnseenNotifications={0}>
          <ShoppingBagsIcon isActive={false} />
        </SidebarItem>
        <SidebarItem href={"/funds"} text={"Funds"}>
          <WalletIconsidebar isActive={false} />
        </SidebarItem>
        <div className="h-[1px] w-full bg-[#00000012]" />
        <SidebarItem href={"https://skytrade.tawk.help"} target={"_blank"} text={"Help Center"}>
          <HelpQuestionIcon isActive={false} color={undefined} />
        </SidebarItem>
        {user?.blockchainAddress && (
          <SidebarItem onClick={logoutHandler} text={"Logout"}>
            <LogoutIcon isActive={false} />
          </SidebarItem>
        )}
        <SidebarItem onClick={() => setIsCollapsed((prev) => !prev)} text={"Collapse"}>
          {isCollapsed ?
            <ArrowExpandIcon isActive={false} />
          : <ArrowCompressIcon isActive={false} />}
        </SidebarItem>
      </aside>
      {isMobile && !showMobileNavbar && (
        <nav className="no-scrollbar fixed bottom-0 left-0 z-50 flex w-full overflow-y-scroll border-t-2 bg-white">
          <SidebarItemMobile href={"/dashboard"} text={"Dashboard"} numberOfUnseenNotifications={0}>
            <DashboardIcon isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile href={"/airspaces"} text={"Airspaces"} numberOfUnseenNotifications={0}>
            <GiftIconsidebar isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile href={"/marketplace"} text={"Marketplace"} numberOfUnseenNotifications={0}>
            <MapIcon isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile href={"/portfolio"} text={"Portfolio"} numberOfUnseenNotifications={0}>
            <ShoppingBagsIcon isActive={false} />
          </SidebarItemMobile>
          <SidebarItemMobile onClick={handleMenuClick} text={"Menu"} numberOfUnseenNotifications={0}>
            <MenuIcon isActive={false} />
          </SidebarItemMobile>
        </nav>
      )}
      {showMobileNavbar && isMobile && <MobileNavbar setShowMobileNavbar={setShowMobileNavbar} />}
    </div>
  );
};

export default Sidebar;
