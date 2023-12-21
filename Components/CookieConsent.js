"use client"

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
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-4 py-8 bg-gray-100">
        <span className="text-md text-base mr-16">
        Welcome to SkyTrade! Like many websites, we use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept" you agree to the storing of cookies on your device. You can manage your preferences or withdraw your consent at any time by accessing our Cookie Settings.
        </span>
        <button className="bg-blue-400  py-2 px-8 rounded text-white" onClick={() => acceptCookie()}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;