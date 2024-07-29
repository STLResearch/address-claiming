import { useEffect, useState } from 'react';

interface CircularProgressOptions {
  totalTime: number;
  isVisible: boolean;
  isSharing: boolean;
  isPopupHovered: boolean;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setShowSuccessPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCircularProgress = ({
  totalTime,
  isVisible,
  isSharing,
  isPopupHovered,
  progress,
  setProgress,
  setShowSuccessPopUp,
  setIsSharing,
}: CircularProgressOptions) => {
  const [previousProgress, setPreviousProgress] = useState(0);

  useEffect(() => {
    if (!isVisible || isSharing) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (!isPopupHovered) {
        const elapsedTime = Date.now() - startTime;
        const calculatedProgress = (elapsedTime / totalTime) * 100;

        if (calculatedProgress + previousProgress >= 100) {
          setProgress(100);
          clearInterval(interval);
          setShowSuccessPopUp(false);
        } else {
          setProgress(calculatedProgress + previousProgress);
        }
      } else {
        setPreviousProgress(progress);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [totalTime, isSharing, isVisible, isPopupHovered, previousProgress]);

};
