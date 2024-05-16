

import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";
import {
  LocationPointIcon,
  ChevronRightIcon,
  CloseIcon,
  ArrowLeftIcon,
} from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import useAuth from '@/hooks/useAuth';
import Head from "next/head";
import { RxCaretRight, RxCaretLeft } from "react-icons/rx";
import { PortfolioList, PortfolioListMobile } from "@/Components/Portfolio";
import { formatDate } from "@/utils";
import { Modal } from "@/Components/Wrapped";
import LoginPage from "@/Components/common/LoginPage";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAirspace, setSelectedAirspace] = useState(null);
  const [myAirspaces, setMyAirspaces] = useState([]);
  const [rentedAirspaces, setRentedAirspaces] = useState([]);
  const [claimedAirspaces, setClaimedAirspaces] = useState([]);
  const { user, web3authStatus } = useAuth();

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
        createPortal(<Backdrop />, document?.getElementById("backdrop-root"))}
      {isLoading &&
        createPortal(<Spinner />, document?.getElementById("backdrop-root"))}
      {selectedAirspace !== null && <Backdrop onClick={onCloseModal} />}

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center">
        <Sidebar />
        <div className={user?.blockchainAddress?"w-full h-full flex flex-col":"w-full h-full flex flex-col blur-sm pointer-events-none"}>
          {selectedAirspace !== null && (
            <Modal airspace={selectedAirspace} onCloseModal={onCloseModal} />
          )}
          <PageHeader pageTitle={"Portfolio"} />
          <section className="relative w-full h-full md:flex flex-wrap gap-6 py-[43px] px-[45px] hidden overflow-y-auto">
            <PortfolioList
              address={user?.blockchainAddress}
              claimedAirspaces={claimedAirspaces}
              rentedAirspaces={rentedAirspaces}
              airspacesList={myAirspaces}
              title={"My Airspaces"}
              selectAirspace={selectAirspace}
            />
          </section>
          <section className="relative w-full h-full flex flex-wrap gap-6 py-[10px] md:hidden overflow-y-auto ">
            <PortfolioListMobile
              airspacesList={myAirspaces}
              title={"My Airspaces"}
              selectAirspace={selectAirspace}
            />
          </section>
        </div>
        {!user?.blockchainAddress && <LoginPage />}
      </div>
    </Fragment>
  );
};

export default Portfolio;
