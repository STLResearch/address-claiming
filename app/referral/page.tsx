import { Fragment, useEffect, useState } from "react";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import { useMobile } from "@/hooks/useMobile";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import UserService from "@/services/UserService";
import Switcher from "@/Components/Referral/Switcher";
import InviteYourFriends from "@/Components/Referral/InviteYourFriends";
import YourReferrals from "@/Components/Referral/YourReferrals/YourReferrals";
import Share from "@/Components/Referral/Share/Share";
import AlertMessage from "@/Components/Referral/AlertMessage";
import ReferralProgramOverview from "@/Components/Referral/ReferralProgramOverview/ReferralProgramOverview";
import MainLayout from "@/layout/MainLayout";

const Referral = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [data, setData] = useState({
    referralCode: "",
    registeredFriends: 0,
    registeredAirspaces: 0,
    validatedProperties: 0,
  });
  const { isMobile } = useMobile();
  const { user, web3authStatus } = useAuth();
  const { retrieveUserReferralData } = UserService();

  const sections = ["The Program", "Share", "My Referrals"];

  useEffect(() => {
    (async () => {
      try {
        if (!user) return;
        const responseData = await retrieveUserReferralData();
        if (responseData) {
          setData(responseData);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user, web3authStatus]);

  return (
    <MainLayout
      title="Referral Program"
      isLoading={false}
      showSidebar={true}
      showPageHeader={true}
    >
      <section className="relative w-full h-full py-6 md:py-[37px] flex flex-col gap-8 mb-[78.22px] md:mb-0 overflow-y-scroll">
        <Switcher
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <AlertMessage />
        <ReferralProgramOverview
          activeSection={activeSection}
          isMobile={isMobile}
          section={0}
        />
        <Share
          activeSection={activeSection}
          isMobile={isMobile}
          section={1}
          referralCode={data?.referralCode}
          blockchainAddress={user?.blockchainAddress}
          user={user}
        />
        <InviteYourFriends referralCode={data?.referralCode} />
        <YourReferrals
          activeSection={activeSection}
          isMobile={isMobile}
          section={2}
          registeredFriends={data?.registeredFriends}
          registeredAirspaces={data?.registeredAirspaces}
          validatedProperties={data?.validatedProperties}
        />
      </section>
    </MainLayout>

  );
};

export default Referral;
