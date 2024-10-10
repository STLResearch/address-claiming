"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const NotificationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("showbanner")) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.removeItem("showbanner");
  };

  if (!isVisible) return null;

  return (
    <div className="z-50 flex w-full cursor-pointer items-center justify-between gap-3 bg-[#2279FF] px-8 py-2 text-white">
      <div onClick={() => router.push("/points")} className="flex items-center gap-5">
        <p>🚀</p>
        <p className="font-normal">
          Don&apos;t Miss Out! Our Seasonal SKY Points Referral Program is Live. Share Your Link and Earn Automatically
          — No Air rights Claim Needed!
        </p>
      </div>
      <button onClick={handleClose} className="text-3xl text-white">
        &times;
      </button>
    </div>
  );
};

export default NotificationBanner;
