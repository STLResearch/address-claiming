import { FC } from "react";
import { useRouter } from "next/navigation";
import {
  DroneIcon,
  LocationPointIcon,
  ChevronRightIcon,
} from "../Shared/Icons";
import Item from "@/Components/Dashboard/Item";
import { BalanceLoader } from "@/Components/Wrapped";
import { PropertyData } from "@/types";

interface MyAirspacesProps {
  airspaces: PropertyData[];
  totalAirspace: number;
  isLoading: boolean;
}

const MyAirspaces: FC<MyAirspacesProps> = ({
  airspaces = [],
  totalAirspace,
  isLoading,
}) => {
  const router = useRouter();
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
      icon={<DroneIcon />}
      linkText={`${!isLoading ? "View all airspaces" : ""}`}
      href={"/portfolio"}
    >
      {isLoading ? (
        <BalanceLoader />
      ) : (
        <div className="flex flex-col items-center gap-[29px]">
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
                  onClick={() => router.push(`/portfolio?id=${airspace?.id}`)}
                  className="rounded-lg w-full py-[16px] px-[22px] flex items-center gap-[10px] cursor-pointer"
                  style={{ border: "1px solid #4285F4" }}
                >
                  <div className="w-[24px] h-[24px] flex justify-center items-center">
                    <LocationPointIcon />
                  </div>
                  <p className="flex-1">{airspace.title || airspace.address}</p>
                  <div className="w-[18px] h-[18px] cursor-pointer flex items-center justify-center">
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
