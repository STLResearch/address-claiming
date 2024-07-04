import React, { ReactNode } from "react";
import { useState } from "react";
import { LoadingSpinner } from "../Shared/Icons";

interface PropsI {
  children: ReactNode;
  onClick: any;
  isLoading: boolean;
  color?: string;
  className?: string;
}

const LoadingButton = ({ children, onClick, isLoading, color, className }: PropsI) => {
  const [loading, setLoading] = useState(isLoading);
  const handleClick = async () => {
    try {
      setLoading(true);
      await onClick();
    }catch(error){
      console.error("error:",error)
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? <LoadingSpinner color={color} /> : <>{children}</>}
    </button>
  );
};

export default LoadingButton;
