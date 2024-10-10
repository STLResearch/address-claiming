"use client";
import React, { useEffect, useRef, useState, Fragment, FormEvent } from "react";
import { createPortal } from "react-dom";
import { shallowEqual } from "react-redux";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";
import useAuth from "@/hooks/useAuth";
import UserService from "@/services/UserService";
import { checkPhoneIsValid } from "@/Components/Auth/PhoneValidation";
import PartOne from "@/Components/Auth/PartOne";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCategory } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const IndividualSignup: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { category } = useAppSelector((state) => {
    const { category } = state.userReducer;
    return { category };
  }, shallowEqual);

  const { createUser } = UserService();
  const { signIn } = useAuth();

  const [part, setPart] = useState(0);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const referralCodeRef = useRef<HTMLInputElement>(null);

  const [referralCode, setReferralCode] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isStatusValid, setIsStatusValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [referralDisabled, setReferralDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("This field is mandatory");

  useEffect(() => {
    const categoryData = localStorage.getItem("category");
    if (categoryData) {
      const currentCategory = JSON.parse(categoryData);
      dispatch(setCategory(currentCategory));
    }
  }, [dispatch]);

  useEffect(() => {
    setPageLoad(false);
    if (typeof window !== "undefined") {
      const codeString = localStorage.getItem("referralCode");
      if (!codeString) return;
      setReferralCode(decodeURIComponent(codeString));
      setReferralDisabled(true);
    }
  }, []);

  const isEmailValid = (email: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (name === "") {
        setIsNameValid(false);
      }

      const phoneCheck = await checkPhoneIsValid(phoneNumber);
      if (!phoneCheck.status) {
        setIsPhoneNumberValid(false);
        setErrorMessage(phoneCheck.message);
      }

      if (!isEmailValid(category.email)) {
        toast.error("Login: email is not valid");
      }
      if (status === null) {
        setIsStatusValid(false);
      }
      if (name === "" || !phoneCheck.status || status === null || !isEmailValid(category.email)) {
        return;
      }

      const userInfo = {
        ...category,
        name,
        newsletter: false,
        categoryId: status,
        phoneNumber,
        referralCode,
      };

      setIsLoading(true);

      const responseData = await createUser(userInfo);

      if (responseData && !responseData.errorMessage) {
        signIn({
          user: responseData,
        });
        setName("");
        setPhoneNumber("");
        if (referralCodeRef.current) referralCodeRef.current.value = "";

        localStorage.setItem("showTour", "true");

        router.replace("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      swal({
        title: "Sorry!",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoad) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Head>
        <title>StyTrade - Login</title>
      </Head>
      {isLoading && createPortal(<Backdrop />, document.getElementById("backdrop-root")!)}
      {isLoading && createPortal(<Spinner />, document.getElementById("backdrop-root")!)}

      <div className="mx-auto flex h-screen w-screen items-center justify-center bg-[#F6FAFF] max-sm:bg-[white] md:h-full md:w-full">
        <div className="m-auto flex w-full flex-col items-center justify-center gap-[15px] bg-white px-[30px] py-[40px] md:w-[449px]">
          <Image src={"/images/logo-1.svg"} alt="Company's logo" width={199} height={77} />
          {part === 0 && <PartOne setPart={setPart} />}
          {part === 1 && (
            <Fragment>
              <div className="relative flex w-full flex-col gap-[5px]">
                <label
                  className="text-[14px] font-normal"
                  style={{
                    color: isNameValid ? "rgba(0, 0, 0, 0.50)" : "#E04F64",
                  }}
                >
                  Full Name<span className="text-[#E04F64]">*</span>
                </label>
                <input
                  type="name"
                  value={name}
                  onChange={(e) => {
                    setIsNameValid(true);
                    setName(e.target.value);
                  }}
                  placeholder="John Doe"
                  className="rounded-lg px-[22px] py-4 font-sans placeholder:text-sm placeholder:font-medium placeholder:text-[#B8B8B8] focus:outline-none"
                  style={{
                    border: isNameValid ? "1px solid #87878D" : "1px solid #E04F64",
                  }}
                />
                {!isNameValid && <p className="text-[11px] italic text-red-600">This field is mandatory</p>}
              </div>
              <div className="relative flex w-full flex-col gap-[5px]">
                <label
                  className="text-[14px] font-normal"
                  style={{
                    color: isPhoneNumberValid ? "rgba(0, 0, 0, 0.50)" : "#E04F64",
                  }}
                >
                  Phone<span className="text-[#E04F64]">*</span>
                </label>
                <div
                  className="rounded-lg px-[22px] py-4 font-sans placeholder:text-sm placeholder:font-medium placeholder:text-[#B8B8B8] focus:outline-none"
                  style={{
                    border: isPhoneNumberValid ? "1px solid #87878D" : "1px solid #E04F64",
                  }}
                >
                  <PhoneInput
                    defaultCountry="us"
                    value={phoneNumber}
                    onChange={(phone) => {
                      setIsPhoneNumberValid(true);
                      setPhoneNumber(phone);
                    }}
                    placeholder="Enter your phone number"
                  />
                </div>
                {!isPhoneNumberValid && <p className="text-[11px] italic text-red-600">{errorMessage}</p>}
              </div>
              <div className="relative flex w-full flex-col gap-[5px]">
                <label
                  className="text-[14px] font-normal"
                  style={{
                    color: isStatusValid ? "rgba(0, 0, 0, 0.50)" : "#E04F64",
                  }}
                >
                  Your status<span className="text-[#E04F64]">*</span>
                </label>
                <div className="flex flex-col gap-[11px]">
                  <label
                    className="flex items-center gap-[14.5px] rounded-lg px-[22px] py-4 text-[14px]"
                    style={{
                      border: isStatusValid ? "1px solid #87878D" : "1px solid #E04F64",
                    }}
                  >
                    <input
                      className="relative h-[16.67px] w-[16.67px] p-[2.5px]"
                      checked={status === 0}
                      value={0}
                      onChange={(e) => {
                        setIsStatusValid(true);
                        setStatus(Number(e.target.value));
                      }}
                      style={{
                        appearance: "none",
                        border: status !== 0 ? "2px solid #222222" : "2px solid #0653EA",
                        backgroundColor: status === 0 ? "#0653EA" : "transparent",
                        borderRadius: "50%",
                        backgroundClip: "content-box",
                      }}
                      type="checkbox"
                      name="individual"
                      id="individual"
                    />
                    I&apos;m an individual
                  </label>
                  <label
                    className="flex items-center gap-[14.5px] rounded-lg px-[22px] py-4 text-[14px]"
                    style={{ border: "1px solid #87878D" }}
                  >
                    <input
                      className="relative h-[16.67px] w-[16.67px] p-[2.5px]"
                      checked={status === 1}
                      value={1}
                      onChange={(e) => {
                        setIsStatusValid(true);
                        setStatus(Number(e.target.value));
                      }}
                      style={{
                        appearance: "none",
                        border: status !== 1 ? "2px solid #222222" : "2px solid #0653EA",
                        backgroundColor: status === 1 ? "#0653EA" : "transparent",
                        borderRadius: "50%",
                        backgroundClip: "content-box",
                      }}
                      type="checkbox"
                      name="corporate"
                      id="corporate"
                    />
                    I&apos;m a corporate entity
                  </label>
                </div>
                {!isStatusValid && <p className="text-[11px] italic text-red-600">This field is mandatory</p>}
              </div>
              <div className="relative flex w-full flex-col gap-[5px]">
                <label
                  className="text-[14px] font-normal"
                  style={{
                    color: "rgba(0, 0, 0, 0.50)",
                  }}
                >
                  Referral Code
                </label>
                <input
                  type="referralCode"
                  ref={referralCodeRef}
                  value={referralCode.toUpperCase()}
                  placeholder="Enter referral code"
                  onChange={(event) => {
                    setReferralCode(event.target.value?.toUpperCase());
                  }}
                  disabled={referralDisabled}
                  className="rounded-lg px-[22px] py-4 font-sans placeholder:text-sm placeholder:font-medium placeholder:text-[#B8B8B8] focus:outline-none"
                  style={{
                    border: "1px solid #87878D",
                  }}
                />
              </div>
              <div
                className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#0653EA] py-[16px] text-[15px] font-normal text-white"
                onClick={formSubmitHandler}
              >
                Submit
              </div>
            </Fragment>
          )}
          <div className="flex items-center justify-center gap-[11px] pt-5">
            {[0, 1].map((_, index) => (
              <div
                key={index}
                onClick={() => setPart(index)}
                className="h-[14px] w-[14px] cursor-pointer"
                style={{
                  background: index !== part ? "#D9D9D9" : "#0653EA",
                  border: index === part ? "1px solid #D9D9D9" : "#0653EA",
                  borderRadius: "50%",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default IndividualSignup;
