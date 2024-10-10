import { FC } from "react";
import { useRouter } from "next/navigation";
import { DroneIcon, LocationPointIcon, ChevronRightIcon } from "../Shared/Icons";
import Item from "@/Components/Dashboard/Item";
import { BalanceLoader } from "@/Components/Wrapped";
import { PropertyData } from "@/types";

interface MyAirspacesProps {
  airspaces: PropertyData[];
  totalAirspace: number;
  isLoading: boolean;
}

const MyAirspaces: FC<MyAirspacesProps> = ({ airspaces = [], totalAirspace, isLoading }) => {
  const router = useRouter();
  return (
    <Item
      title={<>My Airspaces {!isLoading && <span className="text-[15px] font-normal">({totalAirspace})</span>}</>}
      icon={<DroneIcon />}
      linkText={`${!isLoading ? "View all airspaces" : ""}`}
      href={"/portfolio"}
    >
      {isLoading ?
        <BalanceLoader />
      : <div className="flex flex-col items-center gap-[29px]">
          <div className="flex w-full flex-col items-center gap-[7px]">
            {airspaces.length === 0 && (
              <p className="px-[55px] text-center text-[17px] font-normal text-[#222222]">
                Claim your first piece of sky now!
              </p>
            )}
            {airspaces.length !== 0 &&
              airspaces.slice(0, 3).map((airspace, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/portfolio?id=${airspace?.id}`)}
                  className="flex w-full cursor-pointer items-center gap-[10px] rounded-lg px-[22px] py-[16px]"
                  style={{ border: "1px solid #4285F4" }}
                >
                  <div className="flex h-[24px] w-[24px] items-center justify-center">
                    <LocationPointIcon />
                  </div>
                  <p className="flex-1">{airspace.title || airspace.address}</p>
                  <div className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center">
                    <ChevronRightIcon />
                  </div>
                </div>
              ))}
          </div>
        </div>
      }
    </Item>
  );
};

export default MyAirspaces;
