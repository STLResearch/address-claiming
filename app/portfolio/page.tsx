"use client";

import { Fragment, SetStateAction, useContext, useEffect, useState } from "react";

import PageHeader from "@/Components/PageHeader";
import Head from "next/head";
import { PortfolioList, PortfolioListMobile } from "@/Components/Portfolio";

import Sidebar from "@/Components/Shared/Sidebar";
import { useSearchParams } from "next/navigation";
import PropertiesService from "@/services/PropertiesService";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import { Web3authContext } from "@/providers/web3AuthProvider";

const Portfolio = () => {
  const [selectedAirspace, setSelectedAirspace] = useState(null);
  const { getPropertyById } = PropertiesService();
  const { getSingleAsset } = AirspaceRentalService();
  const searchParams = useSearchParams();
  const [uploadedDoc, setUploadedDoc] = useState<any[]>([]);

  const id = searchParams?.get("id");

  const { web3auth } = useContext(Web3authContext);

  useEffect(() => {
    (async () => {
      if (web3auth && web3auth.status === "connected" && id) {
        let portfolioData = null;
        if (!isNaN(Number(id))) {
          portfolioData = await getPropertyById(id);
        } else {
          portfolioData = await getSingleAsset(id);
        }
        setSelectedAirspace(portfolioData);
      }
    })();
  }, [id, web3auth?.status]);

  const onCloseModal = () => {
    setSelectedAirspace(null);
  };

  const selectAirspace = (x) => {
    setSelectedAirspace(x);
  };

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Portfolio</title>
      </Head>

      <div className="relative flex h-screen w-screen items-center justify-center rounded bg-[#F6FAFF]">
        <Sidebar />
        <div className="flex h-full w-full flex-col">
          <PageHeader pageTitle={"Portfolio"} />
          <section className="relative hidden h-full w-full flex-wrap gap-6 overflow-y-auto px-[45px] py-[43px] md:flex">
            <PortfolioList
              title={"My Air Rights"}
              selectAirspace={selectAirspace}
              selectedAirspace={selectedAirspace}
              onCloseModal={onCloseModal}
              uploadedDoc={uploadedDoc}
              setUploadedDoc={setUploadedDoc}
              setSelectedAirspace={setSelectedAirspace}
            />
          </section>
          <section className="relative flex h-full w-full flex-wrap gap-6 overflow-y-auto py-[10px] md:hidden">
            <PortfolioListMobile
              onCloseModal={onCloseModal}
              selectAirspace={selectAirspace}
              uploadedDoc={uploadedDoc}
              setUploadedDoc={setUploadedDoc}
              selectedAirspace={selectedAirspace}
              setSelectedAirspace={setSelectedAirspace}
            />
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Portfolio;
