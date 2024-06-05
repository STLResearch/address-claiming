"use client";

import { Fragment, useState, useEffect, useContext,useLayoutEffect } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import ZoomControllers from "@/Components/ZoomControllers";

import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import useAuth from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import Head from "next/head";
import ClaimModal from "@/Components/Airspace/ClaimModal/ClaimModal";
import Explorer from "@/Components/Airspace/Explorer/Explorer";
import ExplorerMobile from "@/Components/Airspace/Explorer/ExplorerMobile";
import Slider from "@/Components/Airspace/Slider";
import HowToModal from "@/Components/Airspace/HowToModal";
import MobileSuccessModal from "@/Components/Airspace/MobileSuccessModal";
import PopUp from "@/Components/Airspace/SuccessPopUp";
import FailurePopUp from "@/Components/Airspace/FailurePopUp";
import {
  flyToUserIpAddress,
  getAddresses,
  goToAddress,
} from "@/utils/apiUtils/apiFunctions";
import { Coordinates, PropertyData } from "@/types";
import MobileMapSection from "@/Components/Airspace/MobileMapSection";
import Sidebar from "@/Components/Shared/Sidebar";
import PropertiesService from "../../services/PropertiesService";
import { Web3authContext } from "../../providers/web3authProvider";
import { useRouter,useSearchParams  } from "next/navigation";
import { removePubLicUserDetailsFromLocalStorageOnClose,removePubLicUserDetailsFromLocalStorage } from "../../helpers/localStorage";

