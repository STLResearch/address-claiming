import { Fragment, useState, useRef, useEffect } from "react";

import { useDispatch } from "react-redux";

import { useRouter } from "next/router";
import Image from "next/image";

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, UX_MODE } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import { useAuth } from "@/hooks/useAuth";

import logo from "../../../public/images/logo.jpg";

import { useSignature } from "@/hooks/useSignature";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { setCategory, setIsWaitingScreenVisible } from "@/redux/slices/userSlice";
import { shallowEqual, useSelector } from "react-redux";


const Signup = () => {
  const [emailValid, setEmailValid] = useState(true);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const emailRef = useRef();

  const { signatureObject } = useSignature();

  const { setTemporaryToken, signIn } = useAuth();

  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);

  const {isWaitingScreenVisible} = useSelector((state) => {
    const {isWaitingScreenVisible} = state.userReducer;
    return {isWaitingScreenVisible}
  }, shallowEqual);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME,
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
        };

        const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3AuthNoModal({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          privateKeyProvider,
          chainConfig
        });

        setWeb3auth(web3auth);

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
          }
        });
        web3auth.configureAdapter(openloginAdapter);

        await web3auth.init();
        setProvider(web3auth.provider);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (web3auth?.status === "connected" && provider) {

          const userInformation = await web3auth.getUserInfo();
          const solanaWallet = new SolanaWallet(provider);
          const accounts = await solanaWallet.requestAccounts();
          const { sign, sign_nonce, sign_issue_at, sign_address } = await signatureObject(accounts[0]);

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
            router.push("/homepage/dashboard2");
          } else {
            await web3auth.logout();
            setProvider(null);

            setTemporaryToken(JSON.parse(localStorage.getItem("openlogin_store")));
            dispatch(
              setCategory({
                email: userInformation.email,
                blockchainAddress: accounts[0],
              })
            );

            router.replace(`/auth/join/intro`);
          }
          setIsRedirecting(true)
          dispatch(setIsWaitingScreenVisible(false))
        }
      } catch (error) {
        console.error(error)
        dispatch(setIsWaitingScreenVisible(false))
      } 
    })()
  },[web3auth?.status])

  const loginUser = async (isEmail) => {
    if (!web3auth) {
      toast.error("Web3auth not initialized yet");
      return;
    }

    let web3authProvider = null;

<<<<<<< HEAD
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

        router.push("/homepage/dashboard2");
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
        setIsVisitYourInboxVisible(false);
        router.replace(`/auth/join/intro`);

        // router.replace('/homepage/dashboard');
=======
    if (isEmail) {
      const email = emailRef.current.value;
  
      if (!isEmailValid(email)) {
        toast.error("Login: email is not valid", email);
>>>>>>> dev-deploy
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
    dispatch(setIsWaitingScreenVisible(true))

    setProvider(web3authProvider);
  };

  const handleSwitchingBetweenLoginAndRegister = () => {
    setIsLogin((prev) => !prev);
    setIsNewsletterChecked(false);
  };

  const isEmailValid = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Login</title>
      </Head>
      {!isWaitingScreenVisible && !isRedirecting && (
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
              onClick={() => loginUser(false)}
              type="button"
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
              Thanks for waiting. We're moving you to a new page. Please don't refresh while we do this.
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Signup;
