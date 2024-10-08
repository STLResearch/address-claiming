"use client";

import useAuth from "../../hooks/useAuth";
import { useMobile } from "../../hooks/useMobile";
import PropertiesService from "../../services/PropertiesService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { toast } from "react-toastify";
import {
  removePubLicUserDetailsFromLocalStorage,
  removePubLicUserDetailsFromLocalStorageOnClose,
} from "../../helpers/localstorage";
import axios from "axios";
import Head from "next/head";
import Backdrop from "../../Components/Backdrop";
import Spinner from "../../Components/Spinner";
import Sidebar from "../../Components/Shared/Sidebar";
import PageHeader from "../../Components/PageHeader";
import ExplorerMobile from "../../Components/Airspace/Explorer/ExplorerMobile";
import HowToModal from "../../Components/Airspace/HowToModal";
import { ClaimModal } from "../../Components/Airspace/ClaimModal/ClaimModal";
import SuccessModal from "../../Components/Airspace/SuccessModal";
import Explorer from "../../Components/Airspace/Explorer/Explorer";
import Slider from "../../Components/Airspace/Slider";
import SuccessPopUp from "../../Components/Airspace/SuccessPopUp";
import FailurePopUp from "../../Components/Airspace/FailurePopUp";
import Link from "next/link";
import {
  ChevronRightIcon,
  HelpQuestionIcon,
  LocationPointIcon,
} from "../../Components/Icons";
import ZoomControllers from "../../Components/ZoomControllers";
import { useTour } from "@reactour/tour";
import { defaultData, StatusTypes } from "../../types";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import PolygonTool from "../../Components/PolygonTool";
import VerificationPopup from "@/Components/MyAccount/VerificationPopup";
import MyMobileAirspacesPage from "@/Components/Airspace/ClaimedAirspaceList";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import AirRightsEstimateService from "@/services/AirRightsEstimateService";
import { createAirRightEstimateMarker } from "@/utils/maputils";

interface Address {
  id: string;
  place_name: string;
}

