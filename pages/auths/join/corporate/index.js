// "use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import swal from "sweetalert";
import logo from "../../../../public/images/logo.svg";
import Script from "next/script";

import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";

import useAuth from "@/hooks/useAuth";
import UserService from "@/services/UserService";

const CorporateSignup = () => {
  const router = useRouter();
  const newsletterRef = useRef();
  const nameRef = useRef();
  const phoneNumberRef = useRef();
  const { createUser } = UserService();

  const [newsletter, setNewsletter] = useState(false);
  const [nameValid, setNameValid] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!category.categoryId) {
        router.replace("/auth/join");
        return;
      }
    }

    setPageLoad(false);
  }, []);

  // const {category} = useSelector((state) =>
  // {
  //   const {category} = state.userReducer
  //   return {category}
  // }, shallowEqual
  //  );

  const category = useSelector((state) => state.value.category);

  const { temporaryToken, signIn } = useAuth();

  const newsletterHandler = () => {
    setNewsletter((prev) => !prev);
  };

  const returnHandler = (e) => {
    e.preventDefault();
    router.push("/auth/join");
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const name = nameRef.current.value;
      const phoneNumber = phoneNumberRef.current.value;

      if (!name) {
        setNameValid(false);
        swal({
          title: "oops!",
          text: "Kindly complete all required fields",
          timer: 2000,
        });
        return;
      }

      if (
        !phoneNumber ||
        isNaN(+phoneNumber) ||
        phoneNumber.charAt(0) !== "+"
      ) {
        setPhoneNumberValid(false);
        swal({
          title: "Oops!",
          text: "Invalid phone number. Ensure to include country code starting with '+' (e.g +12124567890).",
          // timer: 3000
        });
        return;
      }

      const userInfo = {
        ...category,
        categoryId: +category.categoryId,
        name,
        phoneNumber: phoneNumber,
        newsletter,
      };

      setIsLoading(true);

      const responseData = await createUser(userInfo);

      if (responseData && responseData.errorMessage) {
        swal({
          title: "Sorry!",
          text: `${responseData.errorMessage}`,
        });
      } else if (responseData) {
        swal({
          title: "Submitted",
          text: "User registered successfully. You will now be signed in",
          icon: "success",
          button: "Ok",
        }).then(() => {
          signIn({
            token: temporaryToken,
            user: response,
          });

          nameRef.current.value = "";
          phoneNumberRef.current.value = "";
          router.replace("/dashboard");
        });
      } else {
        swal({
          title: "Sorry!",
          text: `something went wrong`,
        });
      }
    } catch (error) {
      console.error(error);

      swal({
        title: "Sorry!",
        text: `Something went wrong, please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const categoryData = localStorage.getItem("category");
    if (categoryData) {
      const currentCategory = JSON.parse(categoryData);
      dispatch(counterActions.setCategory(currentCategory));
    }
  }, []);

  if (pageLoad) {
    return <Spinner />;
  }

  return (
    <Fragment>
      {isLoading &&
        createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("backdrop-root"))}
      <form
        onSubmit={formSubmitHandler}
        className="px-auto relative mx-auto bg-white font-sans"
        style={{
          width: "680px",
          height: "100vh",
          maxHeight: "607px",
          padding: "93px 142px",
        }}
      >
        <button
          onClick={returnHandler}
          className="absolute left-8 top-8 flex flex-row items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
          >
            <path
              d="M0.999999 4L4.33333 7M0.999999 4L4.33333 1M0.999999 4L13 4"
              stroke="#252530"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Back</p>
        </button>
        {/* {error && <p className="text-sm mx-auto text-red-600">{error}</p>} */}
        <Image src={logo} alt="Company's logo" width={172} height={61} />
        <p
          className=" w-full text-2xl font-medium text-dark"
          style={{ marginTop: "28px" }}
        >
          Corporate Entity Sign Up
        </p>
        <div className="relative mt-3.5">
          <label className="text-sm font-normal text-light-brown">
            Company Name <span className="text-red-600">*</span>
          </label>{" "}
          <br />
          <input
            type="text"
            ref={nameRef}
            onChange={() => setNameValid(true)}
            className="rounded-md bg-light-grey font-sans placeholder:font-medium placeholder:text-light-brown focus:outline-blue-200"
            placeholder="Company Name"
            style={{
              width: "396px",
              height: "43px",
              paddingLeft: "14px",
              border: "0.5px solid rgba(0, 0, 0, 0.50)",
            }}
          />
          {!nameValid && (
            <p className="absolute right-0 top-1 text-sm text-red-600">
              name cannot be empty
            </p>
          )}
        </div>

        <div
          className="relative my-3.5"
          style={{ width: "396px", height: "43px" }}
        >
          <label
            className="text-sm font-normal"
            style={{ color: "rgba(0, 0, 0, 0.50)" }}
          >
            Phone Number<span className="text-red-600">*</span>
          </label>{" "}
          <br />
          <input
            ref={phoneNumberRef}
            onChange={() => setPhoneNumberValid(true)}
            type="text"
            min="0"
            placeholder="+12124567890"
            className="rounded-md bg-light-grey font-sans placeholder:font-medium placeholder:text-light-brown focus:outline-blue-200"
            style={{
              width: "396px",
              height: "43px",
              border: "0.5px solid rgba(0, 0, 0, 0.50)",
              paddingLeft: "14px",
            }}
          />
          {!phoneNumberValid && (
            <p className="absolute right-0 top-1 text-sm text-red-600">
              invalid phone number
            </p>
          )}
        </div>
        <div className="mt-12 flex flex-row items-center">
          <input
            type="checkbox"
            onChange={newsletterHandler}
            checked={newsletter}
            ref={newsletterRef}
            className="me-1 cursor-pointer rounded-md bg-light-grey"
          />
          <label
            onClick={newsletterHandler}
            className="cursor-pointer text-sm font-normal text-light-brown"
          >
            Send me news letters and keep me updated on daily news
          </label>
        </div>
        {/* <div className="mt-3.5 flex flex-row items-center">
                <input type="checkbox" onClick={robotHandler} checked={robot} ref={robotRef} className="me-1 bg-light-grey rounded-md cursor-pointer" />
                <label onClick={robotHandler} className="text-sm font-normal text-light-brown cursor-pointer">I am not a robot</label>
            </div> */}
        <div
          className="mt-3.5 text-sm"
          style={{ color: "rgba(0, 0, 0, 0.50)", fontWeight: "400" }}
        >
          By clicking Create Account, you acknowledge you have read and agreed
          to our{" "}
          <a
            href="https://sky.trade/terms.pdf"
            target="_blank"
            style={{ color: "#0653EA", textDecoration: "underline" }}
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            href="https://sky.trade/privacy.pdf"
            target="_blank"
            style={{ color: "#0653EA", textDecoration: "underline" }}
          >
            Privacy Policy
          </a>
          .
        </div>
        <button
          className="mt-4 rounded-md bg-dark-blue text-white  transition-all duration-500 ease-in-out hover:bg-blue-600"
          style={{ width: "396px", height: "46px" }}
        >
          Create Account
        </button>
      </form>
    </Fragment>
  );
};

export default CorporateSignup;
