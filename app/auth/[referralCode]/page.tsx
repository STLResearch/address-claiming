"use client";

import { Fragment, useState, useRef, useEffect, useContext } from "react";

import { shallowEqual } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

import { WALLET_ADAPTERS } from "@web3auth/base";

import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";

import ReferralCodeService from "@/services/ReferralCodeService";
import { Web3authContext } from '@/providers/web3authProvider';
import useInitAuth from '@/hooks/useInitAuth';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import Link from "next/link";
import { toast } from 'react-toastify';
import LoadingMessage from "@/Components/Auth/LoadingMessage";
import EmailInput from "@/Components/Auth/EmailInput";
import { useAppSelector } from "@/redux/store";

const ReferralCodeRedirect = () => {
  const { isRedirecting } = useAuthRedirect();

  const [emailValid, setEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [doesCodeExist, setDoesCodeExist] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryParams = useParams();

  const { getReferralByCode } = ReferralCodeService();
  const { web3auth, setProvider } = useContext(Web3authContext)
  const { init } = useInitAuth();

  useEffect(() => {
    if (!queryParams?.referralCode) return;
    (async () => {
      try {
        const responseData = await getReferralByCode(String(queryParams?.referralCode));
        if (!responseData) setDoesCodeExist(false);
        else if (responseData && responseData.statusCode === 500) setDoesCodeExist(false);
        else {
          localStorage.setItem("referralCode", JSON.stringify({ response: responseData }));
          setDoesCodeExist(true);
        }
      } catch (error) {
        console.log("response: error", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [queryParams?.referralCode]);


  const { isWaitingScreenVisible } = useAppSelector((state) => {
    const { isWaitingScreenVisible } = state.userReducer;
    return { isWaitingScreenVisible };
  }, shallowEqual);


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

  return (
    <Fragment>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      {!doesCodeExist && !isLoading && (
        <div className="w-screen h-screen flex items-center justify-center flex-col gap-5 text-[#222222]">
          <p className="font-bold text-3xl">Oops!</p>
          <p className="max-w-[400px] text-center">
            It seems like you've taken a wrong turn. The referral code you
            entered doesn't match any in our records. Double-check the code and
            make sure there are no typos. Good luck!
          </p>
          <div
            className="text-[#222222] p-4 rounded hover:text-white cursor-pointer hover:bg-[#222222]"
            style={{ border: "1px solid #222222" }}
            onClick={() => router.replace("/auth")}
          >
            Go to login
          </div>
        </div>
      )}
      {doesCodeExist && !isWaitingScreenVisible && !isRedirecting && (
        <div className="h-screen w-screen md:flex">
          <div className="flex-1 bg-white flex items-center justify-center">
            <div className="flex flex-col gap-[15px] px-[30px] py-[40px] items-center justify-center max-w-[577px]">
              <Image src={'/images/logo.svg'} alt="Company's logo" width={199} height={77} />
              <p className="font-normal text-xl text-[#222222] text-center">
                Welcome to SkyTrade
              </p>
              <p className="font-bold text-base text-[#4285F4] text-center px-[68px]">
                You have an awesome friend who referred you to earn 50 extra SKY
                points!
              </p>
              <p className="font-normal text-[16px] text-[#222222] text-center">
                Claim Your Airspace and Start Earning Passive Income! 🚀
              </p>
              <div className="text-[15px] text-light-grey font-normal my-[30px]">
                <p>
                  💰{" "}
                  <span className="font-bold">
                    Monetize Your Air Rights Easily:
                  </span>{" "}
                  Elevate earnings without changing property ownership.
                </p>
                <p>
                  🌐{" "}
                  <span className="font-bold">
                    User-Friendly Air Rights Management:
                  </span>{" "}
                  Define and control with ease on our secure platform.
                </p>
                <p>
                  🚀{" "}
                  <span className="font-bold">Hassle-Free Passive Income:</span>{" "}
                  Gain full control and minimal effort for a steady income.
                </p>
                <p>
                  🔐{" "}
                  <span className="font-bold">
                    Secure Access with SkyTrade:
                  </span>{" "}
                  Register to control land and airspace, ensuring permissions
                  and receive direct fees into your account.
                </p>
              </div>
              <p className="font-normal text-base text-[#222222] text-center px-[44px]">
                Join SkyTrade today and turn your air rights into a lucrative
                opportunity! 🚀✨
              </p>
            </div>
          </div>
          <div className="relative bg-[#E9F5FE] max-sm:bg-[white] md:h-screen md:w-screen md:flex md:flex-1 items-center justify-center overflow-hidden">
            <form
              className="mx-auto flex flex-col items-center gap-[15px] bg-white py-[40px] px-[30px] relative justify-center rounded-[30px]"
              style={{
                maxWidth: "449px",
              }}
              id="login"
              name="login"
            >
              <p className="text-base font-normal text-[#222222]">Register</p>
              <p className="text-sm text-light-grey text-center">
                Sign up to get rewarded with 50 credit
              </p>
              <EmailInput
                emailRef={emailRef}
                emailValid={emailValid}
                setEmailValid={setEmailValid}
              />
              <label className="flex w-full text-[14px] text-[#87878D] gap-[11px]">
                <input
                  className="w-[18px] h-[18px] cursor-pointer"
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
                className="rounded-md bg-dark-blue text-white transition-all duration-500 ease-in-out hover:bg-blue-600 py-4 px-24 text-[15px] w-full"
              >
                Get started
              </button>
              <div className="relative text-center text-[#00000033] flex gap-[15px] w-full items-center align-middle">
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
                className="flex items-center rounded-lg transition-all duration-500 ease-in-out hover:bg-bleach-blue py-4 w-full justify-between pl-[18px] pr-[42px]"
                style={{
                  border: "1px solid #595959",
                }}
              >
                <Image
                  src="/images/google-logo.png"
                  alt="Google's logo"
                  width={24}
                  height={24}
                  className=""
                />
                <p className="text-[#595959] mx-auto">Connect with Google</p>
              </button>
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
            </form>
          </div>
        </div>
      )}
      {isWaitingScreenVisible && doesCodeExist && <LoadingMessage />}

    </Fragment>
  );
};

export default ReferralCodeRedirect;