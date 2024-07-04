"use client";
import { Fragment, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import { PortfolioList, PortfolioListMobile } from "@/Components/Portfolio";

import Modal from "@/Components/Portfolio/Modal";
import Sidebar from "@/Components/Shared/Sidebar";
import { useSearchParams } from "next/navigation";
import PropertiesService from "@/services/PropertiesService";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import { Web3authContext } from "@/providers/web3authProvider";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAirspace, setSelectedAirspace] = useState(null);
  const { user, web3authStatus } = useAuth();
  const { getPropertyById } = PropertiesService();
  const { getSingleAsset } = AirspaceRentalService();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, web3authStatus]);

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
      {isLoading &&
        createPortal(
          <Backdrop onClick={() => {}} />,
          document?.getElementById("backdrop-root") as HTMLElement
        )}
      {isLoading &&
        createPortal(
          <Spinner />,
          document?.getElementById("backdrop-root") as HTMLElement
        )}
      {selectedAirspace !== null && <Backdrop onClick={onCloseModal} />}

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          {selectedAirspace !== null && (
            <Modal airspace={selectedAirspace} onCloseModal={onCloseModal} />
          )}
          <PageHeader pageTitle={"Portfolio"} />
          <section className="relative w-full h-full md:flex flex-wrap gap-6 py-[43px] px-[45px] hidden overflow-y-auto">
            <PortfolioList
              title={"My Airspaces"}
              selectAirspace={selectAirspace}
            />
          </section>
          <section className="relative w-full h-full flex flex-wrap gap-6 py-[10px] md:hidden overflow-y-auto ">
            <PortfolioListMobile selectAirspace={selectAirspace} />
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Portfolio;
