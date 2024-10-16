import React, { useState } from "react";
import { HelpQuestionIcon } from "../Icons";

const Slider = () => {
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  return (
    <div
      onClick={() => setIsFullyVisible((prev) => !prev)}
      className={`fixed z-50 cursor-pointer rounded-t-[30px]  ${isFullyVisible ? "bottom-0" : "-bottom-[555px]"} right-24 flex flex-col items-center gap-[25px] p-[20px] bg-white max-w-[280px] max-h-[652px] duration-5000 `}
    >
      <div className="flex items-center gap-[4px]">
        <div className="flex items-center justify-center w-[24px] h-[24px]">
          <HelpQuestionIcon isActive={false} color={undefined} />
        </div>
        <p className="font-medium text-[14px] text-[#222222] text-center">
          How to Claim My Airspsace?
        </p>
      </div>
      <div className="flex flex-col leading-[22px]">
        <div
          className="flex items-start text-[#222222] font-normal text-[13px] gap-[4px]"
          key={1}
        >
          <p className="font-bold">1.</p>
          <div className="flex flex-col">
            <p className="font-bold">Discover Your Address</p>
            <p>Enter your address using the map for accuracy.</p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[13px] gap-[4px]"
          key={2}
        >
          <p className="font-bold">2.</p>
          <div className="flex flex-col">
            <p className="font-bold">Move the Pin If Needed</p>
            <p>Easily adjust the location pin if Google Maps is off.</p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[13px] gap-[4px]"
          key={3}
        >
          <p className="font-bold">3.</p>
          <div className="flex flex-col">
            <p className="font-bold">Define Your Property</p>
            <p>
              Outline your land using the polygon tool if the location is not
              exact (top right of the map).
            </p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[13px] gap-[4px]"
          key={4}
        >
          <p className="font-bold">4.</p>
          <div className="flex flex-col">
            <p className="font-bold">Claim Airspace</p>
            <p>
              Click the &lsquo;Claim Airspace&rsquo; button to confirm your air
              rights address. Your Airspace is saved. Modify your anytime.
            </p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[13px] gap-[4px]"
          key={5}
        >
          <p className="font-bold">5.</p>
          <div className="flex flex-col">
            <p className="font-bold">Checking the details</p>
            <p>We confirm official records.</p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[13px] gap-[4px]"
          key={6}
        >
          <p className="font-bold">6.</p>
          <div className="flex flex-col">
            <p className="font-bold">Passive income is on the way</p>
            <p>We will update you as your account receives funds.</p>
          </div>
        </div>
      </div>
      <div className="font-normal text-[13px] text-[#222222] text-center">
        Let&apos;s get started on creating the future and receiving passive
        income from your skies. 🚀✨
      </div>
    </div>
  );
};

export default Slider;
