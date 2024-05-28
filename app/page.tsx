"use client";

import { useEffect, useContext, useState } from "react";

import Spinner from "@/Components/Spinner";
import useAutoLogout from "@/hooks/useAutoLogout";
import { useRouter } from "next/navigation";
import { useMobile } from "@/hooks/useMobile";
import { Web3authContext } from "@/providers/web3auth";

export default function Home() {
  useAutoLogout();
  const router = useRouter();

  const { web3auth } = useContext(Web3authContext);

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    // router.push("/auth/join");
    router.push("/dashboard");
  };

  useEffect(() => {
    if (web3auth) {
      if (web3auth.status === "connected") {
        const userData = localStorage.getItem("user");
        if (userData && userData !== "undefined") {
          router.push("/dashboard");
        } else {
          logout();
        }
      }
    }
  }, [web3auth?.status]);

  const { isMobile } = useMobile();
  const [doItAgain, setDoItAgain] = useState(false);

  // const persistor = persistStore(store);

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

  return <Spinner />;
}
