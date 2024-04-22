import React, { Fragment, useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import Head from "next/head";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import DroneSVGComponent from "@/Components/Modals/DroneSVGComponent";
import RadarModal from "@/Components/Modals/RadarModal";
import DroneMobileBottomBar from "@/Components/Modals/DroneMobileBottomBar";
import Explorer from "@/Components/Explorer/Explorer";
import MobileExplorer from "@/Components/ExplorerMobile/MobileExplorer";
import { RadarLocationIcon, RadarLayerIcon } from "@/Components/Icons";
import { useMobile } from "@/hooks/useMobile";
import useDroneSocket from "../../../hooks/useDrone";
import {
  closePopups,
  toggleMapView,
  handleZoomIn,
  handleZoomOut,
  flyToUserIpAddress,
  goToAddress,
  drawFlightPath,
  getAddresses,
  handleClick,
  handleMouseEnter,
  handleMouseLeave,
  createMarkerElement,
  createMarker,
  removeMarkerElements,
  handleMobileTouchEnd,
} from "../../../utils/radarUtils/index";
import { JsonObject, Coordinates } from "../../../types/RemoteIdentifierDrone";
const Radar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [showMobileMap, setShowMobileMap] = useState<boolean>(isMobile);
  const [address, setAddress] = useState<string>("");
  const [addressData, setAddressData] = useState<any>();
  const [addresses, setAddresses] = useState<
    { id: string; place_name: string }[]
  >([]);
  const [flyToAddress, setFlyToAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [marker, setMarker] = useState<Marker | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [mobileBottomDroneDetailVisible, setMobileBottomDroneDetailVisible] =
    useState<boolean>(false);
  const [showDroneDetail, setShowDroneDetail] = useState<boolean>(false);
  const [DroneDataDetailSelected, setDroneDataSelected] =
    useState<JsonObject | null>(null);
  const [isAllPopupClosed, setIsAllPopupClosed] = useState<boolean>(false);
  const [isDroneSVGColor, setIsDroneSVGColor] = useState<{
    [key: number]: boolean;
  }>({});
  const [isDroneHoverSVGColor, setIsDroneHoverSVGColor] = useState<{
    [key: number]: boolean;
  }>({});
  const [droneMarker, setDroneMarker] = useState<boolean>(false);
  const [droneMarkerArray, setDroneMarkerArray] = useState<
    Record<number, Marker>
  >({});
  const [droneSocketDatas, setSocketDatas] = useState<JsonObject[] | null>(
    null
  );
  const [droneId, setDroneId] = useState<string | undefined>(undefined);
  type BoundingBox = {
    minLatitude: number;
    maxLatitude: number;
    minLongitude: number;
    maxLongitude: number;
  };
  const [boundingBox, setBoundingBox] = useState<BoundingBox | undefined>({
    minLatitude: 17.555484669042485,
    maxLatitude: 55.242651682301556,
    minLongitude: -41.90240522562678,
    maxLongitude: 38.82041496478121,
  });
  const router = useRouter();
  useEffect(() => {
    setShowMobileMap(isMobile);
  }, [isMobile]);
  useEffect(() => {
    if (map) return;
    const createMap = () => {
      if (process.env.NEXT_PUBLIC_MAPBOX_KEY) {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
      }
      const newMap: mapboxgl.Map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 40],
        zoom: 6,
      });
      newMap.addControl(new mapboxgl.NavigationControl());
      const nav = new mapboxgl.NavigationControl();
      newMap.addControl(nav, "top-right");
      newMap.on("load", () => {
        setMap(newMap);
      });
    };
    createMap();
  }, [map]);
  useDroneSocket(
    map,
    boundingBox,
    droneId,
    setBoundingBox,
    setSocketDatas,
    setDroneDataSelected,
    setIsLoading
  );
  useEffect(() => {
    if (!map) return;
    if (DroneDataDetailSelected) {
      drawFlightPath(
        map,
        DroneDataDetailSelected?.remoteData?.location?.flightPath
      );
    }
  }, [DroneDataDetailSelected, map]);
  useEffect(() => {
    if (!map) return;
    const addEventListeners = (
      markerElement: HTMLElement,
      marker: mapboxgl.Marker,
      popupName: string,
      index: number,
      data: JsonObject
    ) => {
      if (!isMobile) {
        markerElement.addEventListener("click", () =>
          handleClick(
            marker,
            data,
            popupName,
            index,
            setIsDroneSVGColor,
            setIsAllPopupClosed,
            setDroneId,
            setShowDroneDetail,
            map,
            showDroneDetail,
            setIsLoading
          )
        );
        markerElement.addEventListener("mouseenter", () =>
          handleMouseEnter(
            marker,
            popupName,
            index,
            setIsDroneHoverSVGColor,
            map
          )
        );
        markerElement.addEventListener("mouseleave", () =>
          handleMouseLeave(index, setIsDroneHoverSVGColor)
        );
      } else {
        markerElement.addEventListener("touchend", () =>
          handleMobileTouchEnd(
            marker,
            data,
            popupName,
            index,
            map,
            setIsAllPopupClosed,
            setIsDroneSVGColor,
            setDroneId,
            setMobileBottomDroneDetailVisible
          )
        );
      }
    };
    const addDroneMarkers = (droneData: JsonObject[] | null) => {
      droneData?.forEach((data, index) => {
        const popupName = data?.remoteData?.connection?.macAddress;
        const latitude = data?.remoteData?.location?.latitude;
        const longitude = data?.remoteData?.location?.longitude;
        const markerElement = createMarkerElement(index);
        const droneColor =
          isDroneSVGColor[index] || isDroneHoverSVGColor[index]
            ? "#FF3D00"
            : "#0000FF";
        markerElement.innerHTML = ReactDOMServer.renderToString(
          <DroneSVGComponent
            droneColor={droneColor}
            direction={data?.remoteData?.location?.direction}
          />
        );
        let marker;
        if (!droneMarker && latitude && longitude) {
          marker = createMarker(latitude, longitude, markerElement, map);
          setDroneMarkerArray({ ...droneMarkerArray, [index]: marker });
        } else {
          marker = droneMarkerArray[index];
          removeMarkerElements(index);
          marker = createMarker(latitude, longitude, markerElement, map);
          setDroneMarkerArray({ ...droneMarkerArray, [index]: marker });
        }
        addEventListeners(markerElement, marker, popupName, index, data);
      });
      setDroneMarker(true);
    };
    addDroneMarkers(droneSocketDatas);
    return () => {
      map.off("click", closePopups);
    };
  }, [
    map,
    isMobile,
    showDroneDetail,
    ...Object.values(isDroneSVGColor),
    ...Object.values(isDroneHoverSVGColor),
    droneSocketDatas,
  ]);
  useEffect(() => {
    if (isAllPopupClosed) {
      closePopups();
      setIsDroneSVGColor({});
      setIsDroneHoverSVGColor({});
      setDroneDataSelected(null);
      setDroneId(undefined);
      if (map && map.getSource("flightPath")) {
        map.removeLayer("flightPath");
        map.removeSource("flightPath");
      }
    }
  }, [isAllPopupClosed, map]);
  useEffect(() => {
    if (!showOptions) setShowOptions(true);
    if (!address) return setShowOptions(false);
    let timeoutId: NodeJS.Timeout | null = null;
    getAddresses(setAddresses, setCoordinates, timeoutId, address);
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    address,
    showOptions,
    setAddress,
    setAddresses,
    setCoordinates,
    setShowOptions,
  ]);
  useEffect(() => {
    if (!flyToAddress || !map) return;
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
  useEffect(() => {
    if (flyToAddress === address) setShowOptions(false);
  }, [flyToAddress, address]);
  const handleShowDetailFullMobile = () => {
    setMobileBottomDroneDetailVisible(false);
    setShowDroneDetail(true);
  };
  const handleGoBack = () => {
    setIsLoading(true);
    router.push("/homepage/airspace2");
  };
  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Radar</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-lavender-gray-bg">
        {!showMobileMap && <Sidebar />}
        <div className="flex h-full w-full flex-col">
          {!showMobileMap && <PageHeader pageTitle={"Radar"} />}
          {showMobileMap && (
            <MobileExplorer
              onGoBack={handleGoBack}
              address={address}
              setAddress={setAddress}
              setShowOptions={setShowOptions}
              setFlyToAddress={setFlyToAddress}
              addresses={addresses}
              showOptions={showOptions}
            />
          )}
          <section
            className={`relative flex h-full w-full items-start justify-start md:mb-0 ${
              showMobileMap ? "" : "mb-[79px]"
            }`}
          >
            <div
              className={`!absolute !left-0 !top-0 !m-0 !h-screen !w-full`}
              style={{
                opacity: "1",
                zIndex: "20",
              }}
              id="map"
            />
            {!isMobile && (
              <div className="flex items-start justify-start">
                <Explorer
                  address={address}
                  setAddress={setAddress}
                  addresses={addresses}
                  showOptions={showOptions}
                  setFlyToAddress={setFlyToAddress}
                  setShowOptions={setShowOptions}
                  setSatelliteView={() => toggleMapView(map)}
                  handleZoomIn={() => handleZoomIn(map)}
                  handleZoomOut={() => handleZoomOut(map)}
                  flyToUserIpAddress={() => flyToUserIpAddress(map)}
                />
              </div>
            )}
            {isMobile && (
              <div className="flex flex-col z-40 rounded-[10px] gap-md bg-white px-[21px] py-[19px] m-4 ml-auto">
                <button onClick={() => flyToUserIpAddress(map)}>
                  <RadarLocationIcon />
                </button>
                <button onClick={() => toggleMapView(map)}>
                  <RadarLayerIcon />
                </button>
              </div>
            )}
            {!showMobileMap && (
              <div className="flex h-full w-full flex-col md:hidden">
                <div
                  onClick={() => setShowMobileMap(true)}
                  className="flex w-full flex-col justify-between gap-[184px] bg-cover bg-center bg-no-repeat p-[17px]"
                  style={{ backgroundImage: "url('/images/map-bg.png')" }}
                ></div>
              </div>
            )}
            {isMobile && mobileBottomDroneDetailVisible && !isLoading && (
              <DroneMobileBottomBar
                DroneDataDetailSelected={DroneDataDetailSelected}
                onActivate={handleShowDetailFullMobile}
              />
            )}
            {showDroneDetail && !isLoading && (
              <RadarModal
                onClose={() => {
                  setShowDroneDetail(false);
                  setIsAllPopupClosed(true);
                }}
                DroneDataDetailSelected={DroneDataDetailSelected}
                isLoading={isLoading}
              />
            )}
          </section>
        </div>
      </div>
    </Fragment>
  );
};
export default Radar;
