import React, { useEffect, useState } from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import PortfolioItem from "./PortfolioItem";
import useAuth from '@/hooks/useAuth';
import Spinner from "../Spinner";
import AirspaceRentalService from "@/services/AirspaceRentalService";

const PortfolioList = ({ title, airspacesList, selectAirspace, address }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [rentalPageNumber, setRentalPageNumber] = useState(1);
  const [unverifiedPageNumber, setUnverifiedPageNumber] = useState(1);
  const [rentedAirspaces, setRentedAirspaces] = useState([]);
  const [verifiedAirspaces, setVerifiedAirspaces] = useState([]);
  const [unverifiedAirspaces, setUnverifiedAirspaces] = useState([]);
  const [allUnverifiedAirspaces, setAllUnverifiedAirspaces] = useState(null);
  const [allRentedAirspaces, setAllRentedAirspaces] = useState([]);
  const [allVerifiedAirspaces, setAllVerifiedAirspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Verified Airspaces");
  const { user, web3authStatus } = useAuth();
  const { getPropertiesByUserAddress, getUnverifiedAirspaces } = AirspaceRentalService();

  const handleNextPage = () => {
    if (activeTab === "Verified Airspaces") {
      if (verifiedAirspaces.length < 10) return;
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    } else if (activeTab === "Rented Airspaces") {
      if (rentedAirspaces.length < 10) return;
      setRentalPageNumber((prevPageNumber) => prevPageNumber + 1);
    } else {
      if (unverifiedAirspaces?.length < 10) return;
      setUnverifiedPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handlePrevPage = () => {
    if (activeTab === "Verified Airspaces") {
      if (pageNumber === 1) return;
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
      paginateAirspaces();
    } else if (activeTab === "Rented Airspaces") {
      if (rentalPageNumber === 1) return;
      setRentalPageNumber((prevPageNumber) => prevPageNumber - 1);
      paginateAirspaces();
    } else {
      if (unverifiedPageNumber === 1) return;
      setUnverifiedPageNumber((prevPageNumber) => prevPageNumber - 1);
      paginateAirspaces();
    }
  };

  const fetchAirspaces = async () => {
    if (user?.blockchainAddress) {
      setLoading(true);

      const verifiedAirspaces = await getPropertiesByUserAddress(
        user?.blockchainAddress,
        "landToken",
        10
      );
      setVerifiedAirspaces(verifiedAirspaces);
      setAllVerifiedAirspaces(verifiedAirspaces);

      setLoading(false);
    }
  };

  const fetchVerifiedAirspaces = async () => {
    setLoading(true);
    if (pageNumber === 1) {
      const verified = await getPropertiesByUserAddress(
        user?.blockchainAddress,
        "landToken",
        10
      );
      setVerifiedAirspaces(verified);
    } else if (pageNumber > 1) {
      const verifiedAirspaces = await getPropertiesByUserAddress(
        user?.blockchainAddress,
        "landToken",
        10,
        verifiedAirspaces[verifiedAirspaces.length - 1].id
      );
      setVerifiedAirspaces(verifiedAirspaces);
    }
    setLoading(false);
  };

  const fetchRentedAirspaces = async () => {
    setLoading(true);
    if (rentalPageNumber === 1) {
      // Fetch data from API
      const rented = await getPropertiesByUserAddress(
        user?.blockchainAddress,
        "rentalToken",
        10
      );
      setRentedAirspaces(rented);
    } else if (rentalPageNumber > 1) {
      const rentedAirspaces = await getPropertiesByUserAddress(
        user?.blockchainAddress,
        "rentalToken",
        10,
        rentedAirspaces[rentedAirspaces.length - 1].id
      );
      setRentedAirspaces(rentedAirspaces);
    }
    setLoading(false);
  };

  const fetchUnverifiedAirspaces = async () => {
    setLoading(true);
    if (unverifiedPageNumber === 1) {
      const unverified = await getUnverifiedAirspaces(
        user?.blockchainAddress,
        10,
        unverifiedPageNumber
      );

      setUnverifiedAirspaces(unverified?.items);
    } else if (unverifiedPageNumber > 1) {
      const newUnverifiedAirspaces = await getUnverifiedAirspaces(
        user?.blockchainAddress,
        10,
        unverifiedPageNumber
      );
      setUnverifiedAirspaces(newUnverifiedAirspaces?.items);
    }
    setLoading(false);
  };

  const paginateAirspaces = async () => {
    if (user?.blockchainAddress) {
      if (activeTab === "Verified Airspaces") {
        fetchVerifiedAirspaces();
      } else if (activeTab === "Rented Airspaces") {
        fetchRentedAirspaces();
      } else if (activeTab === "Pending Verification") {
        fetchUnverifiedAirspaces();
      }
    }
  };

  const handleGetVerifiedAirspaces = async () => {
    setActiveTab("Verified Airspaces");
    if (verifiedAirspaces.length === 0) fetchVerifiedAirspaces();
  };

  const handleGetRentedAirspaces = async () => {
    setActiveTab("Rented Airspaces");
    if (rentedAirspaces.length === 0) fetchRentedAirspaces();
  };

  const handleGetUnVerifiedAirspaces = async () => {
    setActiveTab("Pending Verification");
    if (unverifiedAirspaces.length === 0) fetchUnverifiedAirspaces();
  };

  useEffect(() => {
    if (web3authStatus) {
      fetchAirspaces();
    }
  }, [web3authStatus]);

  useEffect(() => {
    if (web3authStatus) {
      paginateAirspaces();
    }
  }, [pageNumber, rentalPageNumber, unverifiedPageNumber, web3authStatus]);
  return (
    <div
      className="py-[43px] px-[29px] rounded-[30px] bg-white flex flex-col gap-[43px] min-w-[516px] flex-1"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <h2 className="font-medium text-xl text-[#222222] text-center">
        {title}
      </h2>
      <div className="flex items-center gap-16">
        <div
          className={`${activeTab === "Verified Airspaces" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75`}
          onClick={handleGetVerifiedAirspaces}
        >
          Verified Airspaces
        </div>
        <div
          className={`${activeTab === "Rented Airspaces" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75`}
          onClick={handleGetRentedAirspaces}
        >
          Rented Airspaces
        </div>
        <div
          className={`${activeTab === "Pending Verification" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75`}
          onClick={handleGetUnVerifiedAirspaces}
        >
          Pending Verification
        </div>
      </div>

      {loading ? (
        <div>
          {" "}
          <Spinner />
        </div>
      ) : (
        <>
          {activeTab === "Rented Airspaces" && (
            <div className="flex flex-col gap-[15px] min-h-[20rem]">
              {rentedAirspaces && rentedAirspaces[0] && rentedAirspaces[0].address && rentedAirspaces?.map((airspace, index) => (
                <PortfolioItem
                  airspaceName={airspace?.address}
                  key={index}
                  tags={[true, false, false, false]}
                  type={airspace?.type}
                  selectAirspace={() => selectAirspace(airspace)}
                />
              ))}
            </div>
          )}

          {activeTab === "Verified Airspaces" && (
            <div className="flex flex-col gap-[15px] min-h-[20rem]">
              {verifiedAirspaces && verifiedAirspaces[0] && verifiedAirspaces[0].address && verifiedAirspaces?.map((airspace, index) => (
                <PortfolioItem
                  airspaceName={airspace?.address}
                  key={index}
                  tags={[true, false, false, false]}
                  type={airspace?.type}
                  selectAirspace={() => selectAirspace(airspace)}
                />
              ))}
            </div>
          )}

          {activeTab === "Pending Verification" && (
            <div className="flex flex-col gap-[15px] min-h-[20rem]">
              {unverifiedAirspaces && unverifiedAirspaces[0] && unverifiedAirspaces[0].address && unverifiedAirspaces?.map((airspace, index) => (
                <PortfolioItem
                  airspaceName={airspace?.address}
                  key={index}
                  tags={[true, false, false, false]}
                  type={airspace?.type}
                  selectAirspace={() => selectAirspace(airspace)}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col w-full text-gray-600">
            <div className="flex self-end items-center gap-2 w-[5rem]">
              <button
                onClick={handlePrevPage}
                disabled={(activeTab === "Verified Airspaces" && pageNumber === 1) || (activeTab === "Rented Airspaces" && rentalPageNumber === 1) || (activeTab === "Pending Verification" && unverifiedPageNumber === 1)}
                className={`${(activeTab === "Verified Airspaces" && pageNumber === 1) || (activeTab === "Rented Airspaces" && rentalPageNumber === 1) || (activeTab === "Pending Verification" && unverifiedPageNumber === 1) ? "cursor-not-allowed" : "cursor-pointer"} p-1 border rounded-lg border-gray-200`}
              >
                <RxCaretLeft />
              </button>
              <div>
                {activeTab === "Verified Airspaces"
                  ? pageNumber
                  : activeTab === "Rented Airspaces"
                    ? rentalPageNumber
                    : unverifiedPageNumber}
              </div>
              <button
                onClick={handleNextPage}
                disabled={(activeTab === "Verified Airspaces" && verifiedAirspaces?.length < 10) || (activeTab === "Rented Airspaces" && rentedAirspaces.length < 10) || (activeTab === "Pending Verification" && unverifiedAirspaces?.length < 10)}
                className={`${(activeTab === "Verified Airspaces" && verifiedAirspaces?.length < 10) || (activeTab === "Rented Airspaces" && rentedAirspaces.length < 10) || (activeTab === "Pending Verification" && unverifiedAirspaces?.length < 10) ? "cursor-not-allowed" : "cursor-pointer"} p-1 border rounded-lg border-gray-200`}
              >
                <RxCaretRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioList;
