import { useContext, useEffect, useState } from "react";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Web3authContext } from "@/providers/web3authProvider";
import { useRouter } from "next/router";
import { counterActions } from "@/store/store";
import publicAccessRouteRedirection from "@/Components/helper/publicAccessRoutesRedirection";

const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [web3authStatus, setWeb3authStatus] = useState();
  const { web3auth, setProvider } = useContext(Web3authContext);

  const { userData } = useSelector((state) => {
    const { user } = state.value;
    return { userData: user };
  }, shallowEqual);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      const currentUser = JSON.parse(userData);
      dispatch(counterActions.setUser(currentUser));
    }
  }, []);

  useEffect(() => {
    const initStatus = async () => {
      if (web3auth && web3auth?.status === "connected") {
        setWeb3authStatus(true);
      } else {
        setWeb3authStatus(false);
      }
    };
    initStatus();
  }, [web3auth?.status]);

  const signIn = ({ user }) => {
    if (user) dispatch(counterActions.setUser(user));
    const fetchedToken = JSON.parse(localStorage.getItem("openlogin_store"));
    localStorage.setItem("skySessionId", JSON.stringify(fetchedToken));
  };

  const signOut = async () => {
    setProvider(null);

    sessionStorage.clear();
    localStorage.clear();
    console.log('here1')
    router.push("/auth/join");
  };

  const updateProfile = (updatedUser) => {
    dispatch(counterActions.setUser(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const setAndClearOtherPublicRouteData = (localStorageKey, data) => {
    for (const route of publicAccessRouteRedirection) {
      if(route.localStorageKey !== localStorageKey) {
        localStorage.removeItem(route.localStorageKey)
      }
    }
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  };


  const customRedirect = () => {
    const publicAccessRoutes = publicAccessRouteRedirection || [];

    for (const item of publicAccessRoutes) {
      const initialKeyData = localStorage.getItem(item.localStorageKey);
      if (initialKeyData && initialKeyData?.length > 2) {
        router.replace(item.redirectTo);
        return;
      }
    }

    router.replace("/homepage/dashboard2");
  };

  const redirectIfUnauthenticated = () => {
    if(web3auth && web3auth.status === "connected") return false;
    else {
      router.push("/auth/join");
      return true;
    }
  }


  return {
    signIn,
    signOut,
    updateProfile,
    user: userData,
    web3authStatus,
    customRedirect,
    redirectIfUnauthenticated,
    setAndClearOtherPublicRouteData
  };
};

export default useAuth;
