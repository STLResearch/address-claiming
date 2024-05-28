import { FC } from "react";
import {
  DroneIcon,
  LocationPointIcon,
  ChevronRightIcon,
} from "../Shared/Icons";
import Item from "@/Components/Dashboard/Item";
import WorldMap from "@/Components/WorldMap";
import { BalanceLoader } from "@/Components/Wrapped";

interface MyAirspacesProps {
  airspaces: { title?: string; address: string }[];
  totalAirspace: number;
  isLoading: boolean;
}

const MyAirspaces: FC<MyAirspacesProps> = ({
  airspaces = [],
  totalAirspace,
  isLoading,
}) => {
  return (
    <Item
      title={
        <>
          My Airspaces{" "}
          {!isLoading && (
            <span className="text-[15px] font-normal">({totalAirspace})</span>
          )}
        </>
      }
      icon={<DroneIcon isActive />}
      linkText={`${!isLoading ? "View all airspaces" : ""}`}
      href={"/homepage/portfolio"}
    >
      {isLoading ? (
        <BalanceLoader />
      ) : (
        <div className="flex flex-col items-center gap-[29px]">
          <div className="w-[265.81px] h-[131.01px]">
            <WorldMap coloredCountries={["Spain"]} />
          </div>
          <div className="flex flex-col items-center gap-[7px] w-full">
            {airspaces.length === 0 && (
              <p className="text-[17px] text-[#222222] font-normal px-[55px] text-center">
                Claim your first piece of sky now!
              </p>
            )}
            {airspaces.length !== 0 &&
              airspaces.slice(0, 3).map((airspace, i) => (
                <div
                  key={i}
                  className="rounded-lg w-full py-[16px] px-[22px] flex items-center gap-[10px]"
                  style={{ border: "1px solid #4285F4" }}
                >
                  <div className="w-[24px] h-[24px] flex justify-center items-center">
                    <LocationPointIcon />
                  </div>
                  <p className="flex-1">{airspace.title || airspace.address}</p>
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <ChevronRightIcon />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Item>
  );
};

export default MyAirspaces;
