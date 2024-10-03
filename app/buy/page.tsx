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
import { AuctionExplorer, AuctionExplorerMobile, AuctionSearchMobile, BuyFilter } from "@/Components/Buy";
import BidDetails from "@/Components/Buy/BidDetail/BidDetail";
import CreateAuctionModal from "@/Components/Buy/CreateAuctionModal";
import { setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { shallowEqual } from "react-redux";
import BidPreview from "@/Components/Buy/BidPreview/BidPreview";
import SuccessFailPopup from "@/Components/Buy/SuccessFailPopup";
import { useDrawBidPolygons } from "@/hooks/useDrawBidPolygons";
import MarketplaceService from "@/services/MarketplaceSercive";
import useFetchAuctions from "@/hooks/useFetchAuctions";
import { useSearchParams } from "next/navigation";

const Buy = () => {
  const { isCreateAuctionModalOpen } = useAppSelector((state) => {
    const { isCreateAuctionModalOpen } = state.userReducer;
    return { isCreateAuctionModalOpen };
  }, shallowEqual);

  const dispatch = useAppDispatch();
  const { getAuctionWithBid } = MarketplaceService();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [setAddressData] = useState<{ mapbox_id: string; short_code: string; wikidata: string } | null | undefined>();
  const [flyToAddress] = useState<string>("");
  const [setCoordinates] = useState<Coordinates | null>(null);
  const [marker, setMarker] = useState<Marker | null | undefined>();
  const [showBidDetail, setShowBidDetail] = useState<boolean>(false);
  const [showBidPreview, setShowBidPreview] = useState<boolean>(false);
  const [showSuccessAndErrorPopup, setShowSuccessAndErrorPopup] = useState<boolean>(false);
  const [currentUserBid, setCurrentUserBid] = useState<number | null>(null);
  const [bidResponseStatus, setBidResponseStatus] = useState<"SUCCESS" | "FAIL">("FAIL");
  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataI>();
  const [showAuctionList] = useState<boolean>(true);
  const [txHash, setTxHash] = useState("");
  const { auctions, hasMore, loading, setPage } = useFetchAuctions(1, 10, searchTerm);

  useDrawBidPolygons({
    map,
    //@ts-ignore
    auctions,
    setShowBidDetail,
    setAuctionDetailData,
  });

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
            //@ts-ignore
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
      //@ts-ignore
      setCoordinates,
      setAddressData,
      setIsLoading,
      //@ts-ignore
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
    setShowBidDetail(false);
  };

  useEffect(() => {
    const fetchAuctionData = async () => {
      const assetId = searchParams?.get("assetId");

      if (assetId) {
        try {
          const data = await getAuctionWithBid(parseFloat(assetId));
          setAuctionDetailData(data);
          setShowBidDetail(true);
        } catch (error) {
          console.error("Error fetching auction with bids:", error);
        }
      }
    };

    fetchAuctionData();
  }, [searchParams, getAuctionWithBid]);

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Marketplace : Buy Airspace</title>
      </Head>

      {isLoading && <Backdrop />}
      {isLoading && (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner />
        </div>
      )}
      {
        <div className="relative flex h-screen w-screen items-center justify-center overflow-clip rounded bg-[#F6FAFF]">
          <Sidebar />

          <div className="flex h-full w-full flex-col">
            <div className="hidden md:block">
              <PageHeader pageTitle={isMobile ? "Buy Airspace" : "Marketplace: Buy Airspace"} />
            </div>

            <div className="fixed right-10 top-[15%] z-50 hidden md:block">
              <BuyFilter />
            </div>

            {isCreateAuctionModalOpen && (
              <CreateAuctionModal data={[]} onClose={() => dispatch(setIsCreateAuctionModalOpen(false))} />
            )}

            <AuctionSearchMobile searchTerm={searchTerm} setSearchTerm={(value: string) => setSearchTerm(value)} />
            <section className={"relative mb-[79px] flex h-full w-full items-start justify-start md:mb-0"}>
              <div className={"!absolute !left-0 !top-0 !m-0 !h-screen !w-screen"} id="map" style={{ zIndex: "10" }} />

              {!isMobile && (
                <div className="flex items-start justify-start">
                  <AuctionExplorer
                    setSearchTerm={setSearchTerm}
                    auctions={auctions}
                    setPage={setPage}
                    loading={loading}
                    hasMorePage={hasMore}
                    setShowBidDetail={setShowBidDetail}
                    setAuctionDetailData={setAuctionDetailData}
                  />
                </div>
              )}
              {showAuctionList && auctions && (
                <AuctionExplorerMobile
                  loading={loading}
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
                    address: auctionDetailData?.layer?.property?.address || "",
                    currentUserBid: currentUserBid,
                  }}
                  txHash={txHash}
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
                  setTxHash={setTxHash}
                  setCurrentUserBid={setCurrentUserBid}
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
