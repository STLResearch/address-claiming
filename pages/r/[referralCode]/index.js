"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";

import { useAuth } from "@/hooks/useAuth";
import useDatabase from "@/hooks/useDatabase";

import logo from "../../../public/images/logo.jpg";

import { useSignature } from "@/hooks/useSignature";
import { setCategory } from "@/redux/slices/userSlice";

const chainConfig = {
  chainNamespace: "solana",
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
  rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
  displayName: `Solana ${process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME}`,
  blockExplorer: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
};

const web3auth = new Web3AuthNoModal({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
  chainConfig: chainConfig,
});

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

const openLoginAdapter = new OpenloginAdapter({
  privateKeyProvider,
});

web3auth.configureAdapter(openLoginAdapter);

const ReferralCodeRedirect = () => {
  const [emailValid, setEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [isVisitYourInboxVisible, setIsVisitYourInboxVisible] = useState(false);
  const [doesCodeExist, setDoesCodeExist] = useState(true);

  const emailRef = useRef();
  const router = useRouter();
  const { referralCode } = router.query;
  const dispatch = useDispatch();
  const { signatureObject } = useSignature();
  const { setTemporaryToken, signIn } = useAuth();
  const { getReferralByCode } = useDatabase();

  useEffect(() => {
    if (!referralCode) return;
    (async () => {
      try {
        const response = await getReferralByCode(referralCode);
        if (!response) setDoesCodeExist(false);
        localStorage.setItem("referralCode", JSON.stringify({ response }));
      } catch (error) {
        console.log("response: error", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [referralCode]);

  useEffect(() => {
    const fetchedToken = JSON.parse(localStorage.getItem("openlogin_store"));

    if (fetchedToken?.sessionId) {
      router.push("/homepage/dashboard2");
      return;
    }
  }, []);

  useEffect(() => {
    console.log("web3auth:", web3auth);
    const init = async () => {
      await web3auth.init();
    };

    init();
  }, []);

  const loginHandlerGood = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;

    if (!isEmailValid(email)) {
      return;
    }

    setIsVisitYourInboxVisible(true);

    let provider;

    try {
      provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "email_passwordless",
        extraLoginOptions: {
          login_hint: email,
        },
      });
    } catch (error) {
      localStorage.removeItem("openlogin_store");
      setIsVisitYourInboxVisible(true);
      return;
    }

    let userInformation;

    try {
      userInformation = await web3auth.getUserInfo();
    } catch (err) {
      console.log("Register: ERROR while getting user information...", { err });
      localStorage.removeItem("openlogin_store");
      // router.push("/");
      setIsVisitYourInboxVisible(true);
      return;
    }

    const solanaWallet = new SolanaWallet(provider);
    let accounts;
    try {
      accounts = await solanaWallet.requestAccounts();
    } catch (err) {
      console.log("Register: error getting accounts", { err });
      localStorage.removeItem("openlogin_store");
      setIsVisitYourInboxVisible(true);
      // router.push("/");
      return;
    }

    const { sign, sign_nonce, sign_issue_at, sign_address } =
      await signatureObject(accounts[0]);

    try {
      const userRequest = await fetch(`/api/proxy?${Date.now()}`, {
        headers: {
          uri: "/private/users/session",
          sign,
          time: sign_issue_at,
          nonce: sign_nonce,
          address: sign_address,
        },
      });

      const user = await userRequest.json();

      if (user.id) {
        signIn({ user });
        // dispatch(counterActions.userAuth(user));
        // localStorage.setItem('user', JSON.stringify(user));
        // router.push('/homepage/dashboard');
        return user;
      }

      if (user.errorMessage === "UNAUTHORIZED") {
        setTemporaryToken(JSON.parse(localStorage.getItem("openlogin_store")));
        // const token = localStorage.getItem('openlogin_store');

        // dispatch(
        //   counterActions.web3({
        //     token: JSON.parse(token),
        //   })
        // );

        localStorage.removeItem("openlogin_store");

        dispatch(
          setCategory({
            email: userInformation.email,
            blockchainAddress: accounts[0],
          })
        );

        // setIsLoading(false);
        router.replace(`/auth/join/intro`);

        // router.replace('/homepage/dashboard');
        return;
      }
    } catch (error) {
      console.error(error);
      setIsVisitYourInboxVisible(true);
      throw error;
    }
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
      {doesCodeExist && !isVisitYourInboxVisible && (
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
                onClick={loginHandlerGood}
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
                onClick={loginHandlerGood}
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
      {doesCodeExist && isVisitYourInboxVisible && (
        <div className="relative rounded bg-[#F6FAFF] max-sm:bg-[white] h-screen w-screen flex flex-col items-center justify-center gap-[21.5px] overflow-hidden">
          <div
            className="mx-auto flex flex-col items-center gap-[15px] bg-white py-[40px] px-[30px] rounded relative justify-center"
            style={{
              maxWidth: "449px",
            }}
          >
            <Image src={logo} alt="Company's logo" width={199} height={77} />
            <p className="text-xl font-medium text-light-black mt-[25px]">
              Welcome to SkyTrade
            </p>
            <p className="text-[14px] text-center font-normal text-light-grey">
              Visit your inbox to access the app using the verification code
              received via email. Click the code link, it will refresh this
              page, logging you in instantly.
            </p>
          </div>
          <p className="text-light-grey text-[14px]">
            Didn't receive the email?{" "}
            <span className="text-[#0653EA] cursor-pointer">Resend</span>
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default ReferralCodeRedirect;
