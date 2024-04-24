import { Fragment, useState, useRef, useEffect } from "react";

import { useDispatch } from "react-redux";
import { createPortal } from "react-dom";

import { useRouter } from "next/router";
import Image from "next/image";

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import { counterActions } from "@/store/store";
import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";

import { useAuth } from "@/hooks/useAuth";

import swal from "sweetalert";

import logo from "../../../public/images/logo.jpg";

import { useSignature } from "@/hooks/useSignature";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";

const chainConfig = {
  chainNamespace: "solana",
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
  rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
  displayName: "Solana Mainnet",
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

const Signup = () => {
  const [emailValid, setEmailValid] = useState(true);
  const [categorySect, setCategorySect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isVisitYourInboxVisible, setIsVisitYourInboxVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const emailRef = useRef();

  const { signatureObject } = useSignature();

  const { setTemporaryToken, signIn } = useAuth();

  useEffect(() => {
    const fetchedToken = JSON.parse(localStorage.getItem("openlogin_store"));

    if (fetchedToken?.sessionId) {
      router.push("/homepage/dashboard2");
      return;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await web3auth.init();
    };

    init();
  }, []);

  const loginHandler = async (provider, e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const regex = /^\S+@\S+\.\S+$/;
    const emailIsValid = regex.test(email);

    if (!provider && !emailIsValid) {
      setEmailValid(false);
      return;
    }

    // setIsLoading(true);
    setIsVisitYourInboxVisible(true);

    let web3authProvider;

    if (!provider) {
      try {
        web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "email_passwordless",
          extraLoginOptions: {
            login_hint: email,
          },
        });
      } catch (err) {
        localStorage.removeItem("openlogin_store");
        router.push("/");
        return;
      }
    } else {
      try {
        web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: provider,
        });
      } catch (err) {
        localStorage.removeItem("openlogin_store");
        router.push("/");
        return;
      }
    }

    let userInformation;

    try {
      userInformation = await web3auth.getUserInfo();
    } catch (err) {
      localStorage.removeItem("openlogin_store");
      router.push("/");
      return;
    }

    const solanaWallet = new SolanaWallet(web3authProvider);

    let accounts;

    try {
      accounts = await solanaWallet.requestAccounts();
    } catch (err) {
      localStorage.removeItem("openlogin_store");
      router.push("/");
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
        router.push("/homepage/dashboard2");
        localStorage.setItem('new', true)
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
          counterActions.category({
            email: userInformation.email,
            blockchainAddress: accounts[0],
          })
        );

        // setIsLoading(false);
        setIsVisitYourInboxVisible(false);
        router.replace(`/auth/join/intro`);

        // router.replace('/homepage/dashboard');
        return;
      }
    } catch (e) {
      console.error(e);
      swal({
        title: "Oops!",
        text: e.message || "Something went wrong. Kindly try again",
      });
      throw e;
    }
  };

  const loginHandlerGood = async () => {
    const email = emailRef.current.value;
    console.log({ email });

    if (!isEmailValid(email)) {
      toast.error("Login: email is not valid", email);
      return;
    }
    console.log("Login: email is valid", email);

    setIsVisitYourInboxVisible(true);

    let provider;

    try {
      console.log("Login: creating provider...");
      provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "email_passwordless",
        extraLoginOptions: {
          login_hint: email,
        },
      });
    } catch (error) {
      console.log("Login: ERROR while creating provider...", { error });
      localStorage.removeItem("openlogin_store");
      setIsVisitYourInboxVisible(false);
      return;
    }

    console.log("Login: provider created");

    let userInformation;

    try {
      console.log("Login: getting user information...");
      userInformation = await web3auth.getUserInfo();
      console.log("Login: user information is", userInformation);
    } catch (err) {
      console.log("Login: ERROR while getting user information...", { err });
      localStorage.removeItem("openlogin_store");
      setIsVisitYourInboxVisible(false);
      // router.push("/");
      return;
    }

    console.log("Login: creatinng solana wallet...");
    const solanaWallet = new SolanaWallet(provider);
    console.log("Login: solana wallet created...");
    let accounts;
    console.log("Login: getting accounts of wallet");
    try {
      accounts = await solanaWallet.requestAccounts();
      console.log("Login: accounts", accounts);
    } catch (err) {
      console.log("Login: error getting accounts", { err });
      localStorage.removeItem("openlogin_store");
      setIsVisitYourInboxVisible(true);
      // router.push("/");
      return;
    }

    console.log("Login: constructing object of signatures...");

    const { sign, sign_nonce, sign_issue_at, sign_address } =
      await signatureObject(accounts[0]);
    console.log("Login: signature created", {
      sign,
      sign_nonce,
      sign_issue_at,
      sign_address,
    });

    try {
      console.log("Login: fetching...");
      const userRequest = await fetch(`/api/proxy?${Date.now()}`, {
        headers: {
          uri: "/private/users/session",
          sign,
          time: sign_issue_at,
          nonce: sign_nonce,
          address: sign_address,
        },
      });

      console.log("Login: fetched done");
      const user = await userRequest.json();
      console.log("Login: json done", user);

      if (user.id) {
        console.log("Login: user has id and we use the auth hook");
        signIn({ user });
        console.log("Login: done!");
        router.push("/homepage/dashboard2");
        localStorage.set('new', true)
        // dispatch(counterActions.userAuth(user));
        // localStorage.setItem('user', JSON.stringify(user));
        // router.push('/homepage/dashboard');
        return user;
      }
      console.log("Login: user has no ID");

      if (user.errorMessage === "UNAUTHORIZED") {
        console.log("Login: UNAUTHORIZED");
        setTemporaryToken(JSON.parse(localStorage.getItem("openlogin_store")));
        // const token = localStorage.getItem('openlogin_store');

        // dispatch(
        //   counterActions.web3({
        //     token: JSON.parse(token),
        //   })
        // );

        localStorage.removeItem("openlogin_store");

        dispatch(
          counterActions.category({
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
      setIsVisitYourInboxVisible(false);
      console.error(error);
      throw error;
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

  const getProvider = async () => {
    try {
      console.log("Login: creating provider...");
      provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "email_passwordless",
        extraLoginOptions: {
          login_hint: email,
        },
      });
    } catch (error) {
      console.log("Login: ERROR while creating provider");
      localStorage.removeItem("openlogin_store");
      return;
    }
  };

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Login</title>
      </Head>
      {isLoading &&
        createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("backdrop-root"))}
      {!categorySect && !isVisitYourInboxVisible && (
        <div className="relative flex h-screen w-screen items-center justify-center overflow-y-scroll rounded bg-[#F6FAFF] max-sm:bg-[white]">
          <form
            className="relative mx-auto flex flex-col items-center justify-center gap-[15px] rounded bg-white px-[30px] py-[40px]"
            style={{
              maxWidth: "449px",
            }}
            id="login"
            name="login"
          >
            <Image src={logo} alt="Company's logo" width={199} height={77} />
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
            <button
              onClick={loginHandlerGood}
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
              onClick={loginHandler.bind(null, "google")}
              className="flex w-full items-center justify-between rounded-lg py-4 pl-[18px] pr-[42px] transition-all duration-500 ease-in-out hover:bg-bleach-blue"
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
              <p className="mx-auto text-[#595959]">Connect with Google</p>
            </button>
            <button
              onClick={loginHandler.bind(null, "google")}
              className="flex w-full items-center justify-center rounded-lg py-4 pl-[18px] text-[#595959] transition-all duration-500 ease-in-out hover:bg-bleach-blue"
              style={{
                border: "1px solid #595959",
              }}
            >
              More Options
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
      {isVisitYourInboxVisible && (
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
              Visit your inbox to access the app using the verification code
              received via email. Click the code link, it will refresh this
              page, logging you in instantly.
            </p>
          </div>
          <p className="text-[14px] text-light-grey">
            Didn't receive the email?{" "}
            <span className="cursor-pointer text-[#0653EA]">Resend</span>
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default Signup;
