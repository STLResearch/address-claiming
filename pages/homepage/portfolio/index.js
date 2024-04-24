import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import useDatabase from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";

import { PortfolioList, PortfolioListMobile, RentalCertificate } from "@/Components/Portfolio";
import { Modal } from "@/Components/Wrapped";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAirspace, setSelectedAirspace] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { getPropertiesByUserAddress } = useDatabase();
  const [myAirspaces, setMyAirspaces] = useState([]);
  const [rentedAirspaces, setRentedAirspaces] = useState([]);
  const [claimedAirspaces, setClaimedAirspaces] = useState([]);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const { user } = useAuth();

  // useEffect(() => {
  //   if (!user) return;

  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [user?.blockchainAddress]);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const selectAirspace = (x) => {
    setSelectedAirspace(x);
    setOpenModal(true)
  };

  const handlePdfGenerated = () => {
    setPdfGenerated(true)
    setOpenModal(false);

  }

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
        <div className="w-full h-full flex flex-col">
          {openModal && (
            <Modal handlePdfGenerated={handlePdfGenerated} airspace={selectedAirspace} onCloseModal={onCloseModal} />
          )}

{pdfGenerated && <RentalCertificate  onCloseModal={onCloseModal} airspace={selectedAirspace} />}
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
      </div>
    </Fragment>
  );
};

export default Portfolio;
