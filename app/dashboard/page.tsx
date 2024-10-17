"use client";

import { Fragment, useState, useEffect, FC } from "react";
import ErrorBoundary from "@/Components/ErrorBoundary";
import Link from "next/link";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import Sidebar from "@/Components/Shared/Sidebar";
import {
  AvailableBalance,
  MyAirspaces,
  ReferralProgram,
} from "@/Components/Dashboard";
import { InfoIcon, MagnifyingGlassIcon } from "@/Components/Shared/Icons";

const Dashboard: FC = () => {
  const [isLoadingAirspace, setIsLoadingAirspace] = useState(false);
  const { user, web3authStatus } = useAuth();
  const [airspaces, setAirspaces] = useState<any[]>([]);
  const [totalAirspace, setTotalAirspace] = useState(0);

  const { getTotalAirspacesByUserAddress } = AirspaceRentalService();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        if (!user?.blockchainAddress || !web3authStatus) return;

        setIsLoadingAirspace(true);
        const airspaces = await getTotalAirspacesByUserAddress();

        if (airspaces && airspaces.previews) {
          const retrievedAirspaces = airspaces.previews.map((item: any) => ({
            address: item.address,
            id: item?.id,
          }));
          if (retrievedAirspaces.length > 0) {
            setAirspaces(retrievedAirspaces);
            setTotalAirspace(airspaces.total);
          } else {
            console.info("No airspaces found.");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingAirspace(false);
      }
    })();
  }, [user?.blockchainAddress, web3authStatus]);

  if (!user) {
    return <Spinner />;
  }

  return (
    <ErrorBoundary>
      <Fragment>
        <Head>
          <title>SkyTrade - Dashboard</title>
        </Head>

        <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
          <Sidebar />
          <div className="w-full h-full flex flex-col overflow-scroll md:overflow-hidden">
            <PageHeader pageTitle={"Dashboard"} />
            <section className=" md:flex relative w-full h-full md:pl-[53px]  ">
              <div className="flex-col-reverse flex justify-center items-align  md:flex-row">
                <div className="md:basis-[58%] md:flex md:flex-col md:gap-5 md:h-screen md:overflow-y-auto md:my-[-53px] md:py-[53px] ">
                  <h2 className="font-medium hidden md:flex text-xl text-black pt-10">
                    Welcome to SkyTrade!
                  </h2>
                  <p className="font-normal text-base text-[#87878D] hidden md:flex">
                    Claim your air rights on the dashboard to kickstart your
                    passive income journey. Don&apos;t forget to share the
                    love—refer friends using your code or link and watch your
                    earnings grow. Welcome to the community, where the future is
                    yours to seize! 🌟🚀
                  </p>

                  <div className="flex flex-col md:flex-row justify-evenly gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col-reverse md:flex-col gap-[22px]">
                        <AvailableBalance />
                        <MyAirspaces
                          airspaces={airspaces}
                          totalAirspace={totalAirspace}
                          isLoading={isLoadingAirspace}
                        />
                      </div>
                    </div>
                    <ReferralProgram />
                  </div>
                </div>
                <div className="md:overflow-y-scroll  md:overflow-x-hidden  md:min-h-screen md:w-1/2 m-0 ">
                  <Link
                    href={"/airspaces"}
                    className="gap-20 md:flex-1 flex flex-col md:items-center md:justify-between h-[500px] md:bg-cover md:bg-no-repeat md:bg-center md:-mt-[53px] md:-mr-[53px] md:pt-[42px] px-[18px] md:pb-[40px] md:h-full md:overflow-y-scroll "
                    style={{ backgroundImage: "url('/images/map-bg.png')" }}
                  >
                    <div
                      className="bg-[#FFFFFFCC] py-[43px] px-[29px] rounded-[30px] flex flex-col items-center gap-[15px] max-w-[362px] mt-10"
                      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
                    >
                      <div className="flex gap-[5px] items-center">
                        <p className="text-xl font-medium text-[#222222]">
                          Claim Air Rights
                        </p>
                        <div className="w-5 h-5 items-center justify-center">
                          <InfoIcon />
                        </div>
                      </div>
                      <p className="text-[15px] font-normal text-[#222222]">
                        Ready to claim your air rights? No registered air rights
                        yet, but exciting times ahead!
                      </p>
                      <div
                        className="relative px-[22px] py-[16px] bg-white rounded-lg w-full"
                        style={{ border: "1px solid #87878D" }}
                      >
                        <input
                          type="text"
                          name="searchAirspaces"
                          id="searchAirspaces"
                          placeholder="Search Air Rights"
                          className="outline-none w-full pr-[20px]"
                        />
                        <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
                          <MagnifyingGlassIcon />
                        </div>
                      </div>
                    </div>
                    <div className="text-white rounded-lg flex items-center justify-center bg-[#0653EA] py-[16px] px-[96px] font-normal text-[15px] mt-10">
                      Claim Air Rights
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Fragment>
    </ErrorBoundary>
  );
};

export default Dashboard;
