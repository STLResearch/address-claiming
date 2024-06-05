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

const Referral = () => {
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
  const sections = ["The Program", "Share", "My Referrals"];
  useEffect(() => {
    (async () => {
      try {
        setFetchingCode(true);
        if (!user) return;
        const responseData = await retrieveUserReferralData();
        if (responseData) {
          setData(responseData);
          setFetchingCode(false);
        }
      } catch (error) {
        console.log(error);
        setFetchingCode(false);
      }
    })();
  }, [user, web3authStatus]);

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Referral Program</title>
      </Head>

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <PageHeader pageTitle={"Referral Program"} />
          <section className="relative w-full h-full py-6 md:py-[37px] flex flex-col gap-8 mb-[78.22px] md:mb-0 overflow-y-scroll">
            <Switcher
              sections={sections}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <AlertMessage />

            <PointBalance registeredFriends={data?.registeredFriends} />

            <ReferralProgramOverview
              activeSection={activeSection}
              section={0}
            />
            {activeSection === 1  && (
              <Share
                isLoading={fetchingCode}
                referralCode={data?.referralCode}
              />
            )}
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

export default Referral;
