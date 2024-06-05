import React, { FC, useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

import Link from "next/link";

import useInitAuth from "@/hooks/useInitAuth";
import useAuth from "@/hooks/useAuth";

import EmailInput from "./EmailInput";
import { Web3authContext } from "@/providers/web3authProvider";
import { WALLET_ADAPTERS } from "@web3auth/base";
import LoadingButton from "../LoadingButton/LoadingButton";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  isNewsletterChecked: boolean;
  setIsNewsletterChecked: (value: boolean) => void;
}

const AuthForm: FC<AuthFormProps> = ({
  isLogin,
  setIsLogin,
  isNewsletterChecked,
  setIsNewsletterChecked,
}) => {
  const [emailValid, setEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { init } = useInitAuth();
  const { signIn } = useAuth();
  const { web3auth, provider, setProvider } = useContext(Web3authContext);

  const isEmailValid = (email: string): boolean => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

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

  const handleSwitchingBetweenLoginAndRegister = () => {
    setIsLogin(!isLogin);
    setIsNewsletterChecked(!isNewsletterChecked);
  };

  return (
    <form
      className="relative mx-auto flex flex-col items-center justify-center gap-[15px] rounded bg-white px-[30px] py-[40px]"
      style={{ maxWidth: "449px" }}
      id="login"
      name="login"
      onSubmit={(e) => {
        e.preventDefault();
        loginUser(true);
      }}
    >
      <Image
        src={"/images/logo.svg"}
        alt="Company's logo"
        width={199}
        height={77}
      />
      <p className="mt-[25px] text-xl font-medium text-light-black">
        Welcome{isLogin && " back"} to SkyTrade
      </p>
      <p className="text-base text-light-black">
        {isLogin ? "Login" : "Register"}
      </p>
      {isLogin && (
        <p className="text-center text-sm text-light-grey">
          Sign in effortlessly using the authentication method you chose during
          sign up.
        </p>
      )}
      <EmailInput
        emailRef={emailRef}
        emailValid={emailValid}
        setEmailValid={setEmailValid}
      />
      {!isLogin && (
        <label className="flex w-full gap-[11px] text-[14px] text-[#87878D]">
          <input
            className="h-[18px] w-[18px] cursor-pointer"
            type="checkbox"
            id="newsletterCheckbox"
            name="newsletterCheckbox"
            checked={isNewsletterChecked}
            onChange={() => setIsNewsletterChecked(!isNewsletterChecked)}
          />
          Send me newsletter to keep me updated
        </label>
      )}
      <LoadingButton
        color={""}
        onClick={() => loginUser(true)}
        isLoading={isLoading}
        className="w-full flex justify-center rounded-md bg-dark-blue px-24 py-4 text-[15px] text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
      >
        Get started
      </LoadingButton>
      <div className="relative flex w-full items-center gap-[15px] text-center align-middle text-[#00000033]">
        <div
          style={{ width: "100%", height: "1px", background: "#00000033" }}
        />
        <p className="text-sm">or</p>
        <div
          style={{ width: "100%", height: "1px", background: "#00000033" }}
        />
      </div>
      <LoadingButton
        color={""}
        onClick={() => loginUser(false)}
        isLoading={isLoading}
        className="w-full flex justify-center"
      >
        <div className="flex w-full items-center justify-between rounded-lg py-4 pl-[18px] pr-[42px] transition-all duration-500 ease-in-out hover:bg-bleach-blue border border-[#595959]">
          <Image
            src="/images/google-logo.png"
            alt="Google's logo"
            width={24}
            height={24}
          />
          <p className="mx-auto text-[#595959]">Connect with Google</p>
        </div>
      </LoadingButton>
      <LoadingButton
        color={""}
        onClick={() => loginUser(false)}
        isLoading={isLoading}
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
      <div style={{ width: "100%", height: "1px", background: "#00000033" }} />
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
  );
};

export default AuthForm;
