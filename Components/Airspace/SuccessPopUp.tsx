import React, { useState, useEffect } from "react";
import useOrigin from "@/hooks/useOrigin";
import CircularProgressButton from "./CurcularProgress";
import ShareButtons from "./ShareButtons";
import { Timer } from "@/utils/timer/timer";
import { SuccessIcon } from "../Icons";

const SuccessPopUp: React.FC = () => {
  const origin = useOrigin();
  const [isSharing, setIsSharing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const [timer, setTimer] = useState<any>(null);

  useEffect(() => {
    if (showSuccessPopUp) {
      const timerTemp = new Timer(function () {
        // if (!isSharing && !isPopupHovered) {
        //   setShowSuccessPopUp(false);
        // }
      }, 10000);
      setTimer(timerTemp);
    }
  }, [showSuccessPopUp, isSharing, isPopupHovered]);

  const handlePause = () => {
    setIsPopupHovered(true);
    timer?.pause();
  };

  const handleContinue = () => {
    setIsPopupHovered(false);
    timer?.resume();
  };

  return (
    <div
      className={`z-20 absolute top-[14px] ${
        showSuccessPopUp ? "right-0" : "-right-[100%]"
      } gap-5 p-5 bg-white flex flex-col items-center duration-500`}
      onMouseEnter={handlePause}
      onMouseLeave={handleContinue}
    >
      <div className="flex gap-5">
        <div className="flex items-center justify-center w-[18px] h-[18px] mt-[10px]">
          <SuccessIcon />
        </div>
        <p className="text-[#1FD387] text-[14px] leading-[21px]">
          Congratulations on claiming your first piece of the sky <br />
          successfully! Share the good news on social media and let <br />
          your friends know about your great experience with SkyTrade.
        </p>
        <CircularProgressButton
          progress={progress}
          setProgress={setProgress}
          isPopupHovered={isPopupHovered}
          isVisible={showSuccessPopUp}
          isSharing={isSharing}
          setIsSharing={setIsSharing}
          totalTime={10000}
          setShowSuccessPopUp={setShowSuccessPopUp}
        />
      </div>
      <div>
        <ShareButtons
          setIsSharing={setIsSharing}
          url={`${origin}/airspaces`}
        />
      </div>
    </div>
  );
};

export default SuccessPopUp;
