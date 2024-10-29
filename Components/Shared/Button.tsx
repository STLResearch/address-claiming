import React from "react";
import { RiLoader4Fill } from "react-icons/ri";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  secondary?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, label, secondary, isLoading }) => {
  if (secondary) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className="w-full rounded-lg border border-dark-blue bg-white py-2 text-center text-[14px] text-base text-dark-blue"
      >
        {isLoading ?
          <div className="flex w-full items-center justify-center">
            <RiLoader4Fill className="h-6 w-6 animate-spin" />
          </div>
        : label}
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${disabled ? "bg-gray-300" : "bg-dark-blue"} w-full rounded-lg py-2 text-[14px] text-base text-white`}
    >
      {isLoading ?
        <div className="flex w-full items-center justify-center">
          <RiLoader4Fill className="h-6 w-6 animate-spin" />
        </div>
      : label}
    </button>
  );
};

export default Button;
