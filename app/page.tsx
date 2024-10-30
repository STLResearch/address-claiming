"use client";

import { useEffect, useContext, Fragment, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/Components/Spinner";
import { Web3authContext } from "@/providers/web3AuthProvider";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useInitAuth from "@/hooks/useInitAuth";
import { useAppSelector } from "@/redux/store";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { WALLET_ADAPTERS } from "@web3auth/base";
import Image from "next/image";
import EmailInput from "@/Components/Auth/EmailInput";
import Link from "next/link";
import LoadingMessage from "@/Components/Auth/LoadingMessage";
import Backdrop from "@/Components/Backdrop";

export default function Home() {
  const router = useRouter();
  const queryParams = useSearchParams();

  const { isRedirecting } = useAuthRedirect();

  const [emailValid, setEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  const { web3auth, setProvider } = useContext(Web3authContext);
  const { init } = useInitAuth();

  const isWaitingScreenVisible = useAppSelector((state) => {
    return state.userReducer.isWaitingScreenVisible;
  }, shallowEqual);

  useEffect(() => {
    setIsLoading(true);
    const referralCode = queryParams.get("ref");
    const userLocalstorage = localStorage.getItem("user");

    if (referralCode && !userLocalstorage) {
      localStorage.setItem("referralCode", String(referralCode));
    } else {
      router.push("/airspaces");
    }
    setIsLoading(false);
  }, [web3auth?.status]);

  const loginUser = async (isEmail: boolean) => {
    try {
      await init();
      if (!web3auth) {
        toast.error("Web3auth not initialized yet");
        return;
      }

      setIsLoading(true);
      let web3authProvider = null;

      if (isEmail && emailRef.current) {
        const email = emailRef.current.value;
        if (!isEmailValid(email)) {
          toast.error("Login: email is not valid");
          setEmailValid(false);
          setIsLoading(false);
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
      console.error("Error occurred:", error);
      toast.error("An error occurred while logging in.");
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  if (isLoading) {
    return (
      <>
        <Spinner />
        <Backdrop />
      </>
    );
  }

  return (
    <Fragment>
      {!isWaitingScreenVisible && !isRedirecting && (
        <div className="h-screen w-screen lg:flex">
          <div className="flex flex-1 items-center justify-center bg-white">
            <div className="flex max-w-[577px] flex-col items-center justify-center gap-[15px] px-[30px] py-[40px]">
              <Image src={"/images/logo-1.svg"} alt="Company's logo" width={199} height={77} />
              <p className="text-center text-xl font-normal text-[#222222]">Welcome to SkyTrade</p>
              <p className="px-[68px] text-center text-base font-bold text-[#4285F4]">
                You have an awesome friend who referred you to earn 5 extra SKY points!
              </p>
              <p className="text-center text-[16px] font-normal text-[#222222]">
                Claim Your Air Rights and Start Earning Passive Income! 🚀
              </p>
              <div className="my-[30px] text-[15px] font-normal text-light-grey">
                <p>
                  💰 <span className="font-bold">Monetize Your Air Rights Easily:</span> Elevate earnings without
                  changing property ownership.
                </p>
                <p>
                  🌐 <span className="font-bold">User-Friendly Air Rights Management:</span> Define and control with
                  ease on our secure platform.
                </p>
                <p>
                  🚀 <span className="font-bold">Hassle-Free Passive Income:</span> Gain full control and minimal effort
                  for a steady income.
                </p>
                <p>
                  🔐 <span className="font-bold">Secure Access with SkyTrade:</span> Register to control land and air
                  rights, ensuring permissions and receive direct fees into your account.
                </p>
              </div>
              <p className="px-[44px] text-center text-base font-normal text-[#222222]">
                Join SkyTrade today and turn your air rights into a lucrative opportunity! 🚀✨
              </p>
            </div>
          </div>
          <div className="relative h-1/2 items-center justify-center overflow-hidden bg-[#E9F5FE] max-sm:bg-[white] md:flex md:w-screen md:flex-1 lg:h-screen">
            <form
              className="relative mx-auto flex flex-col items-center justify-center gap-[15px] rounded-[30px] bg-white px-[30px] lg:py-[40px]"
              style={{
                maxWidth: "449px",
              }}
              id="login"
              name="login"
            >
              <p className="text-base font-normal text-[#222222]">Register</p>
              <p className="text-center text-sm text-light-grey">Sign up to get rewarded with 5 credit</p>
              <EmailInput emailRef={emailRef} emailValid={emailValid} setEmailValid={setEmailValid} />
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
              <button
                onClick={() => loginUser(true)}
                type="button"
                className="w-full rounded-md bg-dark-blue px-24 py-4 text-[15px] text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
              >
                Get started
              </button>
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
              <button
                onClick={() => loginUser(false)}
                type="button"
                className="flex w-full items-center justify-between rounded-lg py-4 pl-[18px] pr-[42px] transition-all duration-500 ease-in-out hover:bg-bleach-blue"
                style={{
                  border: "1px solid #595959",
                }}
              >
                <Image src="/images/google-logo.png" alt="Google's logo" width={24} height={24} className="" />
                <p className="mx-auto text-[15px] text-[#595959]">Connect with Google</p>
              </button>
              <p className="text-center text-sm text-[#87878D]">
                By creating an account I agree with{" "}
                <Link target="_blank" href="https://docs.sky.trade/terms.pdf" className="cursor-pointer text-[#0653EA]">
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
            </form>
          </div>
        </div>
      )}
      {isWaitingScreenVisible && <LoadingMessage />}
    </Fragment>
  );
}
