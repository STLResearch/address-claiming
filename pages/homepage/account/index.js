// "use client";

import { Fragment, useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { createPortal } from "react-dom";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import { ShieldIcon } from "@/Components/Icons";
import UserService from "@/services/UserService";
import { toast } from "react-toastify";

const Account = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [personalInformation, setPersonalInformation] = useState({
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
        createPortal(<Backdrop />, document?.getElementById("backdrop-root"))}
      {isLoading &&
        createPortal(<Spinner />, document?.getElementById("backdrop-root"))}

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
            <div
              className="flex flex-col py-[17px] px-[25px] rounded-[30px] gap-[15px] bg-white"
              style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-[#222222]">
                  Account verification
                </h2>
                {personalInformation.KYCStatusId !== 0 && (
                  <div className="flex justify-center items-center bg-[#1FD387] rounded-[50%] w-[42px] h-[42px]">
                    <div className="w-[14px] h-[17.73px]">
                      <ShieldIcon />
                    </div>
                  </div>
                )}
              </div>
              <p className="font-normal text-base text-[#87878D] pr-[42px]">
                {personalInformation.KYCStatusId !== 0
                  ? "Thank you, your account is successfully verified. We verify the identity of our customers to assess potential risks, prevent fraud, and comply with legal and regulatory requirements. Note that we store your data securely with advanced encryption and strict authentication measures to ensure utmost privacy and protection."
                  : "Your account is not verified. We verify the identity of our customers to assess potential risks, prevent fraud, and comply with legal and regulatory requirements. Note that we store your data securely with advanced encryption and strict authentication measures to ensure utmost privacy and protection."}
              </p>
              {!(personalInformation.KYCStatusId !== 0) && !isLoading && (
                <div
                  className="font-medium text-base text-[#0653EA] text-right flex-1 cursor-pointer"
                  disabled={isLoading}
                  onClick={onVerifyMyAccount}
                >
                  Verify my account
                </div>
              )}
            </div>
            <div
              className="flex flex-col py-[17px] px-[25px] rounded-[30px] gap-[15px] bg-white"
              style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
            >
              <h2 className="text-xl font-medium text-[#222222]">
                Personal Information
              </h2>
              <div className="flex flex-wrap gap-[10px]">
                <div className="flex flex-col gap-[5px] basis-full">
                  <label
                    className="font-normal text-[14px] text-[#838187]"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    value={personalInformation.name}
                    onChange={(e) =>
                      setPersonalInformation((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="py-[16px] px-[22px] rounded-lg text-[14px] font-normal text-[#222222] outline-none"
                    style={{ border: "1px solid #87878D" }}
                    type="text"
                    name="name"
                    id="name"
                  />
                </div>
                <div className="flex flex-col gap-[5px] basis-full md:basis-1/3 flex-1">
                  <label
                    className="font-normal text-[14px] text-[#838187]"
                    htmlFor="name"
                  >
                    Email
                  </label>
                  <input
                    value={personalInformation.email}
                    onChange={(e) =>
                      setPersonalInformation((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="py-[16px] px-[22px] rounded-lg text-[14px] font-normal text-[#222222] outline-none"
                    style={{ border: "1px solid #87878D" }}
                    type="text"
                    name="email"
                    id="email"
                  />
                </div>
                <div className="flex flex-col gap-[5px] basis-full md:basis-1/3 flex-1">
                  <label
                    className="font-normal text-[14px] text-[#838187]"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    value={personalInformation.phoneNumber}
                    onChange={(e) => {
                      setIsPhoneNumberValid(true);
                      setPersonalInformation((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }));
                    }}
                    className="py-[16px] px-[22px] rounded-lg text-[14px] font-normal text-[#222222] outline-none"
                    style={{
                      border: isPhoneNumberValid
                        ? "1px solid #87878D"
                        : "1px solid #E04F64",
                    }}
                    type="text"
                    name="phone"
                    id="phone"
                  />
                  {!isPhoneNumberValid && (
                    <p className="text-[11px] italic text-red-600">
                      {errorMessage}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-[10px] basis-full">
                  <label
                    className="font-normal text-[14px] text-[#838187]"
                    htmlFor="phone"
                  >
                    Newsletter
                  </label>
                  <div className="flex items-center gap-[11px]">
                    <input
                      checked={personalInformation.newsletter}
                      onClick={(e) =>
                        setPersonalInformation((prev) => ({
                          ...prev,
                          newsletter: !prev.newsletter,
                        }))
                      }
                      className="w-[18px] h-[18px] rounded-sm"
                      style={{ border: "2px solid #49454F " }}
                      type="checkbox"
                      name="phone"
                      id="phone"
                    />
                    <p className="text-[#87878D] text-[14px] font-normal">
                      Send me newsletter to keep me updated
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end flex-1">
                  <button
                    disabled={isLoading}
                    className="font-medium text-base text-[#0653EA] cursor-pointer"
                    onClick={updateDataHandler}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Account;
