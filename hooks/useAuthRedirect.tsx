import { useState, useEffect, useContext } from "react";

import { useDispatch } from "react-redux";

import { SolanaWallet } from "@web3auth/solana-provider";

import useAuth from "@/hooks/useAuth";
import { Web3authContext } from "@/providers/web3Provider";
import UserService from "@/services/UserService";
import { useRouter } from "next/navigation";
import { setCategory } from "@/redux/slices/userSlice";

const useAuthRedirect = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { signIn, customRedirect } = useAuth();

  const { web3auth, provider } = useContext(Web3authContext);
  const { getUser } = UserService();

  useEffect(() => {
    const categoryData = localStorage.getItem("category");
    if (categoryData) {
      const currentCategory = JSON.parse(categoryData);
      dispatch(setCategory(currentCategory));
    }
  }, []);

  useEffect(() => {
    const handleUserAuthentication = async () => {
      try {
        if (web3auth?.status !== "connected" || !provider) return;

        localStorage.setItem("isWaitingScreenVisible", JSON.stringify(true));

        const userInfo = await web3auth.getUserInfo();
        const solanaWallet = new SolanaWallet(provider);
        const accounts = await solanaWallet.requestAccounts();

        const { error, data } = await getUser();

        if (!error) {
          localStorage.setItem("user", JSON.stringify(data));
          signIn({ user: data });
          customRedirect();
          setIsRedirecting(true);
        } else if (error && data.message === "USER_NOT_FOUND") {
          const categoryData = {
            email: userInfo.email,
            blockchainAddress: accounts[0],
          };

          dispatch(setCategory(categoryData));
          localStorage.setItem("category", JSON.stringify(categoryData));
          router.replace("/auth/join");
          setIsRedirecting(true);
        } else {
          await web3auth?.logout();
        }
      } catch (error) {
        console.error(error);
      } finally {
        localStorage.setItem("isWaitingScreenVisible", JSON.stringify(false));
      }
    };

    handleUserAuthentication();
  }, [web3auth?.status, provider]);

  return { isRedirecting };
};

export default useAuthRedirect;