const Airspaces: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //
  const [claimButtonLoading, setClaimButtonLoading] = useState<boolean>(false);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const { isMobile } = useMobile();
  const { setIsOpen, currentStep, isOpen } = useTour();
  const [showMobileMap, setShowMobileMap] = useState<boolean>(isOpen);
  const [showHowToModal, setShowHowToModal] = useState<boolean>(false);
  // Variables
  const [address, setAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [flyToAddress, setFlyToAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState({
    longitude: "",
    latitude: "",
  });
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const defaultData: defaultData = {
    address: address,
    title: "",
    rent: null,
    sell: false,
    hasZoningPermission: null,
    hasChargingStation: false,
    hasLandingDeck: false,
    hasStorageHub: false,
    sellingPrice: "0",
    timezone: "Europe/london",
    transitFee: "1-99",
    isFixedTransitFee: false,
    noFlyZone: false,
    weekDayRanges: [
      { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 0 },
      { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 1 },
      { fromTime: 0, toTime: 24, isAvailable: true, weekDayId: 2 },
      { fromTime: 0, toTime: 24, isAvailable: true, weekDayId: 3 },
      { fromTime: 0, toTime: 24, isAvailable: true, weekDayId: 4 },
      { fromTime: 0, toTime: 24, isAvailable: true, weekDayId: 5 },
      { fromTime: 0, toTime: 24, isAvailable: true, weekDayId: 6 },
    ],
    orderPhotoforGeneratedMap: false,
    assessorParcelNumber: "",
    images: [],
  };
  // Showing
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showSuccessPopUp, setShowSuccessPopUp] = useState<boolean>(false);
  const [showFailurePopUp, setShowFailurePopUp] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [data, setData] = useState({ ...defaultData });
  // Database
  const { claimProperty } = PropertiesService();

  const {
    user,
    web3authStatus,
    redirectIfUnauthenticated,
    setAndClearOtherPublicRouteData,
  } = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [drawTool, setDrawTool] = useState(null);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [dontShowAddressOnInput, setDontShowAddressOnInput] = useState(false);
  const [showAirspacePage, setShowAirspacePage] = useState(false);
  const [airspaces, setAirspaces] = useState<any[]>([]);
  const [totalAirspace, setTotalAirspace] = useState(0);

  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const [airRightEstimates, setAirRightEstimates] = useState<any>(undefined);
  const [airRightEstimateMarkers, setAirRightEstimateMarkers] = useState<any[]>(
    [],
  );

  const { getAirRightEstimates } = AirRightsEstimateService();
  const { getTotalAirspacesByUserAddress } = AirspaceRentalService();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        if (user?.blockchainAddress && web3authStatus) {
          const airspaces = await getTotalAirspacesByUserAddress();

          if (airspaces && airspaces.previews) {
            const retrievedAirspaces = airspaces.previews.map((item: any) => ({
              address: item.address,
              id: item?.id,
            }));
            if (retrievedAirspaces.length > 0) {
              setAirspaces(retrievedAirspaces);
              setTotalAirspace(airspaces.total);
            } else {
              console.info("No airspaces found.");
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user?.blockchainAddress, web3authStatus]);

  //Removes cached airspaceData when address is in coOrdinates
  useLayoutEffect(() => {
    const propertyAddress = searchParams?.get("propertyAddress");
    const geoLocation = searchParams?.get("geoLocation");

    if (propertyAddress || geoLocation) {
      localStorage.removeItem("airSpaceData");
    }
  }, [pathname]);

  // New map is created if not rendered
  useEffect(() => {
    if (map) return;

    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;

      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-15.498211, 28.035056],
        zoom: 15,
        bounds: [
          [-73.9876, 40.7661],
          [-73.9397, 40.8002],
        ],
        // AttributionControl: false
      });

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "draw_polygon",
      });
      setDrawTool(draw);

      newMap.on("render", function () {
        newMap.resize();
      });
      newMap.on("load", function () {
        newMap.addLayer({
          id: "maine",
          type: "fill",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: [],
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

      const handleCoordinates = async (e) => {
        setIsDrawMode(true);
        setIsLoading(true);
        const drawnFeatures = draw.getAll();
        if (drawnFeatures.features.length > 0) {
          const coordinates =
            drawnFeatures.features[0].geometry.coordinates[0][0];
          const el = document.createElement("div");
          el.id = "markerWithExternalCss";
          new mapboxgl.Marker(el).setLngLat(coordinates).addTo(newMap);
          const longitude = coordinates[0];
          const latitude = coordinates[1];
          setCoordinates({ longitude, latitude });
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`,
          );
          const data = await response.json();
          setDontShowAddressOnInput(true);
          if (data.features && data.features.length > 0) {
            setAddress(data.features[0].place_name);
            setData((prev) => {
              return { ...prev, address: data.features[0].place_name };
            });
            setShowClaimModal(true);
            setFlyToAddress(data.features[0].place_name);
          }
        }
        setIsDrawMode(false);
      };

      newMap.on("draw.create", handleCoordinates);
      newMap.on("draw.update", handleCoordinates);

      setMap(newMap);

      //Doesnt move the map to iplocation when user persisted initial state in
      const initialAirSpaceData = localStorage.getItem("airSpaceData");
      if (!initialAirSpaceData) {
        flyToUserIpAddress(newMap);
      }
    };
    createMap();
  }, [user]);

  //Gets address suggestions
  useEffect(() => {
    if (isDrawMode) {
      setIsDrawMode(false);
      return;
    }

    if (!address) return setShowOptions(false);

    // eslint-disable-next-line no-undef
    let timeoutId: NodeJS.Timeout;

    const getAddresses = async () => {
      timeoutId = setTimeout(async () => {
        try {
          const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

          const response = await fetch(mapboxGeocodingUrl);
          if (!response.ok) throw new Error("Error while getting addresses");
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            setAddresses(data.features);
          } else {
            setAddresses([]);
          }
        } catch (error) {
          console.error(error);
        }
      }, 500);
    };

    getAddresses();

    return () => clearTimeout(timeoutId);
  }, [address]);

  //Flies to the new address
  useEffect(() => {
    const propertyAddress = searchParams?.get("propertyAddress");
    if ((!flyToAddress || flyToAddress === "") && !propertyAddress) return;

    const goToAddress = async () => {
      try {
        setIsLoading(true);
        let mapBoxGeocodingUrl;
        if (flyToAddress) {
          mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${flyToAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;
        } else {
          mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${propertyAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;
        }
        const response = await fetch(mapBoxGeocodingUrl);
        if (!response.ok) {
          throw new Error("Error while getting new address location");
        }
        const data = await response.json();
        if (!data.features || data.features.length === 0) {
          throw new Error("Address not found");
        }
        const { coordinates } = data.features[0].geometry;
        const temp: mapboxgl.LngLatLike = {
          lng: coordinates[0],
          lat: coordinates[1],
        };
        setCoordinates({ longitude: coordinates[0], latitude: coordinates[1] });
        setIsLoading(false);
        setAddress(data.features[0]?.place_name);
        map?.flyTo({
          center: temp,
          zoom: 16,
        });
      } catch (error) {
        setIsLoading(false);
        toast.error("invalid address");
      }
    };
    goToAddress();
  }, [flyToAddress, map]);
  useEffect(() => {
    if (map && coordinates?.latitude !== "" && coordinates?.longitude !== "") {
      const temp: mapboxgl.LngLatLike = {
        lng: Number(coordinates.longitude),
        lat: Number(coordinates?.latitude),
      };
      if (marker) {
        marker.remove();
        setMarker(null);
      }
      const newMarker = new mapboxgl.Marker({
        color: "#3FB1CE",
      })
        .setLngLat(temp)
        .addTo(map as mapboxgl.Map);
      setMarker(newMarker);
    }
  }, [map, coordinates.latitude, coordinates.longitude]);

  //Adds address for the new address
  useEffect(() => {
    const propertyAddress = searchParams?.get("propertyAddress");
    const geoLocation = searchParams?.get("geoLocation");

    if ((propertyAddress || geoLocation) && !address) {
      // This condition prevent rerenderings,
      if (isMobile) {
        setShowMobileMap(true);
      }
      if (
        (propertyAddress && propertyAddress.length > 2) ||
        (geoLocation && geoLocation.length > 2)
      ) {
        if (geoLocation) {
          // Prioritizing the geolocation over Property Address as it is more consistant
          setFlyToAddress(geoLocation);
        } else if (propertyAddress) {
          setFlyToAddress(propertyAddress);
        }
      }
    }

    if (flyToAddress === address) setShowOptions(false);
    if (flyToAddress) setData((prev) => ({ ...prev, address: address }));
  }, [flyToAddress, address, pathname]);

  // Update map markers when air right estimates are available
  useEffect(() => {
    if (map && airRightEstimates && airRightEstimates.main.estimate) {
      removeMapMarker();
      removeEstimateMarkers();

      const newMarkers = [
        airRightEstimates.main,
        ...airRightEstimates.nearby,
      ].map((est) => createAirRightEstimateMarker(map, est));

      setAirRightEstimateMarkers(newMarkers);
    }
  }, [map, airRightEstimates]);

  // Get air rights estimates for address
  useEffect(() => {
    async function getEstimates() {
      const decodedPropertyAddress = decodeURIComponent(
        searchParams.get("propertyAddress") || "",
      );

      if (decodedPropertyAddress) {
        handleEstimateAirRights(decodedPropertyAddress);
      }
    }

    getEstimates();
  }, []);

  useEffect(() => {
    if (!showFailurePopUp) return;
    const timeoutId = setTimeout(() => {
      setShowFailurePopUp(false);
      setErrorMessages([]);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, [showFailurePopUp]);

  useEffect(() => {
    const inintialAirSpaceDataString = localStorage.getItem("airSpaceData");

    if (inintialAirSpaceDataString) {
      const parsedInitialAirspaceData = JSON.parse(inintialAirSpaceDataString);
      if (parsedInitialAirspaceData?.address?.length > 2) {
        setData(parsedInitialAirspaceData);
        setFlyToAddress(parsedInitialAirspaceData.address);
        setAddress(parsedInitialAirspaceData.address);
        setShowClaimModal(true);
      } else {
        console.info("no initial datta");
      }
    }
  }, []);

  const handleSelectAddress = async (
    placeName: string,
    fetchEstimates: boolean,
  ) => {
    setAddress(placeName);
    setFlyToAddress(placeName);
    setShowOptions(false);
    setAirRightEstimates(undefined);

    if (fetchEstimates) {
      removeEstimateMarkers();
      await handleEstimateAirRights(placeName);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("showTour")) {
      setIsOpen(true);
      localStorage.removeItem("showTour");
    }
  }, []);

  useEffect(() => {
    if (currentStep === 1 && isMobile) {
      setShowMobileMap(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 3 && isMobile) {
      setShowClaimModal(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) {
      setShowMobileMap(false);
      setShowClaimModal(false);
    }
  }, [isOpen]);

  const onClaim = async (images: [], _address?: string) => {
    try {
      const isRedirecting = redirectIfUnauthenticated();

      if (isRedirecting) {
        setAndClearOtherPublicRouteData("airSpaceData", data);

        return;
      }
      if (!user) return;
      setClaimButtonLoading(true);
      const {
        address,
        title,
        hasChargingStation,
        hasLandingDeck,
        hasZoningPermission,
        hasStorageHub,
        rent,
        timezone,
        transitFee,
        noFlyZone,
        isFixedTransitFee,
        weekDayRanges,
        orderPhotoforGeneratedMap,
        assessorParcelNumber,
      } = data;
      const latitude = Number(coordinates.latitude);
      const longitude = Number(coordinates.longitude);
      const errors: string[] = [];

      if (!title) {
        errors.push("Please enter a name for the Airspace");
      }

      const postData = {
        address: _address || address,
        ownerId: user.id,
        propertyStatusId: 0,
        hasChargingStation,
        hasLandingDeck,
        hasStorageHub,
        isRentableAirspace: rent,
        title,
        transitFee,
        noFlyZone,
        isFixedTransitFee,
        latitude,
        longitude,
        timezone,
        hasZoningPermission,
        vertexes: [
          { latitude: latitude + 0.0001, longitude: longitude + 0.0001 },
          { latitude: latitude + 0.0001, longitude: longitude - 0.0001 },
          { latitude: latitude - 0.0001, longitude: longitude + 0.0001 },
          { latitude: latitude - 0.0001, longitude: longitude - 0.0001 },
        ],
        weekDayRanges,
        orderPhotoforGeneratedMap,
        assessorParcelNumber,
        images,
      };
      if (!weekDayRanges.some((item) => item.isAvailable)) {
        errors.push("Kindly ensure that at least one day is made available.");
      }
      if (errors.length > 0) {
        setErrorMessages(errors);
        setShowFailurePopUp(true);
        setShowClaimModal(false);
        return;
      }

      const responseData = await claimProperty({ postData });
      if (!responseData) {
        setShowFailurePopUp(true);
      } else {
        setShowSuccessPopUp(true);
        setShowClaimModal(false);
        setData({ ...defaultData });
        if (user?.KYCStatusId === StatusTypes.NotAttempted) {
          setShowPopup(true);
        }
      }
      setDontShowAddressOnInput(false);
    } catch (error) {
      console.error(error);
      toast.error("Error when creating property.");
    } finally {
      setIsLoading(false);
      setClaimButtonLoading(false);
    }
    removePubLicUserDetailsFromLocalStorage(
      "airSpaceData",
      user?.blockchainAddress,
    );
  };
  const flyToUserIpAddress = async (map) => {
    if (!map) {
      return;
    }
    try {
      const propertyAddress = searchParams?.get("propertyAddress");
      const geoLocation = searchParams?.get("geoLocation");

      if (propertyAddress || geoLocation) {
        //Do nothing
      } else {
        const ipResponse = await axios.get(
          "https://api.ipify.org/?format=json",
        );
        const ipAddress = ipResponse.data.ip;
        const ipGeolocationApiUrl = await axios.get(
          `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION}&ip=${ipAddress}`,
        );
        const latitude = parseFloat(ipGeolocationApiUrl.data.latitude);
        const longitude = parseFloat(ipGeolocationApiUrl.data.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          return;
        }
        map.flyTo({
          center: [longitude, latitude],
          zoom: 15,
        });
        if (marker) {
          marker.remove();
          setMarker(null);
        }
        const newMarker = new mapboxgl.Marker({
          color: "#3FB1CE",
        })
          .setLngLat({ lng: longitude, lat: latitude })
          .addTo(map as mapboxgl.Map);
        setMarker(newMarker);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSetAddress = (value) => {
    setAddress(value);
    if (!showOptions) setShowOptions(true);
  };
  const handleOpenAirspaceMap = () => {
    setShowHowToModal(false);
    setShowMobileMap(true);
  };

  const removeMapMarker = () => {
    if (marker) {
      marker.remove();
      setMarker(null);
    }
  };

  const handleEstimateAirRights = async (address: string) => {
    setIsLoadingEstimates(true);
    const estimates = await getAirRightEstimates(address);
    setAirRightEstimates(estimates);
    setIsLoadingEstimates(false);
  };

  const removeEstimateMarkers = () => {
    airRightEstimateMarkers.forEach((m) => m.remove());
    setAirRightEstimateMarkers([]);
  };

  const router = useRouter();
  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Airspaces</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
        <Sidebar />
        <div className="w-full h-full flex flex-col overflow-scroll md:overflow-hidden">
          {!showMobileMap && <PageHeader pageTitle={"Airspaces"} />}
          {((showMobileMap && isMobile) ||
            (isOpen && currentStep === 1 && isMobile)) && (
            <ExplorerMobile
              onGoBack={() => setShowMobileMap(false)}
              address={address}
              setAddress={handleSetAddress}
              addresses={addresses}
              showOptions={showOptions}
              handleSelectAddress={(value) => handleSelectAddress(value, false)}
            />
          )}

          <div>
            {isMobile && showOptions && addresses.length > 0 && (
              <div className="w-full flex items-center justify-center bg-white pb-[18px]">
                <div className=" p-[16px] w-[345px] flex flex-col items-center justify-center border border-blue-500 rounded-lg ">
                  <div className="w-[301px]">
                    {addresses.slice(0, 1).map((item: Address) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          handleSelectAddress(item.place_name, true)
                        }
                        className="w-full text-left text-[#222222]"
                      >
                        <div className="flex items-center">
                          <div className="w-[10%] h-6 mr-3">
                            <LocationPointIcon />
                          </div>
                          <div className="w-[90%] text-[14px]">
                            {item.place_name}
                          </div>
                        </div>
                      </div>
                    ))}

                    {((isMobile && showMobileMap) ||
                      (isOpen && currentStep === 2 && isMobile)) && (
                      <div
                        onClick={() => {
                          setShowClaimModal(true);
                          setIsLoading(true);
                          handleSelectAddress(addresses[0].place_name, false);
                        }}
                        className="mt-2 w-[301px] rounded-lg bg-[#0653EA] py-4 text-center text-white cursor-pointer"
                        style={{ maxWidth: "400px" }}
                      >
                        Claim Airspace
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {showHowToModal && (
            <HowToModal
              goBack={() => setShowHowToModal(false)}
              handleOpenAirspaceMap={handleOpenAirspaceMap}
            />
          )}

          {isMobile && showAirspacePage && (
            <MyMobileAirspacesPage
              setShowAirspacePage={setShowAirspacePage}
              airspaces={airspaces}
            />
          )}

          {isMobile && showMobileMap && !showAirspacePage && user && (
            <div
              onClick={() => {
                setShowAirspacePage(true);
              }}
              className="flex fixed bottom-[76px] left-0 w-full z-10 bg-white"
            >
              <div className="bg-white w-full p-4 shadow-md flex items-center">
                <div className="flex items-center justify-between  gap-8 w-[375px] h-[50px] px-4">
                  <p className="text-xl font-[500px] flex gap-4 items-center">
                    My Airspaces{" "}
                    {!isLoading && (
                      <span className="text-[15px] font-normal rounded-full border-2 border-black flex items-center justify-center h-8 w-8">
                        {" "}
                        {totalAirspace}
                      </span>
                    )}
                  </p>
                  <div className="w-5 h-5">
                    <ChevronRightIcon />
                  </div>
                </div>
              </div>
            </div>
          )}

          <section
            className={`relative flex h-full w-full items-start justify-start md:mb-0 ${showMobileMap ? "" : "mb-[79px]"}`}
          >
            <div
              className={`!absolute !left-0 !top-0 !m-0 !h-[100%] !w-[100%] `}
              id="map"
              style={{
                opacity: !isMobile ? "1" : showMobileMap ? "1" : "0",
                zIndex: !isMobile ? "20" : showMobileMap ? "5" : "-20",
              }}
            />
            {isMobile && (
              <Fragment>
                {(showClaimModal || (isOpen && currentStep >= 3)) && (
                  <ClaimModal
                    onCloseModal={() => {
                      setDontShowAddressOnInput(false);
                      removePubLicUserDetailsFromLocalStorageOnClose(
                        "airSpaceData",
                      );
                      setShowClaimModal(false);
                      setIsLoading(false);
                      setData({ ...defaultData });
                    }}
                    data={{ ...data, address }}
                    setData={setData}
                    onClaim={onClaim}
                    claimButtonLoading={claimButtonLoading}
                    dontShowAddressOnInput={dontShowAddressOnInput}
                    setDontShowAddressOnInput={setDontShowAddressOnInput}
                  />
                )}
                {(showSuccessPopUp || showFailurePopUp) && (
                  <SuccessModal
                    errorMessages={errorMessages}
                    isSuccess={showSuccessPopUp}
                    closePopUp={() => {
                      showFailurePopUp
                        ? setShowFailurePopUp(false)
                        : setShowSuccessPopUp(false);
                    }}
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
                  handleSelectAddress={handleSelectAddress}
                  airRightEstimates={airRightEstimates}
                  isLoadingEstimates={isLoadingEstimates}
                  onClaimAirspace={() => {
                    setShowClaimModal(true);
                    setIsLoading(true);
                  }}
                />
                <div className="hidden sm:block">
                  <Slider />
                </div>
                {showSuccessPopUp && (
                  <SuccessPopUp
                    isVisible={showSuccessPopUp}
                    setShowSuccessPopUp={setShowSuccessPopUp}
                  />
                )}
                {showFailurePopUp && (
                  <FailurePopUp
                    isVisible={showFailurePopUp}
                    errorMessages={errorMessages}
                  />
                )}
                {!showSuccessPopUp && !isMobile && (
                  <div>
                    <PolygonTool
                      drawTool={drawTool}
                      map={map}
                      isDrawMode={isDrawMode}
                      setDrawMode={setIsDrawMode}
                    />
                  </div>
                )}
                {(showClaimModal || (isOpen && currentStep >= 2)) && (
                  <ClaimModal
                    onCloseModal={() => {
                      removePubLicUserDetailsFromLocalStorageOnClose(
                        "airSpaceData",
                      );
                      setShowClaimModal(false);
                      setIsLoading(false);
                      setData({ ...defaultData });
                    }}
                    data={{ ...data, address }}
                    setData={setData}
                    onClaim={onClaim}
                    claimButtonLoading={claimButtonLoading}
                    dontShowAddressOnInput={dontShowAddressOnInput}
                    setDontShowAddressOnInput={setDontShowAddressOnInput}
                  />
                )}
              </div>
            )}
            {(!showMobileMap || isOpen) && (
              <div className="flex h-full w-full flex-col md:hidden">
                <div
                  onClick={() => setShowMobileMap(true)}
                  className="flex w-full flex-col justify-between gap-[184px] bg-cover bg-center bg-no-repeat p-[17px]"
                  style={{ backgroundImage: "url('/images/map-bg.png')" }}
                >
                  <div className="w-full rounded-[20px] bg-[#222222] p-[12px] text-center text-base font-normal text-white">
                    Exciting times ahead!
                    <br />
                    Claim your airspace 🚀✨
                  </div>
                  <div className="claim-step w-full rounded-lg bg-[#0653EA] p-[12px] text-center text-base font-normal text-white">
                    Claim your airspace
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-[23px] px-[13px] py-[29px]">
                  <div className="flex flex-1 items-center gap-[14px]">
                    <Link
                      href={"/airspaces"}
                      className="flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]"
                      style={{
                        backgroundImage: "url('/images/airspace-preview.png')",
                      }}
                    >
                      <p className="text-xl font-medium text-white">Airspace</p>
                    </Link>
                    <Link
                      href={"/portfolio"}
                      className="flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]"
                      style={{
                        backgroundImage: "url('/images/portfolio.jpg')",
                      }}
                    >
                      <p className="text-xl font-medium text-white">
                        Portfolio
                      </p>
                    </Link>
                  </div>

                  <div
                    onClick={() => setShowHowToModal(true)}
                    className="flex cursor-pointer items-center justify-center gap-[7px] rounded-[20px] bg-[#222222] p-[13px] text-white"
                  >
                    <div className="h-[24px] w-[24px]">
                      <HelpQuestionIcon color="white" isActive={false} />
                    </div>
                    <p>How to Claim My Airspace?</p>
                  </div>
                </div>
              </div>
            )}
            {showPopup && (
              <VerificationPopup
                onVerifyMyAccount={() => router.push("/my-account")}
              />
            )}
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
