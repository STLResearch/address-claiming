"use client";

import React, { useContext, useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { useRouter } from "next/navigation";

import { SolanaWallet } from "@web3auth/solana-provider";
import { Web3authContext } from "@/providers/web3authProvider";
import UserService from "@/services/UserService";
import useInitAuth from "@/hooks/useInitAuth";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import { AuthForm } from "@/Components/Auth";
import LoadingMessage from "@/Components/Auth/LoadingMessage";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setCategory,
  setIsWaitingScreenVisible,
} from "@/redux/slices/userSlice";

const Signup: React.FC = () => {
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { web3auth, provider, setProvider } = useContext(Web3authContext);
  console.log({ web3auth });
  const { getUser } = UserService();
  const { signIn } = useAuth();
  const { init } = useInitAuth();

  const { isWaitingScreenVisible } = useAppSelector((state) => {
    const { isWaitingScreenVisible } = state.userReducer;
    return { isWaitingScreenVisible };
  }, shallowEqual);

  useEffect(() => {
    const categoryData = localStorage.getItem("category");
    if (categoryData) {
      const currentCategory = JSON.parse(categoryData);
      dispatch(setCategory(currentCategory));
    }
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        if (web3auth?.status === "connected" && provider) {
          dispatch(setIsWaitingScreenVisible(true));
          localStorage.setItem("isWaitingScreenVisible", JSON.stringify(true));

          const userInformation = await web3auth.getUserInfo();
          const solanaWallet = new SolanaWallet(provider);
          const accounts = await solanaWallet.requestAccounts();

          const responseData = await getUser();

          if (responseData?.id) {
            localStorage.setItem("user", JSON.stringify(responseData));
            signIn({ user: responseData });
            router.push("/dashboard");
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
          dispatch(setIsWaitingScreenVisible(false));
          localStorage.setItem("isWaitingScreenVisible", JSON.stringify(false));
        }
      } catch (error) {
        console.error(error);
        dispatch(setIsWaitingScreenVisible(false));
        localStorage.setItem("isWaitingScreenVisible", JSON.stringify(false));
      }
    })();
  }, [web3auth?.status]);

  useEffect(() => {
    const isWaitingScreen = localStorage.getItem("isWaitingScreenVisible");
    if (isWaitingScreen) {
      const isWaiting = JSON.parse(isWaitingScreen);
      dispatch(setIsWaitingScreenVisible(isWaiting));
    }
  }, [dispatch]);

  console.log({ isWaitingScreenVisible });

  return (
    <>
      <Head>
        <title>SkyTrade - Login</title>
      </Head>
      {!isWaitingScreenVisible && !isRedirecting && (
        <div className="relative flex h-screen w-screen items-center justify-center overflow-y-scroll rounded bg-[#F6FAFF] max-sm:bg-[white]">
          <AuthForm
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            isNewsletterChecked={isNewsletterChecked}
            setIsNewsletterChecked={setIsNewsletterChecked}
          />
        </div>
      )}
      {isWaitingScreenVisible && <LoadingMessage />}
    </>
  );
};

export default Signup;