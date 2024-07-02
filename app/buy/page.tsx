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
import { Coordinates, PropertyData } from "@/types";
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
import MarketPlaceService from "@/services/MarketPlaceService";
import useFetchAuctions from "@/hooks/useFetchAuctions";

const DUMMY_AUCTIONS = [
  {
    name: "Trentino USA",
    highest_bid: "$20",
    time_left: "2 days",
  },
  {
    name: "Trentino NG",
    highest_bid: "$20",
    time_left: "2 days",
  },
  {
    name: "Trentino Italy",
    highest_bid: "$20",
    time_left: "2 days",
  },
  {
    name: "Trentino Spain",
    highest_bid: "$20",
    time_left: "2 days",
  },
  {
    name: "Trentino Canada",
    highest_bid: "$20",
    time_left: "2 days",
  },
  {
    name: "Trentino UK",
    highest_bid: "$20",
    time_left: "2 days",
  },
];

const Buy = () => {
  const { isCreateAuctionModalOpen } = useAppSelector((state) => {
    const { isCreateAuctionModalOpen } = state.userReducer;
    return { isCreateAuctionModalOpen };
  }, shallowEqual);

  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const filteredAuctions = DUMMY_AUCTIONS.filter((auction) =>
    auction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
  const [currentUserBid, setCurrentUserBid] = useState<number>();
  const [bidResponseStatus, setBidResponseStatus] = useState<
    "SUCCESS" | "FAIL"
  >("FAIL");
  const [auctionDetailData, setAuctionDetailData] = useState<any>();
  const [showAuctionList, setShowAuctionList] = useState<boolean>(true);
  const [nftList,setNftList]=useState([]);
// const {getNfts} = MarketPlaceService()
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
  const DUMMY_AUCTIONS_2 = [
    {
      address: "50, California Street, Financial District",
      id: 8,
      name: "My first Airspace",
      highestBid: "$20",
      timeLeft: "1min 	2sec",
      latitude: 37.79,
      transitFee: 100,
      owner: "someone",
      imageUrl: "",
      longitude: -122.4,
      area: [
        [-122.977199, 37.975108],
        [-122.105019, 37.995138],
        [-122.078486, 37.017605],
        [-122.083333, 37.017605],
        [-122.977199, 37.975108],
      ],
    },
    {
      address: "50, California Street, Financial District",
      id: 8,
      name: "My Second Airspace",
      highestBid: 123,
      transitFee: 100,
      owner: "someone",
      imageUrl: "",
      timeLeft: "1min 	2sec",
      latitude: 47.79,

      longitude: -122.4,
      area: [
        [-122.977199, 47.975108],
        [-122.105019, 47.995138],
        [-122.078486, 47.017605],
        [-122.083333, 47.017605],
        [-122.977199, 47.975108],
      ],
    },
    {
      address: "50, California Street, Financial District",
      id: 8,
      name: "My Second Airspace",
      highestBid: 123,
      timeLeft: "1min 	2sec",
      transitFee: 100,
      owner: "someone",
      imageUrl: "",
      latitude: 27.79,

      longitude: -102.4,
      area: [
        [-102.977199, 27.975108],
        [-102.105019, 27.995138],
        [-102.078486, 27.017605],
        [-102.083333, 27.017605],
        [-102.977199, 27.975108],
      ],
    },
    {
      address: "50, California Street, Financial District",
      id: 8,
      name: "My Second Airspace",
      imageUrl: "",
      highestBid: 123,
      timeLeft: "1min 	2sec",
      latitude: 30.79,
      transitFee: 100,
      owner: "someone",

      longitude: -102.4,
      area: [
        [-102.977199, 30.975108],
        [-102.105019, 30.995138],
        [-102.078486, 30.017605],
        [-102.083333, 30.017605],
      ],
    },
  ];
  // useEffect(() => {
  //   setAuctionDetailData(DUMMY_AUCTIONS_2);
  // }, []);
  // const auctions = DUMMY_AUCTIONS_2;
  // useDrawBidPolygons({ map, isMobile, auctions });

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
  const handleBid = () => {
    setShowSuccessAndErrorPopup(true);
    // setBidResponseStatus()
    //if condition here for the success or fail using bidResponseStatus
  };

  const { auctions, hasMore, loadMore } = useFetchAuctions();

    useDrawBidPolygons({ map });
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
                data={DUMMY_AUCTIONS}
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
                    data={auctions}
                    setShowBidDetail={setShowBidDetail}
                    setAuctionDetailData={setAuctionDetailData}
                    // handleShowBidDetail={handleShowBidDetail}
                  />
                </div>
              )}
              {showAuctionList && (
                <AuctionExplorerMobile
                  data={auctions}
                  setShowBidDetail={setShowBidDetail}
                    setAuctionDetailData={setAuctionDetailData}
                  // handleShowBidDetail={handleShowBidDetail}
                />
              )}
              {showSuccessAndErrorPopup && (
                <SuccessFailPopup
                  setShowSuccessAndErrorPopup={setShowSuccessAndErrorPopup}
                  setShowBidDetail={setShowBidDetail}
                  bidResponseStatus={bidResponseStatus}
                  successBidData={{
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
                  // handleBid={handleBid}
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
