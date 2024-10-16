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
    <div className="w-full bg-[#2279FF] text-white py-2 px-8 flex justify-between items-center z-50 gap-3 cursor-pointer">
      <div
        onClick={() => router.push("/points")}
        className="flex gap-5 items-center"
      >
        <p>🚀</p>
        <p className="font-normal">
          Don&apos;t Miss Out! Our Seasonal SKY Points Referral Program is Live.
          Share Your Link and Earn Automatically — No Air rights Claim Needed!
        </p>
      </div>
      <button onClick={handleClose} className="text-white text-3xl">
        &times;
      </button>
    </div>
  );
};

export default NotificationBanner;
