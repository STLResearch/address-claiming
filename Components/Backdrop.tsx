import React from "react";

interface BackdropProps {
  onClick?: () => void;
}

const Backdrop: React.FC<BackdropProps> = (props) => {
  return (
    <div
      style={{ backgroundColor: "rgba(37, 37, 48, 0.45)" }}
      className="fixed left-0 top-0 z-[500] h-screen w-screen bg-slate-400 md:z-50"
      onClick={props?.onClick}
    ></div>
  );
};

export default Backdrop;
