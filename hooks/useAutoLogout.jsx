import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { Web3authContext } from "@/providers/web3authProvider";
import useAuth from "@/hooks/useAuth";
import publicAccessRouteRedirection from "@/Components/helper/publicAccessRoutesRedirection";

const useAutoLogout = () => {
  const router = useRouter();
  const { web3auth } = useContext(Web3authContext);
  const { user } = useAuth();
  const publicAccessRoutes=["/auth/join"];
  for(let item of publicAccessRouteRedirection ){
    publicAccessRoutes.push(item.redirectTo)
  }
  
  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    redirectTo()
  };

  const redirectTo = () => {
    if(router.pathname !== "/r/[referralCode]")  router.push("/inAppSignIn");
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

    if(publicAccessRoutes.includes(router.pathname)){
      return
    }else if (web3auth?.status === "ready") {
      const fetchedToken = JSON.parse(localStorage.getItem('openlogin_store'));
      if (!fetchedToken?.sessionId) {
        redirectTo()
      } 
    }

  }, [web3auth?.status, user,router.pathname]); //included router.pathname in the dependency array so that it checks for autologout on every page..  




  return null;
};



export default useAutoLogout;
