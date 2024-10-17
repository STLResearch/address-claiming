import React, { ReactNode, useState } from "react";
import { LoadingSpinner } from "../Shared/Icons";

interface PropsI {
  children: ReactNode;
  onClick: any;
  isLoading: boolean;
  color?: string;
  type?: "button" | "reset" | "submit";
  className?: string;
  disable?: boolean;
}

const LoadingButton = ({
  children,
  onClick,
  isLoading,
  color,
  type,
  className,
  disable,
}: PropsI) => {
  const [loading, setLoading] = useState(isLoading);
  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disable}
      className={className}
      type={type}
    >
      {loading ? <LoadingSpinner color={color} /> : <>{children}</>}
    </button>
  );
};

export default LoadingButton;
