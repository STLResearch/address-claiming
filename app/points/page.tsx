"use client";
import { Fragment, useEffect, useState } from "react";

import PageHeader from "@/Components/PageHeader";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import UserService from "@/services/UserService";
import Switcher from "@/Components/Referral/Switcher";
import InviteYourFriends from "@/Components/Referral/InviteYourFriends";
import YourReferrals from "@/Components/Referral/YourReferrals/YourReferrals";
import Share from "@/Components/Referral/Share/Share";
import AlertMessage from "@/Components/Referral/AlertMessage";
import ReferralProgramOverview from "@/Components/Referral/ReferralProgramOverview/ReferralProgramOverview";
import Sidebar from "@/Components/Shared/Sidebar";
import PointBalance from "@/Components/Referral/PointBalance";
import RewardService from "@/services/RewardService";
import { UserRewards } from "@/types";

const Points = () => {
  const [fetchingCode, setFetchingCode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [data, setData] = useState({
    referralCode: "",
    registeredFriends: 0,
    registeredAirspaces: 0,
    validatedProperties: 0,
  });
  const { user, web3authStatus } = useAuth();
  const { retrieveUserReferralData } = UserService();
  const { getUserRewardsInfo } = RewardService();
  const sections = ["The Program", "Share", "My Referrals"];

  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !web3authStatus) return;
      try {
        setFetchingCode(true);

        const [referralData, rewardsInfo] = await Promise.all([
          retrieveUserReferralData(),
          getUserRewardsInfo()
        ]);

        if (referralData) setData(referralData);
        if (rewardsInfo) setUserRewards(rewardsInfo);

        setFetchingCode(false);
      } catch (error) {
        console.log(error);
        setFetchingCode(false);
      } 
    };

    fetchData();
  }, [user, web3authStatus]);

  const skyPoint: string | null = userRewards?.stats._sum.point?.toString() ?? '0';


  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Points Program</title>
      </Head>

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <PageHeader pageTitle={"Points Program"} />
          <section className="relative w-full h-full py-6 md:py-[37px] flex flex-col gap-8 mb-[78.22px] md:mb-0 overflow-y-scroll">
            <Switcher
              sections={sections}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <AlertMessage />

            <PointBalance point={skyPoint} />

            <ReferralProgramOverview
              activeSection={activeSection}
              section={0}
            />
            
            <Share
              isLoading={fetchingCode}
              referralCode={data?.referralCode}
            />
   
            <InviteYourFriends referralCode={data?.referralCode} />
            <YourReferrals
              activeSection={activeSection}
              section={2}
              registeredFriends={data?.registeredFriends}
              registeredAirspaces={data?.registeredAirspaces}
              validatedProperties={data?.validatedProperties}
            />
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Points;