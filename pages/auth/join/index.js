// "use client";

import { Fragment, useState, useRef, useEffect, useContext } from "react";

import { useDispatch } from "react-redux";

import { useRouter } from "next/router";
import Image from "next/image";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import useAuth from "@/hooks/useAuth";

import logo from "../../../public/images/logo.svg";

import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  setCategory,
  setIsWaitingScreenVisible,
} from "@/redux/slices/userSlice";
import { shallowEqual, useSelector } from "react-redux";
import { Web3authContext } from "@/providers/web3authProvider";
import UserService from "@/services/UserService";
import useInitAuth from "@/hooks/useInitAuth";
import { counterActions } from "@/store/store";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";



const Signup = () => {
  const [emailValid, setEmailValid] = useState(true);
  const[isLoading,setIsLoading] = useState(false);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  console.log(router.pathname)
  const emailRef = useRef();
  const { init } = useInitAuth();

  const { signIn,customRedirect } = useAuth();

  const { web3auth, provider, setProvider } = useContext(Web3authContext);
  const { getUser } = UserService();

  // const {isWaitingScreenVisible} = useSelector((state) => {
  //   const {isWaitingScreenVisible} = state.userReducer;
  //   return {isWaitingScreenVisible}
  // }, shallowEqual);

  const isWaitingScreenVisible = useSelector(
    (state) => state.value.isWaitingScreenVisible
  );

  useEffect(() => {
    const categoryData = localStorage.getItem("category");
    if (categoryData) {
      const currentCategory = JSON.parse(categoryData);
      dispatch(counterActions.setCategory(currentCategory));
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (web3auth?.status === "connected" && provider) {
          dispatch(counterActions.setIsWaitingScreenVisible(true));
          localStorage.setItem("isWaitingScreenVisible", JSON.stringify(true));

          const userInformation = await web3auth.getUserInfo();
          const solanaWallet = new SolanaWallet(provider);
          const accounts = await solanaWallet.requestAccounts();

          const responseData = await getUser();

          if (responseData?.id) {
            console.log({ responseData });
            localStorage.setItem("user", JSON.stringify(responseData));
            signIn({ user: responseData });
            customRedirect()
            
          } else {
            const categoryData = {
              email: userInformation.email,
              blockchainAddress: accounts[0],
            };

            dispatch(counterActions.setCategory(categoryData));

            localStorage.setItem("category", JSON.stringify(categoryData));

            router.replace(`/auth/join/intro`);
          }
          setIsRedirecting(true);
          dispatch(counterActions.setIsWaitingScreenVisible(false));
          localStorage.setItem("isWaitingScreenVisible", JSON.stringify(false));
        }
      } catch (error) {
        console.error(error);
        dispatch(counterActions.setIsWaitingScreenVisible(false));
        localStorage.setItem("isWaitingScreenVisible", JSON.stringify(false));
      }
    })();
  }, [web3auth?.status]);

  console.log("web3auth.status", web3auth?.status);

  const loginUser = async (isEmail) => {
    
    try {  
      await init();
      if (!web3auth) {
        toast.error("Web3auth not initialized yet");
        return;
      }
  
      let web3authProvider = null;
      setIsLoading(true);
      if (isEmail) {
        const email = emailRef.current.value;
  
        if (!isEmailValid(email)) {
          toast.error("Login: email is not valid", email);
          return;
        }
  
        web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "email_passwordless",
          extraLoginOptions: {
            login_hint: email,
          },
        });
      } else {
        web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "google",
        });
      }
      setProvider(web3authProvider);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error("An error occurred while logging in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchingBetweenLoginAndRegister = () => {
    setIsLogin((prev) => !prev);
    setIsNewsletterChecked(false);
  };

  const isEmailValid = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  useEffect(() => {
    const isWaitingScreen = localStorage.getItem("isWaitingScreenVisible");
    if (isWaitingScreen) {
      const isWaiting = JSON.parse(isWaitingScreen);
      dispatch(counterActions.setCategory(isWaiting));
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Login</title>
      </Head>
      {!isWaitingScreenVisible && !isRedirecting && (
        <div className={router.pathname=='/auth/join'?"relative flex w-screen h-screen items-center justify-center overflow-y-scroll rounded bg-[#F6FAFF] max-sm:bg-[white]":"relative flex items-center justify-center overflow-y-scroll rounded bg-[#F6FAFF] max-sm:bg-[white]"}>
          <form
            className="relative mx-auto flex flex-col items-center justify-center gap-[15px] rounded bg-white px-[30px] py-[40px]"
            style={{
              maxWidth: "449px",
            }}
            id="login"
            name="login"
            onSubmit={(e) => {
              e.preventDefault();
              loginUser(true);
            }}
          >
            <Image src={logo} alt="Company's logo" width={199} height={77} />
            
            {router.pathname=='/auth/join' && <>
           <p className="mt-[25px] text-xl font-medium text-light-black">
              Welcome{isLogin && " back"} to SkyTrade
            </p>
            <p className="text-base text-light-black">
              {isLogin ? "Login" : "Register"}
            </p>
            {isLogin && (
              <p className="text-center text-sm text-light-grey">
                Sign in effortlessly using the authentication method you chose
                during sign up.
              </p>
            )}
            </>
            }
            {router.pathname!='/auth/join' && <>
           <p className="mt-[25px] text-xl font-medium text-light-black text-center">
           Unlock the full experience! 🚀
            </p>
            <p className="text-base text-light-black">
              {isLogin ? "Login" : "Register"}
            </p>
            {isLogin && (
              <p className="text-center text-sm text-light-grey">
               Log in or create an account to access this feature. Join now to enjoy seamless navigation and exclusive benefits tailored just for you. Ready to explore more? Log in or register now! 
              </p>
            )}
            </>
            }

           
           
            <div className="relative flex w-full flex-col gap-[5px]">
              <label
                className="text-[14px] font-normal"
                style={{
                  color: emailValid ? "rgba(0, 0, 0, 0.50)" : "#E04F64",
                }}
              >
                Email<span className="text-[#E04F64]">*</span>
              </label>{" "}
              <input
                type="email"
                name="email"
                id="email"
                ref={emailRef}
                onChange={() => setEmailValid(true)}
                placeholder="email@mail.com"
                className="rounded-lg px-[22px] py-4 font-sans placeholder:text-sm placeholder:font-medium placeholder:text-[#B8B8B8] focus:outline-none"
                style={{
                  border: emailValid
                    ? "1px solid #87878D"
                    : "1px solid #E04F64",
                }}
              />
              {!emailValid && (
                <p className="text-[11px] italic text-red-600">Invalid email</p>
              )}
            </div>
            {!isLogin && (
              <label className="flex w-full gap-[11px] text-[14px] text-[#87878D]">
                <input
                  className="h-[18px] w-[18px] cursor-pointer"
                  type="checkbox"
                  id="newsletterCheckbox"
                  name="newsletterCheckbox"
                  checked={isNewsletterChecked}
                  onChange={() => setIsNewsletterChecked((prev) => !prev)}
                />
                Send me newsletter to keep me updated
              </label>
            )}
            <LoadingButton onClick={() => loginUser(true)} isLoading={isLoading} className="w-full flex justify-center rounded-md bg-dark-blue px-24 py-4 text-[15px] text-white transition-all duration-500 ease-in-out hover:bg-blue-600">
              Get started
            </LoadingButton>
            
            <div className="relative flex w-full items-center gap-[15px] text-center align-middle text-[#00000033]">
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "#00000033",
                }}
              />
              <p className="text-sm">or</p>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "#00000033",
                }}
              />
            </div>
            <LoadingButton onClick={() => loginUser(false)} isLoading={isLoading} className={"w-full flex justify-center"} >
              <div
                className="flex w-full items-center justify-between rounded-lg py-4 pl-[18px] pr-[42px] transition-all duration-500 ease-in-out hover:bg-bleach-blue border border-[#595959]">
                <Image
                  src="/images/google-logo.png"
                  alt="Google's logo"
                  width={24}
                  height={24}
                  className=""
                />
              <p className="mx-auto text-[#595959]">Connect with Google</p>
              </div>
            </LoadingButton>
            <LoadingButton onClick={() => loginUser(false)} isLoading={isLoading}
              className="flex w-full items-center justify-center rounded-lg py-4 pl-[18px] text-[#595959] transition-all duration-500 ease-in-out hover:bg-bleach-blue border border-[#595959]"
            >
              More Options
            </LoadingButton>
            <p className="text-center text-sm text-[#87878D]">
              By creating an account I agree with{" "}
              <Link
                target="_blank"
                href="https://docs.sky.trade/terms.pdf"
                className="cursor-pointer text-[#0653EA]"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                target="_blank"
                href="https://docs.sky.trade/privacy.pdf"
                className="cursor-pointer text-[#0653EA]"
              >
                Privacy Policy
              </Link>{" "}
              agreement
            </p>
            <div
              style={{ width: "100%", height: "1px", background: "#00000033" }}
            />
            <p
              onClick={handleSwitchingBetweenLoginAndRegister}
              className="text-[#87878D]"
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span className="cursor-pointer font-bold text-[#0653EA]">
                {isLogin ? "Register" : "Login"}
              </span>
            </p>
          </form>
        </div>
      )}
      {isWaitingScreenVisible && (
        <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-[21.5px] overflow-hidden rounded bg-[#F6FAFF] max-sm:bg-[white]">
          <div
            className="relative mx-auto flex flex-col items-center justify-center gap-[15px] rounded bg-white px-[30px] py-[40px]"
            style={{
              maxWidth: "449px",
            }}
          >
            <Image src={logo} alt="Company's logo" width={199} height={77} />
            <p className="mt-[25px] text-xl font-medium text-light-black">
              Welcome to SkyTrade
            </p>
            <p className="text-center text-[14px] font-normal text-light-grey">
              Thanks for waiting. We're moving you to a new page. Please don't
              refresh while we do this.
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Signup;
