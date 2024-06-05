import React, { ReactNode } from "react";

interface AirspacesProps {
  transition: boolean;
  airspace: string;
  allAirspace?: boolean;
  myAirspace?: boolean;
  showMyAirspace: () => void;
  children?: ReactNode;
}

const Airspaces: React.FC<AirspacesProps> = (props) => {
  return (
    <>
      <div
        className={`absolute top-5 z-10 bg-white transition-all duration-500 ease-in-out ${
          props.transition ? "-translate-x-96" : ""
        }`}
        style={{
          width: "340px",
          height: "80%",
          left: "20px",
          borderRadius: "5px",
        }}
      >
        <div className="flex flex-row">
          <button
            onClick={props.showMyAirspace}
            className={`${
              props.airspace === "mine" ? "bg-dark-blue text-white" : ""
            } font-bold hover:bg-dark-blue hover:text-white`}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "5px 5px 0px 0px",
            }}
          >
            Airspaces
          </button>
        </div>
        <div
          className="flex flex-row justify-center"
          style={{
            width: "340px",
            height: "100%",
            background: "linear-gradient(180deg, #0653EA, white)",
          }}
        >
          {props.allAirspace && (
            <div
              className="flex flex-col items-center overflow-y-auto bg-white pb-10"
              style={{ width: "99%", height: "100%", marginTop: "2px" }}
            >
              {props.children}
            </div>
          )}

          {props.myAirspace && (
            <div
              className="flex flex-col items-center overflow-y-auto overflow-x-hidden bg-white px-5"
              style={{ width: "99%", height: "100%" }}
            >
              {props.children}
            </div>
          )}
        </div>
        <div
          className="flex flex-row items-center rounded-b-md bg-white text-center"
          style={{ width: "100%", height: "30px" }}
        ></div>
      </div>
    </>
  );
};

export default Airspaces;
