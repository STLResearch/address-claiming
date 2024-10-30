import React from "react";
import "./global.css";
import { Provider } from "react-redux";
import store from "../store/store";
import Script from "next/script";

import CookieConsent from "../Components/CookieConsent";

import { msclaritConfig } from "../hooks/msclaritConfig";

import { SidebarProvider } from "../hooks/sidebarContext";
import { Web3authProvider } from "../providers/web3Provider";
import { ToastContainer } from "react-toastify";

import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { OnboardingTour } from "../Components/Tours";
import { Web3Provider } from "@/Components/Web3AuthProvider";
import NotificationBanner from "@/Components/NotificationBanner";
import TawkMessengerComponent from "@/Components/TawkMessenger";

export const metadata: Metadata = {
  title: {
    template: "%s - SkyTrade",
    default: "SkyTrade",
  },
  description: "The Ultimate Air Right Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
        <link rel="icon" href="/favicon-1.ico" sizes="any" type="image/x-icon" />
        <link href="https://unpkg.com/maplibre-gl@3.1.0/dist/maplibre-gl.css" rel="stylesheet" />
      </head>
      <body>
        <div id="backdrop-root"></div>
        <div id="modal-root"></div>
        {/* <PersistGate loading={null} persistor={persistor}> */}
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
          <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
          {/* <Provider store={store}> */}
          <Web3authProvider>
            <Web3Provider>
              <SidebarProvider>
                <ToastContainer style={{ width: "500px" }} />
                <div id="backdrop-root"></div>
                <div id="modal-root"></div>

                <NextTopLoader
                  color="#2299DD"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={3}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={300}
                  shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                />
                <NotificationBanner />
                <OnboardingTour>{children}</OnboardingTour>
              </SidebarProvider>
              <CookieConsent />
              <TawkMessengerComponent />
            </Web3Provider>
          </Web3authProvider>
          {/* </Provider> */}
        </>
        {/* </PersistGate> */}
      </body>
    </html>
  );
}
