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
import { AvailableBalance, MyAirspaces, ReferralProgram } from "@/Components/Dashboard";
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
            console.info("No air rights found.");
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

        <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F6FAFF]">
          <Sidebar />
          <div className="flex h-full w-full flex-col overflow-scroll md:overflow-hidden">
            <PageHeader pageTitle={"Dashboard"} />
            <section className="relative h-full w-full md:flex lg:pl-8">
              <div className="items-align flex flex-col-reverse justify-center lg:flex-row">
                <div className="md:my-[-53px] md:flex md:h-screen md:basis-[58%] md:flex-col md:gap-5 md:overflow-y-auto md:px-8 md:py-[53px] lg:px-0">
                  <h2 className="hidden pt-10 text-xl font-medium text-black md:flex">Welcome to SkyTrade!</h2>
                  <p className="hidden text-base font-normal text-[#87878D] md:flex">
                    Claim your air rights on the dashboard to kickstart your passive income journey. Don&apos;t forget
                    to share the love—refer friends using your code or link and watch your earnings grow. Welcome to the
                    community, where the future is yours to seize! 🌟🚀
                  </p>

                  <div className="flex flex-col justify-evenly gap-6">
                    <div className=" mt-4 flex flex-col gap-2">
                      <div className="mx-auto mb-20 flex flex-col gap-[22px] md:flex-col">
                        <AvailableBalance />
                        <MyAirspaces
                          airspaces={airspaces}
                          totalAirspace={totalAirspace}
                          isLoading={isLoadingAirspace}
                        />
                      <ReferralProgram />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:min-h-screen lg:w-1/2 lg:overflow-x-hidden lg:overflow-y-scroll">
                  <Link
                    href={"/airspaces"}
                    className="flex h-[500px] flex-col gap-8 px-[18px] md:-mr-[53px] md:-mt-[53px] md:h-full md:flex-1 md:items-center md:overflow-y-scroll md:bg-cover md:bg-center md:bg-no-repeat md:pb-[40px] md:pt-[42px]"
                    style={{ backgroundImage: "url('/images/map-bg.png')" }}
                  >
                    <div
                      className="mt-10 flex max-w-[362px] flex-col items-center gap-[15px] rounded-[30px] bg-[#FFFFFFCC] px-[29px] py-[43px]"
                      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
                    >
                      <div className="flex items-center gap-[5px]">
                        <p className="text-xl font-medium text-[#222222]">Claim Air Rights</p>
                        <div className="h-5 w-5 items-center justify-center">
                          <InfoIcon />
                        </div>
                      </div>
                      <p className="text-[15px] font-normal text-[#222222]">
                        Ready to claim your air rights? No registered air rights yet, but exciting times ahead!
                      </p>
                      <div
                        className="relative w-full rounded-lg bg-white px-[22px] py-[16px]"
                        style={{ border: "1px solid #87878D" }}
                      >
                        <input
                          type="text"
                          name="searchAirspaces"
                          id="searchAirspaces"
                          placeholder="Search Air Rights"
                          className="w-full pr-[20px] outline-none"
                        />
                        <div className="absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2">
                          <MagnifyingGlassIcon />
                        </div>
                      </div>
                    </div>
                    <div className="float mt-10 flex items-center justify-center rounded-lg bg-[#0653EA] px-[96px] py-[16px] text-[15px] font-normal text-white">
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
