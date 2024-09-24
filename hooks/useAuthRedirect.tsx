import { useState, useEffect, useContext } from "react";

import { useDispatch } from "react-redux";

import { SolanaWallet } from "@web3auth/solana-provider";

import useAuth from "@/hooks/useAuth";
import { Web3authContext } from "@/providers/web3authProvider";
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
    (async () => {
      try {
        if (web3auth?.status === "connected" && provider) {
          localStorage.setItem("isWaitingScreenVisible", JSON.stringify(true));

          const userInformation = await web3auth.getUserInfo();
          const solanaWallet = new SolanaWallet(provider);
          const accounts = await solanaWallet.requestAccounts();

          const responseData = await getUser();

          if (responseData?.id) {
            localStorage.setItem("user", JSON.stringify(responseData));
            signIn({ user: responseData });
            customRedirect();
          } else {
            const categoryData = {
              email: userInformation.email,
              blockchainAddress: accounts[0],
            };

            dispatch(setCategory(categoryData));

            localStorage.setItem("category", JSON.stringify(categoryData));

            router.replace(`/auth/join`);
          }
          setIsRedirecting(true);
          localStorage.setItem("isWaitingScreenVisible", JSON.stringify(false));
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [web3auth?.status]);

  return { isRedirecting };
};

export default useAuthRedirect;
