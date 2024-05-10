import React, { useEffect, useState } from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import useAuth from '@/hooks/useAuth';
import Spinner from "../Spinner";
import PortfolioItemMobile from "./PortfolioItemMobile";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import AirspacesEmptyMessage from "./AirspacesEmptyMessage";

const PortfolioListMobile = ({ title, selectAirspace }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [rentalPageNumber, setRentalPageNumber] = useState(1);
  const [unverifiedPageNumber, setUnverifiedPageNumber] = useState(1);
  const [rentedAirspaces, setRentedAirspaces] = useState([]);
  const [verifiedAirspaces, setVerifiedAirspaces] = useState([]);
  const [unverifiedAirspaces, setUnverifiedAirspaces] = useState([]);
  const [allUnverifiedAirspaces, setAllUnverifiedAirspaces] = useState([]);
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
    } else if (activeTab === "Rented Airspaces") {
      if (rentalPageNumber === 1) return;
      setRentalPageNumber((prevPageNumber) => prevPageNumber - 1);
    } else {
      if (unverifiedPageNumber === 1) return;
      setUnverifiedPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  const fetchAirspaces = async () => {
    if (user?.blockchainAddress) {
      setLoading(true);
      console.log("fetching");

      const verifiedAirspaces = await getPropertiesByUserAddress(
        user?.blockchainAddress,
        "landToken",
        10
      );
      setVerifiedAirspaces(verifiedAirspaces);
      setAllVerifiedAirspaces(verifiedAirspaces);

      const rentedAirspaces = await getPropertiesByUserAddress(
        user?.blockchainAddress,
        "rentalToken",
        10
      );
      setRentedAirspaces(rentedAirspaces);
      setAllRentedAirspaces(rentedAirspaces);

      const unverified = await getUnverifiedAirspaces(
        user?.blockchainAddress,
        10,
        unverifiedPageNumber
      );
      setUnverifiedAirspaces(unverified?.items);
      setAllUnverifiedAirspaces(unverified?.items);

      setLoading(false);
    }
  };

  const paginateAirspaces = async () => {
    if (user?.blockchainAddress) {
      setLoading(true);
      if (activeTab === "Verified Airspaces") {
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
      } else if (activeTab === "Rented Airspaces") {
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
      } else if (activeTab === "Pending Verification") {
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
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if(user && web3authStatus) {
      fetchAirspaces();
    }
  }, [user, web3authStatus]);

  useEffect(() => {
    if(web3authStatus) {
      paginateAirspaces();
    }
  }, [pageNumber, rentalPageNumber, unverifiedPageNumber]);

  console.log({ verifiedAirspaces, rentedAirspaces, unverifiedAirspaces })

  return (
    <div className="overflow-x-hidden mb-24">
      <div
        className=" flex items-center overflow-x-auto border-b border-[#5D7285]/50"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc #f3f4f6" }}
      >
        <div
          className={`${activeTab === "Verified Airspaces" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75 whitespace-nowrap`}
          onClick={() => setActiveTab("Verified Airspaces")}
        >
          Verified Airspaces
        </div>
        <div
          className={`${activeTab === "Rented Airspaces" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75 whitespace-nowrap`}
          onClick={() => setActiveTab("Rented Airspaces")}
        >
          Rented Airspaces
        </div>
        <div
          className={`${activeTab === "Pending Verification" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75 whitespace-nowrap`}
          onClick={() => setActiveTab("Pending Verification")}
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
        <div className="w-screen ">
          {activeTab === "Rented Airspaces" && (
            <div className="flex flex-col gap-[2px] pb-2  min-h-[20rem] ">
              {(rentedAirspaces && rentedAirspaces[0] && rentedAirspaces[0].address) ? rentedAirspaces.map(
                ({ address, expirationDate, name, type }, index) => (
                  <PortfolioItemMobile
                    airspaceName={address}
                    key={index}
                    tags={[true, false, false, false]}
                    type={type}
                    selectAirspace={() => selectAirspace(index)}
                  />
                )
              )
              :
              <AirspacesEmptyMessage />
            }
            </div>
          )}

          {activeTab === "Verified Airspaces" && (
            <div className="flex flex-col gap-[2px] pb-2  min-h-[20rem]">
              {(verifiedAirspaces && verifiedAirspaces[0] && verifiedAirspaces[0].address) ? verifiedAirspaces.map(
                ({ address, expirationDate, name, type }, index) => (
                  <PortfolioItemMobile
                    airspaceName={address}
                    key={index}
                    tags={[true, false, false, false]}
                    type={type}
                    selectAirspace={() => selectAirspace(index)}
                  />
                )
              )
              :
              <AirspacesEmptyMessage />
            }
            </div>
          )}

          {activeTab === "Pending Verification" && (
            <div className="flex flex-col gap-[2px] pb-2 min-h-[20rem]">
              {(unverifiedAirspaces && unverifiedAirspaces[0] && unverifiedAirspaces[0].address) ? unverifiedAirspaces?.map(
                ({ address, expirationDate, name, type }, index) => (
                  <PortfolioItemMobile
                    airspaceName={address}
                    key={index}
                    tags={[true, false, false, false]}
                    type={type}
                    selectAirspace={() => selectAirspace(index)}
                  />
                )
              )
              :
              <AirspacesEmptyMessage />
            }
            </div>
          )}

          <div className="flex flex-col w-full text-gray-600">
            <div className="flex self-end items-center gap-2 w-[5rem]">
              <div
                onClick={handlePrevPage}
                className={`${activeTab === "Verified Airspaces" && pageNumber === 1 ? "cursor-not-allowed" : activeTab === "Rented Airspaces" && rentalPageNumber === 1 ? "cursor-not-allowed" : activeTab === "Pending Verification" && unverifiedPageNumber === 1 ? "cursor-not-allowed" : "cursor-pointer"} p-1 border rounded-lg border-gray-200`}
              >
                <RxCaretLeft />
              </div>
              <div>
                {activeTab === "Verified Airspaces"
                  ? pageNumber
                  : activeTab === "Rented Airspaces"
                    ? rentalPageNumber
                    : unverifiedPageNumber}
              </div>
              <div
                onClick={handleNextPage}
                className={`${activeTab === "Verified Airspaces" && verifiedAirspaces?.length < 10 ? "cursor-not-allowed" : activeTab === "Rented Airspaces" && rentedAirspaces.length < 10 ? "cursor-not-allowed" : activeTab === "Pending Verification" && unverifiedAirspaces?.length < 10 ? "cursor-not-allowed" : "cursor-pointer"} p-1 cursor-pointer border rounded-lg border-gray-200`}
              >
                <RxCaretRight />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioListMobile;
