import React from "react";
import { ArrowLeftIcon } from "../Icons";
import AirspacesList from "./AirSpaceList";
import AirSpaceEmptyList from "./AirSpaceEmptyList";
import { PropertyData } from "@/types";
interface Props {
  setShowAirspacePage: React.Dispatch<React.SetStateAction<boolean>>;
  airspaces: PropertyData[];
}
const MyMobileAirspacesPage = ({
  setShowAirspacePage,
  airspaces = [],
}: Props) => {
  return (
    <div
      className=" w-full bg-white flex flex-col fixed top-0 left-0 z-40"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="">
        <div className="w-full p-4 shadow-md flex items-center">
          <div className="w-6 h-6" onClick={() => setShowAirspacePage(false)}>
            <ArrowLeftIcon />
          </div>
          <h1 className="text-2xl font-bold text-center flex-grow">
            My Air Rights
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center w-full  mt-[1rem] bg-white">
          {}
          {airspaces.length === 0 ? (
            <AirSpaceEmptyList />
          ) : (
            <AirspacesList airspaces={airspaces} />
          )}
          <button
            onClick={() => setShowAirspacePage(false)}
            className="bg-[#0653EA] text-white p-3 rounded-lg w-[90%] mt-[6rem]"
          >
            Claim Air Rights
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyMobileAirspacesPage;
