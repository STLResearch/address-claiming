import "@/styles/globals.css";
import { Provider } from "react-redux";
import CookieConsent from "@/Components/CookieConsent";

import { msclaritConfig } from "@/hooks/msclaritConfig";
import { useMobile } from "@/hooks/useMobile";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/hooks/sidebarContext";
import { Web3authProvider } from "@/providers/web3authProvider";
import { ToastContainer } from "react-toastify";

import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "@/redux/store";
import ErrorBoundary from "@/Components/ErrorBoundary";

export default function App({ Component, pageProps }) {
  const { isMobile } = useMobile();
  const [doItAgain, setDoItAgain] = useState(false);

  const persistor = persistStore(store);

  useEffect(() => {
    var Tawk_API = global?.Tawk_API || undefined;
    if (!Tawk_API) return;

    if (isMobile) {
      if (Tawk_API.hideWidget !== undefined) {
        Tawk_API.hideWidget();
      } else if (!doItAgain) {
        setDoItAgain(true);
      }
    } else {
      if (Tawk_API.showWidget !== undefined) {
        Tawk_API.showWidget();
      } else if (doItAgain) {
        setDoItAgain(false);
      }
    }
  }, [isMobile, global.Tawk_API, doItAgain]);

  return (
    <>
      <Provider store={store}> 

      <PersistGate loading={"happens"} persistor={persistor}>
        <>    
          <Web3authProvider>
            <SidebarProvider>
              <ToastContainer style={{ width: "500px" }} />
              <ErrorBoundary>
              <Component {...pageProps} />
              </ErrorBoundary>
            </SidebarProvider>
            <CookieConsent />
          </Web3authProvider>
        </>
      </PersistGate>
      </Provider>    
    </>
  );
}
