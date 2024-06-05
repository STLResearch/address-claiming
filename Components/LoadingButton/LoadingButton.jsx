import React from "react";
import { useState } from "react";
import { LoadingSpinner } from "../Shared/Icons";

const LoadingButton = ({ children, onClick, isLoading, color, className }) => {
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
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? <LoadingSpinner color={color} /> : <>{children}</>}
    </button>
  );
};

export default LoadingButton;
