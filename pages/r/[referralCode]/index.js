// "use client";

import { Fragment, useState, useRef, useEffect, useContext } from "react";

import { useDispatch, shallowEqual, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";

import { WALLET_ADAPTERS } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";

import useAuth from '@/hooks/useAuth';

import logo from "../../../public/images/logo.svg";

import { setCategory, setIsWaitingScreenVisible } from "@/redux/slices/userSlice";
import ReferralCodeService from "@/services/ReferralCodeService";
import { Web3authContext } from '@/providers/web3authProvider';
import UserService from "@/services/UserService";
import useInitAuth from '@/hooks/useInitAuth';
import { counterActions } from "@/store/store";

const ReferralCodeRedirect = () => {
  const [emailValid, setEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [doesCodeExist, setDoesCodeExist] = useState(true);

  const emailRef = useRef();
  const router = useRouter();
  const { referralCode } = router.query;
  const dispatch = useDispatch();

  const { signIn } = useAuth();
  const { getReferralByCode } = ReferralCodeService();
  const { web3auth, provider, setProvider } = useContext(Web3authContext)
  const { getUser } = UserService()
  const { init } = useInitAuth();

  useEffect(() => {
    if (!referralCode) return;
    (async () => {
      try {
        const responseData = await getReferralByCode(referralCode);
        if (!responseData) setDoesCodeExist(false);
        localStorage.setItem("referralCode", JSON.stringify({ response: responseData }));
      } catch (error) {
        console.log("response: error", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [referralCode]);

  // const {isWaitingScreenVisible} = useSelector((state) => {
  //   const {isWaitingScreenVisible} = state.userReducer;
  //   return {isWaitingScreenVisible}
  // }, shallowEqual);

  const isWaitingScreenVisible = useSelector(
    (state) => state.value.isWaitingScreenVisible
  );


  useEffect(() => {
    (async () => {
      try {
        if (web3auth?.status === "connected" && provider) {
          dispatch(counterActions.setIsWaitingScreenVisible(true))

          const userInformation = await web3auth.getUserInfo();
          const solanaWallet = new SolanaWallet(provider);
          const accounts = await solanaWallet.requestAccounts();

          const responseData = await getUser()

          if (responseData?.id) {
            signIn({ user: responseData });
            router.push("/homepage/dashboard2");
          } else {
            dispatch(counterActions.
              setCategory({
                email: userInformation.email,
                blockchainAddress: accounts[0],
              })
            );

            router.replace(`/auth/join/intro`);
          }
          dispatch(counterActions.setIsWaitingScreenVisible(false))
        }
      } catch (error) {
        console.error(error)
        dispatch(counterActions.setIsWaitingScreenVisible(false))
      } 
    })()
  },[web3auth?.status])

  const loginUser = async (isEmail) => {
    await init();

    if (!web3auth) {
      toast.error("Web3auth not initialized yet");
      return;
    }

    let web3authProvider = null;

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
  };

  const onTermsAndConditionsClicked = () => {
    return;
  };

  const onPrivacyPolicyClicked = () => {
    return;
  };

  const isEmailValid = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  return (
    <Fragment>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      {!doesCodeExist && (
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
            onClick={() => router.replace("/")}
          >
            Go to login
          </div>
        </div>
      )}
      {doesCodeExist && !isWaitingScreenVisible && (
        <div className="h-screen w-screen flex">
          <div className="flex-1 bg-white flex items-center justify-center">
            <div className="flex flex-col gap-[15px] px-[30px] py-[40px] items-center justify-center max-w-[577px]">
              <Image src={logo} alt="Company's logo" width={199} height={77} />
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
          <div className="relative bg-[#E9F5FE] max-sm:bg-[white] h-screen w-screen flex flex-1 items-center justify-center overflow-hidden">
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
              <div className="relative flex flex-col gap-[5px] w-full">
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
                  className="rounded-lg font-sans placeholder:font-medium placeholder:text-[#B8B8B8] placeholder:text-sm py-4 px-[22px] focus:outline-none"
                  style={{
                    border: emailValid
                      ? "1px solid #87878D"
                      : "1px solid #E04F64",
                  }}
                />
                {!emailValid && (
                  <p className="text-[11px] italic text-red-600">
                    Invalid email
                  </p>
                )}
              </div>
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
              <p className="text-[#87878D] text-sm text-center">
                By creating an account I agree with{" "}
                <span
                  onClick={onTermsAndConditionsClicked}
                  className="text-[#0653EA] cursor-pointer"
                >
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span
                  onClick={onPrivacyPolicyClicked}
                  className="text-[#0653EA] cursor-pointer"
                >
                  Privacy Policy
                </span>{" "}
                agreement
              </p>
            </form>
          </div>
        </div>
      )}
      {doesCodeExist && isWaitingScreenVisible && (
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
              Thanks for waiting. We're moving you to a new page. Please don't refresh while we do this.
            </p>
          </div>
        </div>
      )}

    </Fragment>
  );
};

export default ReferralCodeRedirect;
