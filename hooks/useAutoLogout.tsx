import { Web3authContext } from "@/providers/web3authProvider";
import { useEffect, useContext } from "react";
import useAuth from "./useAuth";
import publicAccessRoutes from "@/helpers/publicAccessRoutes";
import { usePathname, useRouter } from "next/navigation";

const useAutoLogout = () => {
  const router = useRouter()
  const pathname = usePathname()
  
  const { web3auth } = useContext(Web3authContext);
  const { user } = useAuth();

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    redirectTo()
  };

  const redirectTo = () => {
    if (pathname) {
      const isReferralPage = pathname.includes("/auth/r/");
      if (!isReferralPage && pathname !== "/") {
        router.push("/auth/inAppSignIn");
      } else {
        router.push("/airspaces");
      }
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("persist:root")) {
      logout();
    }
  }, [web3auth?.status]);

  useEffect(() => {
    console.log("user", user);
    console.log("web3auth status", web3auth?.status);
    console.log("web3auth connected", web3auth?.connected);

    if (!web3auth) return;

    const routes = publicAccessRoutes.map(x => x.redirectTo).concat(["/auth/join", "/auth"]);
    const isReferralPage = pathname?.includes("/auth/r/");

    if (routes.includes(String(pathname)) || isReferralPage) return;
    else if (web3auth?.status === "ready") {
      const fetchedToken = JSON.parse(String(localStorage.getItem('openlogin_store')));
      if (!fetchedToken?.sessionId) {
        redirectTo()
        localStorage.removeItem("user");
      }
    }
  }, [web3auth?.status, user, pathname]); //included router.pathname in the dependency array so that it checks for autologout on every page..  

  return null;
};



export default useAutoLogout;
