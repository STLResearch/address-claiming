import { FC, Fragment } from "react";

import Item from "@/Components/Dashboard/Item";
import { EarthIcon, GiftIcon, ShareIcon } from "../Shared/Icons";
import ReferralProgramItem from "./ReferralProgramItem";
import Path from "./Path";

const ReferralProgram: FC = () => {
  return (
    <Item
      title={"Referral Program"}
      icon={<GiftIcon isActive />}
      linkText={"View referral program"}
      href={"/referral"}
      style={"h-fit"}
    >
      <div className="flex md:flex-col items-center justify-center gap-[8.37px] md:px-[17px] text-xs">
        <ReferralProgramItem
          icon={<ShareIcon color={""} />}
          title={"Share"}
          text={
            "Send your invite link or code to your friends and explain them how cool is SkyTrade"
          }
        />
        <Path />
        <ReferralProgramItem
          icon={<EarthIcon isActive={true} />}
          title={"Register & Claim"}
          text={
            "Let them register and claim their airspaces using your referral link or code"
          }
        />
        <Path />
        <ReferralProgramItem
          icon={<GiftIcon isActive={true} />}
          title={"Earn"}
          text={
            <Fragment>
              You and your friends are rewarded with{" "}
              <span className="font-bold">50 SKY points</span> and{" "}
              <span className="font-bold">+10%</span> on top of the passive
              income generated by those you refer{" "}
              <span className="font-bold">FOREVER</span>
            </Fragment>
          }
        />
      </div>
    </Item>
  );
};

export default ReferralProgram;
