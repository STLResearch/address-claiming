import { FC, Fragment } from "react";

import Item from "@/Components/Dashboard/Item";
import { EarthIcon, GiftIcon, ShareIcon, GiftIconSm } from "../Shared/Icons";
import ReferralProgramItem from "./ReferralProgramItem";
import Path from "./Path";

const ReferralProgram: FC = () => {
  return (
    <Item
      title={"Referral Program"}
      icon={<GiftIcon />}
      linkText={"View referral program"}
      href={"/points"}
      style={"h-fit"}
    >
      <div className="flex items-center justify-center gap-[8.37px] md:flex-col md:px-[17px]">
        <ReferralProgramItem
          icon={<ShareIcon color={""} />}
          title={"Share"}
          text={"Send your invite link or code to your friends and explain them how cool is SkyTrade"}
        />
        <Path />
        <ReferralProgramItem
          icon={<EarthIcon />}
          title={"Register & Claim"}
          text={"Let them register and claim their air rights using your referral link or code"}
        />
        <Path />
        <ReferralProgramItem
          icon={<GiftIconSm />}
          title={"Earn"}
          text={
            <Fragment>
              You and your friends are rewarded with <span className="font-bold">5 SKY points</span> and{" "}
              <span className="font-bold">+10%</span> on top of the passive income generated by those you refer{" "}
              <span className="font-bold">FOREVER</span>
            </Fragment>
          }
        />
      </div>
    </Item>
  );
};

export default ReferralProgram;
