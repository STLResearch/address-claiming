import React, { useState } from "react";
import { HelpQuestionIcon } from "../Icons";

const Slider = () => {
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  return (
    <div
      onClick={() => setIsFullyVisible((prev) => !prev)}
      className={`fixed z-50 cursor-pointer rounded-t-[30px] ${isFullyVisible ? "bottom-0" : "-bottom-[530px]"} duration-5000 right-6 z-20 flex max-w-[362px] flex-col items-center gap-[34px] bg-white px-[23px] py-[43px]`}
    >
      <div className="flex items-center gap-[4px]">
        <div className="flex h-[24px] w-[24px] items-center justify-center">
          <HelpQuestionIcon isActive={false} color={undefined} />
        </div>
        <p className="text-center text-xl font-medium text-[#222222]">How to Claim My Airspsace?</p>
      </div>
      <div className="flex flex-col px-[6px]">
        <div className="flex items-start gap-[4px] text-[15px] font-normal text-[#222222]" key={1}>
          <p className="">1.</p>
          <div className="flex flex-col">
            <p className="font-bold">Discover Your Address</p>
            <p>Enter your address using the map for accuracy.</p>
          </div>
        </div>
        <div className="flex items-start gap-[4px] text-[15px] font-normal text-[#222222]" key={2}>
          <p className="">2.</p>
          <div className="flex flex-col">
            <p className="font-bold">Move the Pin If Needed</p>
            <p>Easily adjust the location pin if Google Maps is off.</p>
          </div>
        </div>
        <div className="flex items-start gap-[4px] text-[15px] font-normal text-[#222222]" key={4}>
          <p className="">3.</p>
          <div className="flex flex-col">
            <p className="font-bold">Claim Airspace</p>
            <p>
              Click the &lsquo;Claim Airspace&rsquo; button to confirm your airspace airspace airspace address. Your
              Airspace is saved. Modify your anytime.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-[4px] text-[15px] font-normal text-[#222222]" key={5}>
          <p className="">4.</p>
          <div className="flex flex-col">
            <p className="font-bold">Checking the details</p>
            <p>We confirm official records.</p>
          </div>
        </div>
        <div className="flex items-start gap-[4px] text-[15px] font-normal text-[#222222]" key={6}>
          <p className="">5.</p>
          <div className="flex flex-col">
            <p className="font-bold">Passive income is on the way</p>
            <p>We will update you as your account receives funds.</p>
          </div>
        </div>
      </div>
      <div className="text-center text-[15px] font-normal text-[#222222]">
        Let&apos;s get started on creating the future and receiving passive income from your skies. 🚀✨
      </div>
    </div>
  );
};

export default Slider;
