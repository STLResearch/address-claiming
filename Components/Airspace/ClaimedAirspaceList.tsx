import React from "react";
import { ArrowLeftIcon } from "../Icons";
import AirspacesList from "./AirSpaceList";
import AirSpaceEmptyList from "./AirSpaceEmptyList";
import { PropertyData } from "@/types";
interface Props {
  setShowAirspacePage: React.Dispatch<React.SetStateAction<boolean>>;
  airspaces: PropertyData[];
}
const MyMobileAirspacesPage = ({ setShowAirspacePage, airspaces = [] }: Props) => {
  return (
    <div className="fixed left-0 top-0 z-40 flex w-full flex-col bg-white" style={{ height: "calc(100vh - 80px)" }}>
      <div className="">
        <div className="flex w-full items-center p-4 shadow-md">
          <div className="h-6 w-6" onClick={() => setShowAirspacePage(false)}>
            <ArrowLeftIcon />
          </div>
          <h1 className="flex-grow text-center text-2xl font-bold">My Airspaces</h1>
        </div>

        <div className="mt-[1rem] flex w-full flex-col items-center justify-center bg-white">
          {}
          {airspaces.length === 0 ?
            <AirSpaceEmptyList />
          : <AirspacesList airspaces={airspaces} />}
          <button
            onClick={() => setShowAirspacePage(false)}
            className="mt-[6rem] w-[90%] rounded-lg bg-[#0653EA] p-3 text-white"
          >
            Claim Airspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyMobileAirspacesPage;
