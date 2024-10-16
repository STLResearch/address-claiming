import React, { FormEvent, useState } from "react";
import { User } from "../../types";

interface PersonalInformationProps {
  personalInformation: User;
  setPersonalInformation: React.Dispatch<React.SetStateAction<User>>;
  isPhoneNumberValid: boolean;
  errorMessage: string;
  isLoading: boolean;
  updateDataHandler: (e: FormEvent<HTMLButtonElement>) => void;
  setIsPhoneNumberValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const PersonalInformation = ({
  personalInformation,
  setPersonalInformation,
  isPhoneNumberValid,
  errorMessage,
  isLoading,
  updateDataHandler,
  setIsPhoneNumberValid,
}: PersonalInformationProps) => {
  const [isChanged, setIsChanged] = useState(false);

  return (
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
            onChange={(e) => {
              setIsChanged(true);
              setPersonalInformation((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
            className="md:py-[16px] py-3 px-2 md:px-[22px] w-full rounded-lg text-[14px] font-normal text-[#222222] outline-none"
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
            readOnly={true}
            onChange={(e) =>
              setPersonalInformation((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            className="md:py-[16px] py-3 px-2 md:px-[22px] w-full rounded-lg text-[14px] font-normal text-[#222222] outline-none"
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
              setIsChanged(true);
              setIsPhoneNumberValid(true);
              setPersonalInformation((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }));
            }}
            className="md:py-[16px] py-3 px-2 md:px-[22px] w-full rounded-lg text-[14px] font-normal text-[#222222] outline-none"
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
            <p className="text-[11px] italic text-red-600">{errorMessage}</p>
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
            disabled={isLoading || !isChanged}
            className={`font-medium text-base ${!isChanged ? "text-gray-400 cursor-not-allowed" : "text-[#0653EA] cursor-pointer"}`}
            onClick={updateDataHandler}
          >
            {" "}
            Save changes{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
