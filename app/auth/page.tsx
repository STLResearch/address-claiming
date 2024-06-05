"use client";

import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import Head from "next/head";
import { AuthForm } from "@/Components/Auth";
import LoadingMessage from "@/Components/Auth/LoadingMessage";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setIsWaitingScreenVisible,
} from "@/redux/slices/userSlice";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const Signup: React.FC = () => {
  const { isRedirecting } = useAuthRedirect();

  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useAppDispatch();

  const { isWaitingScreenVisible } = useAppSelector((state) => {
    const { isWaitingScreenVisible } = state.userReducer;
    return { isWaitingScreenVisible };
  }, shallowEqual);


  useEffect(() => {
    const isWaitingScreen = localStorage.getItem("isWaitingScreenVisible");
    if (isWaitingScreen) {
      const isWaiting = JSON.parse(isWaitingScreen);
      dispatch(setIsWaitingScreenVisible(isWaiting));
    }
  }, []);

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
