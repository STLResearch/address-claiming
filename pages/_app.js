import "@/styles/globals.css";
import { Provider } from "react-redux";
// import store from "@/store/store";
import Script from "next/script";

import CookieConsent from "@/Components/CookieConsent";

import { AuthProvider } from "@/hooks/useAuth";
import { msclaritConfig } from "@/hooks/msclaritConfig";
import { useMobile } from "@/hooks/useMobile";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/hooks/sidebarContext";
import { ToastContainer } from "react-toastify";
import { TourProvider } from "@reactour/tour";

import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "@/redux/store";

export default function App({ Component, pageProps }) {
  const { isMobile } = useMobile();
  const [doItAgain, setDoItAgain] = useState(false);

  const persistor = persistStore(store);


  useEffect(() => {
    var Tawk_API = global?.Tawk_API || undefined;
    if (!Tawk_API) return;

    if (isMobile) {
      if (Tawk_API?.hideWidget !== undefined) {
        Tawk_API?.hideWidget();
      } else if (!doItAgain) {
        setDoItAgain(true);
      }
    } else {
      if (Tawk_API?.showWidget !== undefined) {
        Tawk_API?.showWidget();
      } else if (doItAgain) {
        setDoItAgain(false);
      }
    }
  }, [isMobile, global.Tawk_API, doItAgain]);



  return (
    <AuthProvider>
      <Provider store={store}>
      
      <PersistGate loading={null} persistor={persistor}>
        <>
          <Script src="https://cdn.withpersona.com/dist/persona-v4.8.0.js" />
          <Script id="show-banner" dangerouslySetInnerHTML={msclaritConfig} />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5" />
          <Script id="google-analytics">
            {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
          
                  gtag('config', 'G-C0J4J56QW5');
              `}
          </Script>
          <SidebarProvider>
            <ToastContainer style={{ width: "500px" }} />
            <OnboardingTour>
              <Component {...pageProps} />
            </OnboardingTour>
          </SidebarProvider>
          <CookieConsent />
        </>
      </PersistGate>
      </Provider>
    </AuthProvider>
  );
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
    content:
      "fill in the details and select your preference (rent/sell details section or both).",
  },
  {
    selector: ".Claim-airspacebtn2-step",
    content:
      "Click the ‘Claim Airspace’ button to confirm your airspace address.",
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
    content: " Click on Claim Airspace button to set your airspace.",
  },
  {
    selector: ".claim-modal-step",
    content:
      "fill in the details and select your preference (rent/sell details section or both).",
  },
  {
    selector: ".Claim-airspacebtn2-step",
    content:
      "Click the ‘Claim Airspace’ button to confirm your airspace address.",
  },
];
export const handleNextSteps = ({
  currentStep,
  stepsLength,
  setIsOpen,
  setCurrentStep,
  steps,
}) => {
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
export const handlePrevStep = ({ currentStep, setCurrentStep, steps }) => {
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
    <TourProvider
      steps={steps}
      disableInteraction={true}
      prevButton={handlePrevStep}
      nextButton={handleNextSteps}
    >
      {children}
    </TourProvider>
  );
};

const OnboardingTour = ({ children }) => {
  const { isMobile } = useMobile();

  return isMobile ? (
    <MobileTourPeovider>{children}</MobileTourPeovider>
  ) : (
    <DeskstopTourPeovider>{children}</DeskstopTourPeovider>
  );
};
