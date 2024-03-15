import React, { useState, useEffect } from "react";
import { CloseIcon } from "../Icons";

const CircularProgressButton = ({
  totalTime,
  setShowSuccessPopUp,
  isSharing,
  setIsSharing,
  isVisible
}) => {
  const [progress, setProgress] = useState(0);
  const [countdownRunning, setCountdownRunning] = useState(true);
  useEffect(() => {
    if(!isVisible)return;
    const startTime = Date.now();
    if (isSharing) return;
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = (elapsedTime / totalTime) * 100;
      if (parseInt(calculatedProgress) >= 100) {
        setProgress(100);
      } else {
        setProgress(calculatedProgress);
      }
      if (calculatedProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [totalTime,isSharing,isVisible]);
  const circumference = 2 * Math.PI * 24; // Circumference of the circle with radius 45
  const handleClose = () => {
    setShowSuccessPopUp(false);
    setIsSharing(false);
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
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="24"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeDasharray={`${(progress / 100) * circumference}, ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>

        <button
          className="absolute top-0 left-0 w-full h-full bg-transparent border-none cursor-pointer flex justify-center items-center"
          // onClick={onClick}
        >
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
