import { useContext, useEffect, useState } from "react";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Web3authContext } from "@/providers/web3authProvider";
import { useRouter } from "next/router";
import { counterActions } from "@/store/store";

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
    // dispatch(counterActions.setClearState({}));

    sessionStorage.clear();
    localStorage.clear();
    router.push("/auth/join");
  };

  const updateProfile = (updatedUser) => {
    dispatch(counterActions.setUser(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return {
    signIn,
    signOut,
    updateProfile,
    user: userData,
    web3authStatus,
  };
};

export default useAuth;
