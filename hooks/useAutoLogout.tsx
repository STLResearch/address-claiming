import { Web3authContext } from "@/providers/web3authProvider";
import { useEffect, useContext } from "react";
import useAuth from "./useAuth";
import publicAccessRoutes from "@/helpers/publicAccessRoutes";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIsWaitingScreenVisible } from "@/redux/slices/userSlice";

const useAutoLogout = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { web3auth } = useContext(Web3authContext);
  const { user } = useAuth();
  const dispatch = useDispatch();

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    redirectTo()
  };

  const redirectTo = () => {
    if (pathname) {
      if (pathname !== "/") {
        router.push("/auth");
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
    const isConnecting = web3auth?.status === "connecting";

    dispatch(setIsWaitingScreenVisible(isConnecting));
    localStorage.setItem("isWaitingScreenVisible", JSON.stringify(isConnecting));
  }, [web3auth?.status]);

  useEffect(() => {
    console.log("user", user);
    console.log("web3auth status", web3auth?.status);
    console.log("web3auth connected", web3auth?.connected);

    if (!web3auth) return;

    const routes = publicAccessRoutes.map(x => x.redirectTo).concat(["/auth", "/"]);
    const authRoutes = ["/auth", "/auth/join"];

    const userLocalstorage = localStorage.getItem('user');

    if (routes.includes(String(pathname))){ 
      return;
    } else if (!userLocalstorage && !authRoutes.includes(String(pathname))) {
      logout()
    }else if (web3auth?.status === "ready") {
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