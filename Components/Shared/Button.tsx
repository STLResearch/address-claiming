import React from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  secondary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, label, secondary }) => {
  if (secondary) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className="w-full rounded-lg border border-dark-blue bg-white py-2 text-[14px] text-base text-dark-blue"
      >
        {label}
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${disabled ? "bg-gray-300" : "bg-dark-blue"} w-full rounded-lg py-2 text-[14px] text-base text-white`}
    >
      {label}
    </button>
  );
};

export default Button;
