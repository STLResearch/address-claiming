"use client";
import { Fragment, useState, useEffect, useRef } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import Explorer from "@/Components/Rent/Explorer/Explorer";
import useAuth from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import Head from "next/head";
import ZoomControllers from "@/Components/ZoomControllers";
import ExplorerMobile from "@/Components/Rent/Explorer/ExplorerMobile";
import RentDetail from "@/Components/Rent/RentDetail/RentDetail";
import { goToAddress } from "@/utils/apiUtils/apiFunctions";
import { Coordinates, PropertyData } from "@/types";
import Sidebar from "@/Components/Shared/Sidebar";
import PropertiesService from "../../services/PropertiesService";
import RentPreview from "@/Components/Rent/RentPreview/RentPreview";
import dayjs from "dayjs";
import { handleMouseEvent } from "@/utils/eventHandlerUtils/eventHandlers";
import RentSearchMobile from "@/Components/Rent/Explorer/RentSearchMobile";
const Rent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [loadingRegAddresses, setLoadingRegAddresses] =
    useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [registeredAddress, setRegisteredAddress] = useState<PropertyData[]>(
    [],
  );
  const [address, setAddress] = useState<string>("");
  const defaultValueDate = dayjs()
  .add(1, "h")
  .set("minute", 30)
  .startOf("minute");
  const [date, setDate] = useState(defaultValueDate);
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
  const [marker, setMarker] = useState<Marker | null | undefined>();
  const [rentData, setRentData] = useState<PropertyData | undefined>();
  const [showRentDetail, setShowRentDetail] = useState<boolean>(false);
  const [showRentPreview, setShowRentPreview] = useState<boolean>(false);
  const { user } = useAuth();
  const [regAdressShow, setRegAdressShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<PropertyData[]>([]);
  const { findPropertiesByCoordinates } = PropertiesService();
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  useEffect(() => {
    if (map) return;
    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;

      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-104.718243, 40.413869],
        zoom: 5,
      });
  
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
        newMap.zoomOut({ duration: 4 });
      });

      let timeoutId;

      newMap.on("move", () => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(async () => {
          const bounds = newMap.getBounds();

          setLoadingRegAddresses(true);

          const responseData = await findPropertiesByCoordinates({
            postData: {
              minLongitude: bounds._sw.lng,
              minLatitude: bounds._sw.lat,
              maxLongitude: bounds._ne.lng,
              maxLatitude: bounds._ne.lat,
            },
          });

          const formattedProperties = responseData?.filter((property) => {
            return (
              property.longitude >= bounds._sw.lng &&
              property.longitude <= bounds._ne.lng &&
              property.latitude >= bounds._sw.lat &&
              property.latitude <= bounds._ne.lat
            );
          }) || [];

          markers.forEach((marker) => marker.remove());
          setMarkers([]); 
          setRegisteredAddress(formattedProperties);
          setLoadingRegAddresses(false);
          setResponseData(formattedProperties);
        }, 3000); 
      });

      setMap(newMap);
    };

    createMap();

    return () => {
      if (map){
        (map as Map).remove(); 
      } 
        
    };
  }, []);

  useEffect(() => {
    if (!responseData.length || !map) return;

    const newMarkers: mapboxgl.Marker[] = [];

    responseData.forEach((data) => {
      const { longitude, latitude } = data;
      if (longitude === undefined || latitude === undefined) return;

      const lngLat = new mapboxgl.LngLat(longitude, latitude);

      const marker = new mapboxgl.Marker({
        color: "#3FB1CE",
      })
        .setLngLat(lngLat)
        .addTo(map);

      newMarkers.push(marker);

      const markerElement = marker.getElement();
      if (markerElement) {
        handleMouseEvent(
          isMobile,
          markerElement,
          marker,
          map,
          data,
          setShowRentDetail,
          setRentData
        );
      }
    });

    setMarkers(newMarkers);

  }, [responseData, isMobile, map, setShowRentDetail, setRentData]);

  useEffect(() => {
    if (registeredAddress.length > 0) {
      setRegAdressShow(true);
    } else {
      setRegAdressShow(false);
    }
  }, [registeredAddress]);

  useEffect(() => {
    if (!showOptions) setShowOptions(true);
    if (!address) return setShowOptions(false);

    setCoordinates(null);
    const timeoutId = setTimeout(async () => {
      try {
        const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

        const response = await fetch(mapboxGeocodingUrl);

        if (!response.ok) throw new Error("Error while getting addresses");
        const data = await response.json();
        if (!response.ok) {
          setLoadingAddresses(false);
          throw new Error("Error while getting addresses");
        }

        if (data.features && data.features.length > 0) {
          setAddresses(data.features);
          setLoadingAddresses(false);
        } else {
          setAddresses([]);
          setLoadingAddresses(false);
        }
      } catch (error) {
        console.error(error);
        //SetLoadingAddresses(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [address]);

  useEffect(() => {
    if (!flyToAddress) return;
    goToAddress(flyToAddress, setCoordinates, setAddressData, setIsLoading, setMarker, map, marker);
  }, [flyToAddress, map]);

  useEffect(() => {
    if (flyToAddress === address) setShowOptions(false);
  }, [flyToAddress, address]);

  useEffect(() => {
    const inintialRentDataString = localStorage.getItem("rentData");
    const parsedInitialRentData = inintialRentDataString ? JSON.parse(inintialRentDataString) : null;
    if (parsedInitialRentData && parsedInitialRentData?.address?.length > 2) {
      setRentData(parsedInitialRentData);
      setFlyToAddress(parsedInitialRentData.address);
      setShowRentDetail(true);
    } else {
      console.info("no initial datta");
    }
  }, []);

  return (
    <Fragment>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      {
        <div className="relative flex h-screen w-screen items-center justify-center overflow-clip rounded  md:bg-[#F6FAFF] ">
          <Sidebar />

          <div className="flex h-full w-full flex-col ">
            <div className="hidden md:block">
              <PageHeader pageTitle={"Marketplace: Rent"} />
            </div>

            {isMobile && (
              <ExplorerMobile
                registeredAddress={registeredAddress}
                setShowRentDetail={setShowRentDetail}
                setRentData={setRentData}
                setShowOptions={setShowOptions}
              />
            )}
            <section
              className={
                "relative flex w-full h-full justify-start items-start md:mb-0 mb-[79px] "
              }
            >
              <div
                className={"!absolute !top-0 !left-0 !m-0 !w-screen !h-screen"}
                id="map"
              />
              <RentSearchMobile
                address={address}
                setAddress={setAddress}
                addresses={addresses}
                setFlyToAddress={setFlyToAddress}
                setShowOptions={setShowOptions}
                showOptions={showOptions}
                
              />

              {!isMobile && (
                <div className="flex items-start justify-start">
                  <Explorer
                    loadingReg={loadingRegAddresses}
                    loading={loadingAddresses}
                    address={address}
                    setAddress={setAddress}
                    addresses={addresses}
                    showOptions={showOptions}
                    regAdressShow={regAdressShow}
                    registeredAddress={registeredAddress}
                    setShowRentDetail={setShowRentDetail}
                    setRentData={setRentData}
                    setFlyToAddress={setFlyToAddress}
                    setShowOptions={setShowOptions}
                  />
                </div>
              )}
              {showRentDetail && (
                <RentDetail
                date={date}
                setDate={setDate}
                setShowRentPreview={setShowRentPreview}
                setShowRentDetail={setShowRentDetail}
                  rentData={rentData}
                  isLoading={isLoading}
                />
              )}
              {showRentPreview && (
                <RentPreview
                date={date}
                  setShowRentPreview={setShowRentPreview}
                  setShowRentDetail={setShowRentDetail}
                  rentData={rentData}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}
            </section>
            <div className="hidden md:block">
              <ZoomControllers map={map} />
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default Rent;
