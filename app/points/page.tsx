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
import { useMobile } from "@/hooks/useMobile";
import ReferralActivities from "@/Components/Referral/ReferralActivities";
import RewardService from "@/services/reward";
import { UserRewards } from "@/types";
import ReferralHistoryTable from "@/Components/Referral/ReferralHistoryTable";
import LeaderboardTable from "@/Components/Referral/LeaderboardTable";

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
  const sections = ["The Program", "Share", "History", "Leaderboard"];

  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !web3authStatus) return;
      try {
        setFetchingCode(true);

        const [referralData, rewardsInfo] = await Promise.all([retrieveUserReferralData(), getUserRewardsInfo()]);

        if (referralData) setData(referralData);
        if (rewardsInfo) setUserRewards(rewardsInfo);

        setFetchingCode(false);
      } catch (error) {
        console.error(error);
        setFetchingCode(false);
      }
    };

    fetchData();
  }, [user, web3authStatus]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };
  const { isMobile } = useMobile();

  const skyPoint: string | null = userRewards?.stats._sum.point?.toString() ?? "0";

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Points Program</title>
      </Head>

      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F6FAFF]">
        <Sidebar />
        <div className="flex h-full w-full flex-col">
          <PageHeader pageTitle={"Points Program"} />
          <div className="relative mb-[78.22px] flex h-full w-full flex-col gap-8 overflow-y-scroll py-6 md:mb-0 md:py-[37px]">
            <Switcher sections={sections} activeSection={activeIndex} setActiveSection={setActiveIndex} />

            <AlertMessage />

            <div className="w-full items-center justify-between md:flex">
              <PointBalance point={skyPoint} isLoading={fetchingCode} />
              <ReferralActivities />
            </div>
            <div>
              <div className="flex flex-col items-center">
                {!isMobile && (
                  <div className="flex w-[95%] gap-10 border-b-4 border-[#D3D3D3]">
                    {["The Program", "Share Referral Link", "Your Referral History", "Leaderboard"].map(
                      (item, index) => (
                        <div
                          key={index}
                          onClick={() => handleClick(index)}
                          className="relative cursor-pointer px-8 py-1.5 text-[16px] text-[#222222] transition delay-75 ease-linear"
                        >
                          <span>{item}</span>
                          {activeIndex === index && (
                            <div className="absolute bottom-[-4px] left-0 right-0 h-1 bg-[#0653EA]"></div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="mx-auto mt-8 w-full">
                  {activeIndex === 0 && <ReferralProgramOverview activeSection={activeSection} section={0} />}
                  {activeIndex === 1 && (
                    <div>
                      <Share isLoading={fetchingCode} referralCode={data?.referralCode} />
                      <InviteYourFriends referralCode={data?.referralCode} />
                    </div>
                  )}
                  {activeIndex === 2 && (
                    <div className="container mx-auto p-4">
                      <div className="flex h-full w-full flex-wrap-reverse justify-center gap-10">
                        <div className="w-full rounded-2xl md:w-[55%] md:bg-white md:p-8">
                          <ReferralHistoryTable />
                        </div>
                        <div className="md:w-[40%]">
                          <YourReferrals
                            registeredFriends={data.registeredFriends}
                            registeredAirspaces={data.registeredAirspaces}
                            validatedProperties={data.validatedProperties}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeIndex === 3 && (
                    <div className="container mx-auto p-4">
                      <LeaderboardTable point={skyPoint} isLoadingSkyBalance={fetchingCode} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Points;
