"use client";

import { Fragment, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { createPortal } from "react-dom";

import PageHeader from "../../Components/PageHeader";
import Spinner from "../../Components/Spinner";
import Backdrop from "../../Components/Backdrop";

import UserService from "../../services/UserService";
import { toast } from "react-toastify";
import AccountVerification from "../../Components/MyAccount/AccountVerification";
import PersonalInformation from "../../Components/MyAccount/PersonalInformation";
import { PersonalInformationType } from "../../types";
import React from "react";
import Sidebar from "../Shared/Sidebar";
import { checkPhoneIsValid } from "../Auth/PhoneValidation";

const Account = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformationType>({
      name: "",
      email: "",
      phoneNumber: "",
      newsletter: false,
      KYCStatusId: 0,
    });

  const { user, updateProfile, web3authStatus } = useAuth();
  const { updateUser } = UserService();
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const { name, email, phoneNumber, newsletter, KYCStatusId } = user;
    setPersonalInformation({
      name,
      email,
      phoneNumber,
      newsletter,
      KYCStatusId,
    });
  }, [user, web3authStatus]);

  const updateDataHandler = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("User not logged in");

    const { name, email, phoneNumber, newsletter } = personalInformation;
    // TODO: check if data has changed
    // TODO: check if data is valid
    const check = await checkPhoneIsValid(phoneNumber);

    if (!check.status) {
      setIsPhoneNumberValid(false);
      setErrorMessage(check.message);
      return;
    }
    setIsLoading(true);

    try {
      const responseData = await updateUser({
        userId: user.id,
        name,
        phoneNumber,
        email,
      });

      if (responseData && responseData.errorMessage) {
        toast.error(responseData.errorMessage);
      } else if (responseData && !responseData.errorMessage) {
        const updatedUser = {
          ...user,
          name,
          phoneNumber,
          newsletter,
          email,
        };

        updateProfile(updatedUser);
        toast.success("Record updated succesfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyMyAccount = () => {
    setIsLoading(true);
    // @ts-ignore
    const client = new Persona.Client({
        templateId: process.env.NEXT_PUBLIC_TEMPLATE_ID,
        referenceId: user?.id.toString(),
        environmentId: process.env.NEXT_PUBLIC_ENVIRONMENT_ID,
        onReady: () => {
            setIsLoading(false);
            client.open();
        },
    });
  };

  return (
    <Fragment>
      {isLoading &&
        createPortal(<Backdrop />, document?.getElementById("backdrop-root")!)}
      {isLoading &&
        createPortal(<Spinner />, document?.getElementById("backdrop-root")!)}

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <PageHeader pageTitle={"Account"} />
          <section className="relative w-full h-full flex flex-col py-[29px] px-[21px] md:pl-[54.82px] md:pr-[47px] gap-[29px] md:mb-0 mb-[78.22px] overflow-y-auto">
            <div className="flex flex-col gap-[15px]">
              <h2 className="text-[#222222] font-normal text-xl">My Profile</h2>
              <p className="text-[#87878D] font-normal text-base">
                Update your account settings
              </p>
            </div>
            <AccountVerification
              KYCStatusId={personalInformation.KYCStatusId}
              isLoading={isLoading}
              onVerifyMyAccount={onVerifyMyAccount}
            />
            <PersonalInformation
              personalInformation={personalInformation}
              setPersonalInformation={setPersonalInformation}
              isPhoneNumberValid={isPhoneNumberValid}
              errorMessage={errorMessage}
              isLoading={isLoading}
              updateDataHandler={updateDataHandler}
              setIsPhoneNumberValid={setIsPhoneNumberValid}
            />
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Account;
