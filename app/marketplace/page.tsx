"use client";
import React, { Fragment, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";
import Sidebar from "@/Components/Shared/Sidebar";
import PageHeader from "@/Components/PageHeader";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface ItemPropsI {
  title: string;
  text?: string;
  imageUrl: string;
  link: string;
  style?: string;
  target?: string;
}

const Item = ({ title, text, imageUrl, link, style, target = "_self" }: ItemPropsI) => {
  return (
    <Link
      target={target}
      href={link}
      className={`${style || ""} ${link ? "cursor-pointer" : "cursor-not-allowed"} min-w-[168px] flex-1 rounded-[20px] bg-cover bg-center bg-no-repeat px-[18px] py-[16px]`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        boxShadow: "0px 12px 34px -10px #3A4DE926",
      }}
    >
      <h2 className="text-xl font-medium text-white">{title}</h2>
      {text && <p className="text-[15px] font-normal text-white">{text}</p>}
    </Link>
  );
};

const Marketplace = () => {
  const [isLoading, setIsLoading] = useState(false);

  function createPortal(arg0: React.JSX.Element, arg1: HTMLElement | null): React.ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Marketplace</title>
      </Head>
      {isLoading && createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
      {isLoading && createPortal(<Spinner />, document.getElementById("backdrop-root"))}

      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F6FAFF]">
        <Sidebar />
        <div className="flex h-full w-full flex-col">
          <PageHeader pageTitle={"Marketplace"} />
          <section className="relative mb-[78.22px] flex h-full w-full flex-col items-center overflow-y-scroll px-[14px] py-[23px] md:mb-0">
            <div
              className="h-[66px] w-full max-w-[340px] rounded-[20px] bg-[#222222] py-[20.5px] text-center text-base font-normal text-white"
              style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
            >
              SkyMarket Hub
            </div>
            <p className="mx-[15px] mb-[27px] mt-[23px] text-center text-[15px] font-normal text-[#222222]">
              Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial Freedom.
            </p>
            <div className="flex h-full w-full flex-wrap gap-[11px]">
              <Item
                title={"Buy Airspace"}
                imageUrl={"/images/buy.jpg"}
                link={"https://sky.trade/waitlist"}
                style={"bg-right"}
                text={undefined}
                target="_blank"
              />
              <Item
                title={"Rent Airspace"}
                imageUrl={"/images/rent-airspace.jpg"}
                link={"/rent"}
                text={undefined}
                style={undefined}
              />
              <Item
                title={"Funds"}
                imageUrl={"/images/funds.png"}
                link={"/funds"}
                text={USDollar.format(0)}
                style={undefined}
              />
              <Item
                title={"Portfolio"}
                imageUrl={"/images/portfolio.jpg"}
                link={"/portfolio"}
                text={undefined}
                style={undefined}
              />
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Marketplace;
