import React, { useState, useEffect } from "react";
import { CloseIcon } from "../Icons";
import { useCircularProgress } from "@/hooks/useCircularProgress";

interface CircularProgressButtonProps {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
  isPopupHovered: boolean;
  totalTime: number;
  setShowSuccessPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  isSharing: boolean;
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>;
  isVisible: boolean;
}

const CircularProgressButton: React.FC<CircularProgressButtonProps> = ({
  setProgress,
  progress,
  isPopupHovered,
  totalTime,
  setShowSuccessPopUp,
  isSharing,
  setIsSharing,
  isVisible,
}) => {
  useCircularProgress({
    totalTime,
    isVisible,
    isSharing,
    isPopupHovered,
    progress,
    setProgress,
    setShowSuccessPopUp,
    setIsSharing,
  });
  const calculateCircumference = (radius: number) => 2 * Math.PI * radius;
  const circumference = calculateCircumference(24);
  const handleClose = () => {
    setShowSuccessPopUp(false);
    () => setIsSharing(false);
  };
  return (
    <>
      <div onClick={handleClose} className="relative w-12 h-12 ">
        <svg viewBox="0 0 100 100" className="w-12 h-12">
          <circle
            cx="50"
            cy="50"
            r="24"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="24"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="6"
            strokeDasharray={`${(progress / 100) * circumference}, ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>

        <button className="absolute top-0 left-0 w-full h-full bg-transparent border-none cursor-pointer flex justify-center items-center">
          {" "}
          <div className="w-[12px] h-[12px] flex justify-center items-center">
            <CloseIcon />
          </div>
        </button>
      </div>
    </>
  );
};

export default CircularProgressButton;
