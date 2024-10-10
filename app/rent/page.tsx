"use client";
import { Fragment, useState, useEffect, SetStateAction } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import maplibregl from "maplibre-gl";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import Explorer from "@/Components/Rent/Explorer/Explorer";
import useAuth from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import Head from "next/head";
import ZoomControllers from "@/Components/ZoomControllers";
import ExplorerMobile from "@/Components/Rent/Explorer/ExplorerMobile";
import RentModal from "@/Components/Rent/RentModal/RentModal";
import { goToAddress } from "@/utils/apiUtils/apiFunctions";
import { Coordinates, PropertyData } from "@/types";
import Sidebar from "@/Components/Shared/Sidebar";
import PropertiesService from "../../services/PropertiesService";
const Rent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [loadingRegAddresses, setLoadingRegAddresses] = useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [registeredAddress, setRegisteredAddress] = useState<PropertyData[]>([]);
  const [mapMove, setMapMove] = useState();
  const [address, setAddress] = useState<string>("");
  const [addressData, setAddressData] = useState<
    { mapbox_id: string; short_code: string; wikidata: string } | null | undefined
  >();
  const [addresses, setAddresses] = useState<{ id: string; place_name: string }[]>([]);
  const [flyToAddress, setFlyToAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [marker, setMarker] = useState<Marker | null | undefined>();
  const [rentData, setRentData] = useState<PropertyData | undefined>();
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const { user } = useAuth();
  const [regAdressShow, setRegAdressShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { findPropertiesByCoordinates } = PropertiesService();
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
      newMap.on("load", async function () {
        let restrictedAreas = [];
        try {
          const response = await fetch("https://dev-api.sky.trade/restrictions?geoHash=gcp");
          restrictedAreas = await response.json();
        } catch (error) {
          console.error("Error fetching restricted areas:", error);
        }
        const geoJsonData = {
          type: "FeatureCollection",
          features: restrictedAreas.map((area, index) => ({
            type: "Feature",
            properties: {
              type: area.type,
              message: area.message,
            },
            geometry: {
              type: area.region.type,
              coordinates: area.region.coordinates,
            },
          })),
        };
        newMap.addSource("restricted-areas", {
          type: "geojson",
          data: geoJsonData,
        });
        newMap.addLayer({
          id: "restricted-areas-layer",
          type: "fill",
          source: "restricted-areas",
          layout: {},
          paint: {
            "fill-color": "#D20C0C",
            "fill-opacity": 0.5,
          },
        });
        newMap.zoomOut({ duration: 4 });
        let timeoutId;
        newMap.on("move", async (e) => {
          setLoadingRegAddresses(true);
          clearTimeout(timeoutId);
          timeoutId = setTimeout(async () => {
            const crds = e.target.getBounds();
            const responseData = await findPropertiesByCoordinates({
              postData: {
                minLongitude: crds._sw.lng,
                minLatitude: crds._sw.lat,
                maxLongitude: crds._ne.lng,
                maxLatitude: crds._ne.lat,
              },
            });

            let formattedProperties = [];
            if (responseData) {
              formattedProperties = responseData.filter((property) => {
                return (
                  property.longitude >= crds._sw.lng &&
                  property.longitude <= crds._ne.lng &&
                  property.latitude >= crds._sw.lat &&
                  property.latitude <= crds._ne.lat
                );
              });
            }
            setRegisteredAddress(formattedProperties);
            setLoadingRegAddresses(false);
            if (responseData.length > 0) {
              for (let i = 0; i < responseData.length; i++) {
                const lngLat = new mapboxgl.LngLat(responseData[i].longitude, responseData[i].latitude);
                const popup = new mapboxgl.Popup({ offset: 25 })
                  .trackPointer()
                  .setHTML(`<strong>${responseData[i].address}</strong>`);
                const marker = new mapboxgl.Marker({
                  color: "#3FB1CE",
                })
                  .setLngLat(lngLat)
                  .setPopup(popup)
                  .addTo(newMap);
                // Optional: Add event listeners to marker for interactivity
                marker.getElement().addEventListener("click", function () {
                  setRentData(responseData[i]);
                  setShowClaimModal(true);
                });
              }
            }
          }, 1000);
        });
      });
      setMap(newMap);
    };

    createMap();
  }, []);

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
    if (typeof window !== "undefined") {
      const inintialRentDataString = localStorage.getItem("rentData");

      let parsedInitialRentData = null;
      try {
        if (inintialRentDataString && inintialRentDataString !== "undefined") {
          parsedInitialRentData = JSON.parse(inintialRentDataString);
        }
      } catch (error) {
        console.error("Failed to parse rent data from localStorage:", error);
      }

      if (parsedInitialRentData && parsedInitialRentData?.address?.length > 2) {
        setRentData(parsedInitialRentData);
        setFlyToAddress(parsedInitialRentData.address);
        setShowClaimModal(true);
      } else {
        console.info("No valid initial rent data found.");
      }
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Marketplace : Rent</title>
      </Head>

      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      {
        <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded md:bg-[#F6FAFF]">
          <Sidebar />

          <div className="flex h-full w-full flex-col">
            <div className="hidden md:block">
              <PageHeader pageTitle={"Marketplace: Rent"} />
            </div>

            {isMobile && (
              <ExplorerMobile
                loadingReg={loadingRegAddresses}
                loading={loadingAddresses}
                address={address}
                setAddress={setAddress}
                addresses={addresses}
                showOptions={showOptions}
                regAdressShow={regAdressShow}
                registeredAddress={registeredAddress}
                map={map}
                marker={marker}
                setMarker={setMarker}
                setShowClaimModal={setShowClaimModal}
                rentData={rentData}
                setRentData={setRentData}
                setFlyToAddress={setFlyToAddress}
                setShowOptions={setShowOptions}
                setLoadingRegAddresses={setLoadingRegAddresses}
                setRegisteredAddress={setRegisteredAddress}
                setRegAdressShow={setRegAdressShow}
              />
            )}
            <section className={"relative mb-[79px] flex h-full w-full items-start justify-start md:mb-0"}>
              <div className={"!absolute !left-0 !top-0 !m-0 !h-screen !w-screen"} id="map" />

              {!isMobile && (
                <div className="flex items-start justify-start">
                  <Explorer
                    setLoadingRegAddresses={setLoadingRegAddresses}
                    loadingReg={loadingRegAddresses}
                    setRegisteredAddress={setRegisteredAddress}
                    loading={loadingAddresses}
                    address={address}
                    setAddress={setAddress}
                    addresses={addresses}
                    showOptions={showOptions}
                    regAdressShow={regAdressShow}
                    registeredAddress={registeredAddress}
                    map={map}
                    marker={marker}
                    setMarker={setMarker}
                    setShowClaimModal={setShowClaimModal}
                    rentData={rentData}
                    setRentData={setRentData}
                    setFlyToAddress={setFlyToAddress}
                    setShowOptions={setShowOptions}
                  />
                </div>
              )}
              {showClaimModal && (
                <RentModal
                  setShowClaimModal={setShowClaimModal}
                  rentData={rentData}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
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

export default Rent;
