import { useContext, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import { PropertyData } from "@/types";
import { Web3authContext } from "@/providers/web3authProvider";

export enum PortfolioTabEnum {
  VERIFIED,
  UNVERIFIED,
  REJECTED,
  RENTED
}

const usePortfolioList = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const [airspaceList, setAirspaceList] = useState<PropertyData[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<PortfolioTabEnum>(PortfolioTabEnum.VERIFIED);
  const { user } = useAuth();
  const { web3auth } = useContext(Web3authContext);

  const {
    getPropertiesByUserAddress,
    getUnverifiedAirspaces,
    getRejectedAirspaces,
  } = AirspaceRentalService();

  useEffect(() => {
    (async () => {
      try {
        if (web3auth && web3auth?.status !== "connected") return;
        let airspaces = [];
        setLoading(true);
        const assetId = airspaceList.length > 0 ? airspaceList.at(-1)?.id : "";

        if (activeTab === PortfolioTabEnum.VERIFIED) {
          airspaces = await getPropertiesByUserAddress(
            user?.blockchainAddress,
            "landToken",
            10,
            String(assetId)
          );
        } else if (activeTab === PortfolioTabEnum.RENTED) {
          airspaces = await getPropertiesByUserAddress(
            user?.blockchainAddress,
            "rentalToken",
            10,
            String(assetId)
          );
        } else if (activeTab === PortfolioTabEnum.UNVERIFIED) {
          const airspaceResp = await getUnverifiedAirspaces(
            user?.blockchainAddress,
            pageNumber,
            10,
          );
          if (airspaceResp && airspaceResp.items) {
            airspaces = airspaceResp.items;
          }
        } else {
          const airspaceResp = await getRejectedAirspaces(
            user?.blockchainAddress,
            pageNumber,
            10,
          );

          if (airspaceResp && airspaceResp.items) {
            airspaces = airspaceResp.items;
          }
        }
        setAirspaceList(airspaces);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [activeTab, web3auth?.status, pageNumber]);


  const handleNextPage = () => {
    if (airspaceList?.length < 9) return;
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const handlePrevPage = () => {
    if (pageNumber === 1) return;
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  };

  const handleTabSwitch = (tab: PortfolioTabEnum) => {
    setAirspaceList([])
    setPageNumber(1);
    setActiveTab(tab);
  };

  const highlightActiveTab = (
    tab: PortfolioTabEnum, 
    className = 'px-8 py-2 cursor-pointer transition ease-linear delay-75'
  ) => {
    return `${activeTab === tab ? "border-b-4  border-[#6CA1F7]" : ""} ${className}`
  }

  return {
    loading,
    airspaceList,
    pageNumber,
    highlightActiveTab,
    handleTabSwitch,
    handlePrevPage,
    handleNextPage
  }
};

export default usePortfolioList;