const Airspaces = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [showMobileMap, setShowMobileMap] = useState<boolean>(false);
  const [showHowToModal, setShowHowToModal] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [addressData, setAddressData] = useState<
    | { mapbox_id: string; short_code: string; wikidata: string }
    | null
    | undefined
  >();
  const [addresses, setAddresses] = useState<
    { id: string; place_name: string }[]
  >([]);
  const [flyToAddress, setFlyToAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [marker, setMarker] = useState<Marker | null>(null);
  const defaultData = {
    address: flyToAddress,
    title: "",
    isRentableAirspace: true,
    sell: false,
    isActive: null,
    hasChargingStation: false,
    hasLandingDeck: false,
    hasStorageHub: false,
    sellingPrice: "0",
    timezone: "UTC+0",
    transitFee: "1-99",
    isFixedTransitFee: false,
    noFlyZone: false,
    weekDayRanges: [
      { fromTime: 9, toTime: 21, isAvailable: false, weekDayId: 0 },
      { fromTime: 9, toTime: 21, isAvailable: false, weekDayId: 1 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 2 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 3 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 4 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 5 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 6 },
    ],
  };
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showSuccessPopUp, setShowSuccessPopUp] = useState<boolean>(false);
  const [showFailurePopUp, setShowFailurePopUp] = useState<boolean>(false);
  const [errorMessages,setErrorMessages] = useState<Array<string>>([]);
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [data, setData] = useState<PropertyData>({ ...defaultData });
  const { claimProperty } = PropertiesService();

  const { user, redirectIfUnauthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams()
  const { web3auth } = useContext(Web3authContext);

  //removes cached airspaceData when address is in coOrdinates

  useLayoutEffect(()=>{
    //const {propertyAddress,geoLocation}=router.query;
    const propertyAddress=searchParams?.get('propertyAddress')
    const geoLocation=searchParams?.get('geoLocation')
    if (propertyAddress || geoLocation){
      localStorage.removeItem('airSpaceData');      
    }
  },[searchParams])

  useEffect(() => {
    if (map) return;
    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-15.498211, 28.035056],
        zoom: 15,
        bounds: [
          [-73.9876, 40.7661],
          [-73.9397, 40.8002],
        ],
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
       //doesnt move the map to iplocation when user persisted initial state in 
       let inintialAirSpaceData=localStorage.getItem('airSpaceData')
       if(!inintialAirSpaceData){
         flyToUserIpAddress(newMap);
       }
    };
    createMap();
  }, []);

  //gets address suggestions 
  useEffect(() => {
    console.log('here',addresses,address)
    if (!address) return setShowOptions(false);
    let timeoutId: NodeJS.Timeout | null = null;
    getAddresses(setAddresses, setCoordinates, timeoutId, address);
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [address]);

  //flies to the new address
  useEffect(() => {
    if (!flyToAddress) return;
    goToAddress(
      flyToAddress,
      setCoordinates,
      setAddressData,
      setIsLoading,
      setMarker,
      map,
      marker,
      setAddress
    );
  }, [flyToAddress, map]);


   //adds address for the new address
  useEffect(() => {
    let propertyAddress=searchParams?.get('propertyAddress')
    let geoLocation=searchParams?.get('geoLocation')

    if((propertyAddress || geoLocation) && !address){// this condition prevent rerenderings,
      
      if(((propertyAddress && propertyAddress.length>2)|| (geoLocation && geoLocation.length>2))){
        if(geoLocation){   // prioritizing the geolocation over Property Address as it is more consistant             
            setFlyToAddress(geoLocation)
           propertyAddress=address                  
        }else{
          setFlyToAddress(propertyAddress as string)
        }  
      }
    }
    if (flyToAddress === address) setShowOptions(false);
    if (flyToAddress) setData((prev) => ({ ...prev, address: address }));
  }, [flyToAddress, address]);

  useEffect(() => {
    if (!showSuccessPopUp) return;
  }, [showSuccessPopUp]);


  useEffect(() => {
    if (!showFailurePopUp) return;
    const timeoutId = setTimeout(() => {
      setShowFailurePopUp(false);
      setErrorMessages([]);
    }, 6000);
    return () => clearTimeout(timeoutId);
  }, [showFailurePopUp]);

  useEffect(() => {
    const inintialAirSpaceDataString=localStorage.getItem('airSpaceData')
    const parsedInitialAirspaceData=inintialAirSpaceDataString?JSON.parse(inintialAirSpaceDataString):null;
    if(parsedInitialAirspaceData && parsedInitialAirspaceData?.address?.length>2){
      setData(parsedInitialAirspaceData);
      setFlyToAddress(parsedInitialAirspaceData.address)
      setAddress(parsedInitialAirspaceData.address)
      setShowClaimModal(true)
    }else{
      console.log('no initial datta')
    }
  
  
  }, [])
  const handleSetAddress = (value) => {
    setAddress(value)
    if (!showOptions) setShowOptions(true)
  }

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Airspaces</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]">
        {!showMobileMap && <Sidebar />}
        <div className="flex h-full w-full flex-col">
          {!showMobileMap && <PageHeader pageTitle={"Airspaces"} />}
          {showMobileMap && isMobile && (
            <ExplorerMobile
              onGoBack={() => setShowMobileMap(false)}
              address={address}
              setAddress={handleSetAddress}
              addresses={addresses}
              showOptions={showOptions}
              setFlyToAddress={setFlyToAddress}
              setShowOptions={setShowOptions}
            />
          )}
          {showHowToModal && (
            <HowToModal goBack={() => setShowHowToModal(false)} />
          )}
          <section
            className={`relative flex h-full w-full items-start justify-start md:mb-0 ${showMobileMap ? "" : "mb-[79px]"}`}
          >
            <div
              className={`!absolute !left-0 !top-0 !m-0 !h-screen !w-screen`}
              id="map"
              style={{
                opacity: !isMobile ? "1" : showMobileMap ? "1" : "0",
                zIndex: !isMobile ? "20" : showMobileMap ? "20" : "-20",
              }}
            />
            {showClaimModal && (
              <ClaimModal
                onCloseModal={() => {
                  removePubLicUserDetailsFromLocalStorageOnClose('airSpaceData')
                  setShowClaimModal(false);
                  setIsLoading(false);
                }}
                data={data}
                setData={setData}
                coordinates={coordinates}
                defaultData={defaultData}
                setIsLoading={setIsLoading}
                setShowClaimModal={setShowClaimModal}
                setShowFailurePopUp={setShowFailurePopUp}
                setShowSuccessPopUp={setShowSuccessPopUp}
                user={user}
                setErrorMessages={setErrorMessages}
              />
            )}
            {isMobile && showMobileMap && flyToAddress  && address && (
              <div
                onClick={() => {
                  setShowClaimModal(true);
                  setIsLoading(true);
                }}
                className="absolute bottom-2 left-1/2 z-[25] w-[90%] -translate-x-1/2 cursor-pointer rounded-lg bg-[#0653EA] py-[16px] text-center text-[15px] font-normal text-white"
              >
                Claim Airspace
              </div>
            )}
            {isMobile && (
              <Fragment>
                {(showSuccessPopUp || showFailurePopUp) && (
                  <MobileSuccessModal
                    isSuccess={showSuccessPopUp}
                    closePopUp={() => {
                      showFailurePopUp
                        ? setShowFailurePopUp(false)
                        : setShowSuccessPopUp(false);
                    }}
                    errorMessages={errorMessages}
                  />
                )}
              </Fragment>
            )}
            {!isMobile && (
              <div className="flex items-start justify-start">
                <Explorer
                  flyToAddress={flyToAddress}
                  address={address}
                  setAddress={handleSetAddress}
                  addresses={addresses}
                  showOptions={showOptions}
                  onClaimAirspace={() => {
                    setShowClaimModal(true);
                    setIsLoading(true);
                  }}
                  setFlyToAddress={setFlyToAddress}
                  setShowOptions={setShowOptions}
                />
                <Slider />
                <PopUp isVisible={showSuccessPopUp} setShowSuccessPopUp={setShowSuccessPopUp}/>
                <FailurePopUp isVisible={showFailurePopUp} errorMessages={errorMessages}/>
              </div>
            )}
            <MobileMapSection
              setShowHowToModal={setShowHowToModal}
              setShowMobileMap={setShowMobileMap}
              showMobileMap={showMobileMap}
            />
            <div className="hidden sm:block">
              <ZoomControllers map={map} />
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};
export default Airspaces;
