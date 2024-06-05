import React from "react";

interface CollapseAirspaceProps {
  collapse: () => void;
  transition: boolean;
}

const CollapseAirspace: React.FC<CollapseAirspaceProps> = (props) => {
  return (
    <button
      onClick={props.collapse}
      className="absolute top-32 z-10 flex flex-row items-center justify-center bg-white transition-all duration-500 ease-in-out hover:bg-bleach-blue"
      style={{
        width: "29px",
        height: "61px",
        transition: "all",
        left: `${props.transition ? "" : "360px"}`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          props.transition ? "rotate-180" : ""
        } bi bi-caret-left-fill transition-all duration-500 ease-in-out`}
        width="16"
        height="16"
        fill="#3F3D56"
        viewBox="0 0 16 16"
      >
        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
      </svg>
    </button>
  );
};

export default CollapseAirspace;
