import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { Web3authContext } from "@/providers/web3authProvider";
import useAuth from "@/hooks/useAuth";
import publicAccessRoutes from "@/Components/helper/publicAccessRoutes";


const useAutoLogout = () => {
  const router = useRouter();
  const { web3auth } = useContext(Web3authContext);
  const { user } = useAuth();

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    redirectTo()
  };

  const redirectTo = () => {
    if(router.pathname !== "/r/[referralCode]" && router.pathname !== "/") {
      router.push("/auth/inAppSignIn");
    } else {
      router.push("/homepage/airspace2");
    }
  };

  useEffect(() => {
    const checkSessionStorageUser = JSON.parse(
      sessionStorage.getItem("persist:root")
    );
    if (checkSessionStorageUser) {
      logout();
    }
  }, [web3auth?.status]);

  useEffect(() => {
    console.log("user", user);
    console.log("web3auth status", web3auth?.status);
    console.log("web3auth connected", web3auth?.connected);
    console.log("router", router);


    if (!web3auth) return;

    const routes = publicAccessRoutes.map(x => x.redirectTo).concat(["/auth/join"]);

    if(routes.includes(router.pathname)) return;
    else if (web3auth?.status === "ready") {
      const fetchedToken = JSON.parse(localStorage.getItem('openlogin_store'));
      if (!fetchedToken?.sessionId) {
        redirectTo()
      } 
    }

  }, [web3auth?.status, user,router.pathname]); //included router.pathname in the dependency array so that it checks for autologout on every page..  




  return null;
};



export default useAutoLogout;
