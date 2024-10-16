import React from "react";

import { EarthIcon, FriendsIcon, PropertyIcon } from "@/Components/Icons";
import YourReferralsItem from "./YourReferralsItem";
interface YourReferralsProps {
  registeredFriends: number;
  registeredAirspaces: number;
  validatedProperties: number;
}

const YourReferrals: React.FC<YourReferralsProps> = ({
  registeredFriends,
  registeredAirspaces,
  validatedProperties,
}) => {
  return (
    <div className="flex flex-col gap-[15px] px-[10px]">
      <p className="text-[#222222] text-xl font-normal">Your referrals</p>
      <p className="text-[#87878D] text-[15px] font-normal">
        Stay in the loop on your referral influence and monitor the number of
        your friends who used your referral link or code and became part of the
        SkyTrade revolution.
      </p>
      <YourReferralsItem
        icon={<FriendsIcon />}
        number={registeredFriends}
        text={"Registered friends"}
      />
      <div className="w-[39px]" style={{ border: "1px solid #D9D9D9" }} />
      <YourReferralsItem
        icon={<EarthIcon isActive={true} />}
        number={registeredAirspaces}
        text={"Registered airspaces"}
      />
      <div className="w-[39px]" style={{ border: "1px solid #D9D9D9" }} />
      <YourReferralsItem
        icon={<PropertyIcon />}
        number={validatedProperties}
        text={"Validated properties"}
      />
    </div>
  );
};

export default YourReferrals;
