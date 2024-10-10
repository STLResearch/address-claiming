"use client";
import { TourProvider } from "@reactour/tour";
import React from "react";
import { useMobile } from "../hooks/useMobile";

interface Step {
  selector: string;
  content: string;
}
interface HandleStepProps {
  currentStep: number;
  stepsLength: number;
  setIsOpen: (isOpen: boolean) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: Step[];
}

const steps = [
  {
    selector: ".enter-address-step",
    content: "Enter your address and outline your property.",
  },
  {
    selector: ".Claim-airspacebtn-step",
    content: " Click on Claim Airspace button to set your airspace.",
  },
  {
    selector: ".claim-modal-step",
    content: "Fill in the details and select your preference (rent/sell details section or both).",
  },
  {
    selector: ".Claim-airspacebtn2-step",
    content: "Click the ‘Claim Airspace’ button to confirm your airspace address.",
  },
];

const mobileSteps = [
  {
    selector: ".claim-step",
    content: "Click on Claim your Airspace.",
  },
  {
    selector: ".enter-address-step",
    content: "Enter your address and outline your property.",
  },
  {
    selector: ".Claim-airspacebtn-step",
    content: "Click on Claim Airspace button to set your airspace.",
  },
  {
    selector: ".claim-modal-step",
    content: "Fill in the details and select your preference (rent/sell details section or both).",
  },
  {
    selector: ".Claim-airspacebtn2-step",
    content: "Click the ‘Claim Airspace’ button to confirm your airspace address.",
  },
];
export const handleNextSteps = ({ currentStep, stepsLength, setIsOpen, setCurrentStep, steps }: any) => {
  const last = currentStep === stepsLength - 1;
  return (
    <button
      onClick={() => {
        if (last) {
          setIsOpen(false);
        } else {
          setCurrentStep((s) => (s === steps?.length - 1 ? 0 : s + 1));
        }
      }}
    >
      {last ? "Close!" : "Next"}
    </button>
  );
};
export const handlePrevStep = ({ currentStep, setCurrentStep, steps }: any) => {
  const first = currentStep === 0;
  return (
    <button
      onClick={() => {
        if (first) {
          setCurrentStep((s) => steps.length - 1);
        } else {
          setCurrentStep((s) => s - 1);
        }
      }}
    >
      Back
    </button>
  );
};
export const MobileTourPeovider = ({ children }) => {
  return (
    <TourProvider
      steps={mobileSteps}
      disableInteraction={true}
      prevButton={handlePrevStep}
      nextButton={handleNextSteps}
    >
      {children}
    </TourProvider>
  );
};
export const DeskstopTourPeovider = ({ children }) => {
  return (
    <TourProvider steps={steps} disableInteraction={true} prevButton={handlePrevStep} nextButton={handleNextSteps}>
      {children}
    </TourProvider>
  );
};

export const OnboardingTour = ({ children }) => {
  const { isMobile } = useMobile();

  return isMobile ?
      <MobileTourPeovider>{children}</MobileTourPeovider>
    : <DeskstopTourPeovider>{children}</DeskstopTourPeovider>;
};
