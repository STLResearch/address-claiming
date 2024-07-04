"use client";
import { Fragment, useState, useEffect } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import { useMobile } from "@/hooks/useMobile";
import Head from "next/head";
import ZoomControllers from "@/Components/ZoomControllers";
import { goToAddress } from "@/utils/apiUtils/apiFunctions";
import { AuctionDataI, Coordinates } from "@/types";
import Sidebar from "@/Components/Shared/Sidebar";
import {
  AuctionExplorer,
  AuctionExplorerMobile,
  AuctionSearchMobile,
  BuyFilter,
} from "@/Components/Buy";
import BidDetails from "@/Components/Buy/BidDetail/BidDetail";
import CreateAuctionModal from "@/Components/Buy/CreateAuctionModal";
import { setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { shallowEqual } from "react-redux";
import BidPreview from "@/Components/Buy/BidPreview/BidPreview";
import SuccessFailPopup from "@/Components/Buy/SuccessFailPopup";
import { useDrawBidPolygons } from "@/hooks/useDrawBidPolygons";
import MarketplaceService from "@/services/MarketplaceService";

import useFetchAuctions from "@/hooks/useFetchAuctions";

const Buy = () => {
  const { isCreateAuctionModalOpen } = useAppSelector((state) => {
    const { isCreateAuctionModalOpen } = state.userReducer;
    return { isCreateAuctionModalOpen };
  }, shallowEqual);

  const dispatch = useAppDispatch();
  const { getAuctions } = MarketplaceService();
  const [searchTerm, setSearchTerm] = useState("");
  // const filteredAuctions = DUMMY_AUCTIONS.filter((auction) =>
  //   auction.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [addressData, setAddressData] = useState<
    | { mapbox_id: string; short_code: string; wikidata: string }
    | null
    | undefined
  >();
  const [flyToAddress, setFlyToAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [marker, setMarker] = useState<Marker | null | undefined>();
  const [showBidDetail, setShowBidDetail] = useState<boolean>(false);
  const [showBidPreview, setShowBidPreview] = useState<boolean>(false);
  const [showSuccessAndErrorPopup, setShowSuccessAndErrorPopup] =
    useState<boolean>(false);
  const [currentUserBid, setCurrentUserBid] = useState<number | null >(null);
  const [bidResponseStatus, setBidResponseStatus] = useState<
    "SUCCESS" | "FAIL"
  >("FAIL");
  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataI>();
  const [showAuctionList, setShowAuctionList] = useState<boolean>(true);
  useEffect(() => {
    if (map) return;
    const createMap = () => {
      if (!process.env.NEXT_PUBLIC_MAPBOX_KEY) return;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-104.718243, 40.413869],
        zoom: 4,
      });

      newMap.on("load", function () {
        newMap.addLayer({
          id: "maine",
          type: "fill",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [],
              },
            },
          },
          layout: {},
          paint: {
            "fill-color": "#D20C0C",
          },
        });
      });
      setMap(newMap);
    };
    createMap();
  }, []);

  useEffect(() => {
    if (!flyToAddress) return;
    goToAddress(
      flyToAddress,
      setCoordinates,
      setAddressData,
      setIsLoading,
      setMarker,
      map,
      marker
    );
  }, [flyToAddress, map]);


  const handleOpenBidPreview = () => {
    setShowBidPreview(true);
    setShowBidDetail(false);
  };
  const handleClosePreview = () => {
    setShowBidPreview(false);
    setShowBidDetail(true);
  };

  const { auctions, hasMore,setPage } = useFetchAuctions();
    useDrawBidPolygons({ map ,auctions});
  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Marketplace : Buy Airspace</title>
      </Head>

      {isLoading && <Backdrop onClick={() => {}} />}
      {isLoading && <Spinner />}
      {
        <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center  overflow-clip ">
          <Sidebar />

          <div className="w-full h-full flex flex-col">
            <div className="hidden md:block">
              <PageHeader
                pageTitle={
                  isMobile ? "Buy Airspace" : "Marketplace: Buy Airspace"
                }
              />
            </div>

            <div className="hidden md:block fixed top-[15%] right-10 z-50">
              <BuyFilter />
            </div>

            {isCreateAuctionModalOpen && (
              <CreateAuctionModal
                data={[]}
                onClose={() => dispatch(setIsCreateAuctionModalOpen(false))}
              />
            )}

            <AuctionSearchMobile
              searchTerm={searchTerm}
              setSearchTerm={(value: string) => setSearchTerm(value)}
            />
            <section
              className={
                "relative flex w-full h-full justify-start items-start md:mb-0 mb-[79px] "
              }
            >
              <div
                className={"!absolute !top-0 !left-0 !m-0 !w-screen !h-screen"}
                id="map"
                style={{ zIndex: "10" }}
              />

              {!isMobile && (
                <div className="flex justify-start items-start">
                  <AuctionExplorer
                    auctions={auctions}
                    setPage={setPage}
                    hasMorePage={hasMore}
                    setShowBidDetail={setShowBidDetail}
                    setAuctionDetailData={setAuctionDetailData}
                  />
                </div>
              )}
              {showAuctionList && (
                <AuctionExplorerMobile
                  auctions={auctions}
                    setPage={setPage}
                    hasMorePage={hasMore}
                  setShowBidDetail={setShowBidDetail}
                    setAuctionDetailData={setAuctionDetailData}
                />
              )}
              {showSuccessAndErrorPopup && (
                <SuccessFailPopup
                  setShowSuccessAndErrorPopup={setShowSuccessAndErrorPopup}
                  setShowDetail={setShowBidDetail}
                  responseStatus={bidResponseStatus}
                  data={{
                    address: auctionDetailData?.properties[0]?.address,
                    currentUserBid: currentUserBid,
                  }}
                />
              )}
              {showBidDetail && (
                <BidDetails
                  currentUserBid={currentUserBid}
                  setCurrentUserBid={setCurrentUserBid}
                  auctionDetailData={auctionDetailData}
                  onCloseModal={() => setShowBidDetail(false)}
                  onPlaceBid={handleOpenBidPreview}
                />
              )}
              {showBidPreview && (
                <BidPreview
                  setBidResponseStatus={setBidResponseStatus}
                  setShowSuccessAndErrorPopup={setShowSuccessAndErrorPopup}
                  auctionDetailData={auctionDetailData}
                  currentUserBid={currentUserBid}
                  onClose={handleClosePreview}
                />
              )}
            </section>
            <div className="hidden sm:block">
              <ZoomControllers map={map} />
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default Buy;
