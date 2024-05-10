// "use client"

import React from "react";
import { hasCookie, setCookie } from "cookies-next";

const CookieConsent = (props) => {
  const [showConsent, setShowConsent] = React.useState(true);

  React.useEffect(() => {
    setShowConsent(hasCookie("localConsent"));
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie("localConsent", "true", {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed z-[20000000000] inset-0 bg-slate-700 bg-opacity-70">
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-4 py-4 bg-gray-100 text-[10px] md:flex-row flex-col md:text-[14px] text-[#222222]">
        <p className="text-justify">
          Welcome to SkyTrade! Like many websites, we use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept" you agree to the storing of cookies on your device. You can manage your preferences or withdraw your consent at any time by accessing our Cookie Settings.
        </p>
        <button className="bg-blue-400 py-2 px-8 rounded text-white" onClick={() => acceptCookie()}>Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;