import Link from "next/link";
import { useState } from "react";
import { HelpQuestionIcon } from "../Icons";

const MobileMapSection = ({ setShowHowToModal,showMobileMap,setShowMobileMap }) => {
  return (
    <>
      {!showMobileMap && (
        <div className="flex h-full w-full flex-col md:hidden">
          <div
            onClick={() => setShowMobileMap(true)}
            className="flex w-full flex-col justify-between gap-[184px] bg-cover bg-center bg-no-repeat p-[17px]"
            style={{ backgroundImage: "url('/images/map-bg.png')" }}
          >
            <div className="w-full rounded-[20px] bg-[#222222] p-[12px] text-center text-base font-normal text-white">
              Exciting times ahead!
              <br />
              Claim your airspace 🚀✨
            </div>
            <div className="w-full rounded-lg bg-[#0653EA] p-[12px] text-center text-base font-normal text-white">
              Claim your airspace
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-[23px] px-[13px] py-[29px]">
            <div className="flex flex-1 items-center gap-[14px]">
              <Link
                href={"/portfolio"}
                className="flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]"
                style={{
                  backgroundImage: "url('/images/airspace-preview.png')",
                }}
              >
                <p className="text-xl font-medium text-white">Airspace</p>
              </Link>
              <Link
                href={"/portfolio"}
                className="flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]"
                style={{
                  backgroundImage: "url('/images/portfolio.jpg')",
                }}
              >
                <p className="text-xl font-medium text-white">Portfolio</p>
              </Link>
            </div>

            <div
              onClick={() => setShowHowToModal(true)}
              className="flex cursor-pointer items-center justify-center gap-[7px] rounded-[20px] bg-[#222222] p-[13px] text-white"
            >
              <div className="h-[24px] w-[24px]">
                <HelpQuestionIcon color="white" isActive={undefined} />
              </div>
              <p>How to Claim My Airspace?</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMapSection;
