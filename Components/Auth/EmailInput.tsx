import React, { FC, ChangeEvent, RefObject } from "react";

interface EmailInputProps {
  emailRef: RefObject<HTMLInputElement>;
  emailValid: boolean;
  setEmailValid: (isValid: boolean) => void;
}

const EmailInput: FC<EmailInputProps> = ({ emailRef, emailValid, setEmailValid }) => {
  return (
    <div className="relative flex w-full flex-col gap-[5px]">
      <label className="text-[14px] font-normal" style={{ color: emailValid ? "rgba(0, 0, 0, 0.50)" : "#E04F64" }}>
        Email<span className="text-[#E04F64]">*</span>
      </label>
      <input
        type="email"
        name="email"
        id="email"
        ref={emailRef}
        onChange={() => setEmailValid(true)}
        placeholder="email@mail.com"
        className="rounded-lg px-[22px] py-4 font-sans placeholder:text-sm placeholder:font-medium placeholder:text-[#B8B8B8] focus:outline-none"
        style={{
          border: emailValid ? "1px solid #87878D" : "1px solid #E04F64",
        }}
      />
      {!emailValid && <p className="text-[11px] italic text-red-600">Invalid email</p>}
    </div>
  );
};

export default EmailInput;
