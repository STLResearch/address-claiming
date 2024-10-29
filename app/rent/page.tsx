"use client";
import { Fragment, useState, useEffect, SetStateAction } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import maplibregl from "maplibre-gl";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
  Position,
  Geometry,
} from "geojson";
import * as Sentry from "@sentry/nextjs";
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
  const [loadingRegAddresses, setLoadingRegAddresses] =
    useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [registeredAddress, setRegisteredAddress] = useState<PropertyData[]>(
    [],
  );
  const [mapMove, setMapMove] = useState();
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
  const [marker, setMarker] = useState<Marker | null | undefined>();
  const [rentData, setRentData] = useState<PropertyData | undefined>();
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const { user } = useAuth();
  const [regAdressShow, setRegAdressShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { findPropertiesByCoordinates } = PropertiesService();
  // Define the shape of the data you're receiving
  interface Area {
    type: string; // Type of the area, consider making this more specific if needed
    message: string;
    region: {
      type: "Polygon" | "MultiPolygon"; // Ensure valid GeoJSON geometry types
      coordinates: number[][] | number[][][]; // Keep this flexible for now
    };
  }

  useEffect(() => {
    if (map) return;

    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;

      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-104.718243, 40.413869], // Default center (US)
        zoom: 5,
      });

      newMap.on("render", function () {
        newMap.resize();
      });

      const fetchRestrictedAreas = async (geoHash: string) => {
        let restrictedAreas: Area[] = [];
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/restrictions?geoHash=${geoHash}`,
          );
          restrictedAreas = (await response.json()) as Area[];
        } catch (error) {
          Sentry.captureException(error);
        }

        const geoJsonData: FeatureCollection<
          Polygon | MultiPolygon,
          GeoJsonProperties
        > = {
          type: "FeatureCollection",
          features: restrictedAreas.map(
            (area): Feature<Polygon | MultiPolygon, GeoJsonProperties> => ({
              type: "Feature",
              properties: {
                type: area.type,
                message: area.message,
              },
              geometry: {
                type: area.region.type as "Polygon" | "MultiPolygon",
                coordinates: area.region.coordinates.map((coords) => {
                  return coords.map((coord) => coord as Position);
                }) as Position[][] | Position[][][],
              } as Polygon | MultiPolygon,
            }),
          ),
        };

        if (newMap.getSource("restricted-areas")) {
          (
            newMap.getSource("restricted-areas") as mapboxgl.GeoJSONSource
          ).setData(geoJsonData);
        } else {
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
        }
      };

      const determineGeoHash = (lng: number, lat: number): string => {
        // UK coordinates
        if (lng >= -10 && lng <= 2 && lat >= 50 && lat <= 60) {
          return "gcp";
        }
        // US coordinates
        if (lng >= -125 && lng <= -65 && lat >= 24 && lat <= 49) {
          return "9yw";
        }
        return "";
      };

      newMap.on("load", async function () {
        const mapCenter = newMap.getCenter();
        const geoHash = determineGeoHash(mapCenter.lng, mapCenter.lat);

        if (geoHash) {
          await fetchRestrictedAreas(geoHash);
        }

        newMap.zoomOut({ duration: 4 });
        newMap.dragRotate.disable();

        let timeoutId: ReturnType<typeof setTimeout>;
        newMap.on("move", async (e) => {
          setLoadingRegAddresses(true);
          clearTimeout(timeoutId);

          timeoutId = setTimeout(async () => {
            const crds = e.target.getBounds();
            const mapCenter = e.target.getCenter();
            const geoHash = determineGeoHash(mapCenter.lng, mapCenter.lat);

            if (geoHash) {
              await fetchRestrictedAreas(geoHash);
            }

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
                const lngLat = new mapboxgl.LngLat(
                  responseData[i].longitude,
                  responseData[i].latitude,
                );
                const popup = new mapboxgl.Popup({ offset: 25 })
                  .trackPointer()
                  .setHTML(`<strong>${responseData[i].address}</strong>`);
                const marker = new mapboxgl.Marker({
                  color: "#3FB1CE",
                })
                  .setLngLat(lngLat)
                  .setPopup(popup)
                  .addTo(newMap);

                marker.getElement().addEventListener("click", function () {
                  setRentData(responseData[i]);
                  setShowClaimModal(true);
                });
              }
            }
          }, 3000);
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
    goToAddress(
      flyToAddress,
      setCoordinates,
      setAddressData,
      setIsLoading,
      setMarker,
      map,
      marker,
    );
  }, [flyToAddress, map]);

  useEffect(() => {
    if (flyToAddress === address) setShowOptions(false);
  }, [flyToAddress, address]);

  useEffect(() => {
    const inintialRentDataString = localStorage.getItem("rentData");
    // Check if the retrieved string is neither null nor the string "undefined"
    const parsedInitialRentData =
      inintialRentDataString && inintialRentDataString !== "undefined"
        ? JSON.parse(inintialRentDataString)
        : null;
    if (parsedInitialRentData && parsedInitialRentData?.address?.length > 2) {
      setRentData(parsedInitialRentData);
      setFlyToAddress(parsedInitialRentData.address);
      setShowClaimModal(true);
    } else {
      console.info("No initial data");
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
            <section
              className={
                "relative mb-[79px] flex h-full w-full items-start justify-start md:mb-0"
              }
            >
              <div
                className={"!absolute !left-0 !top-0 !m-0 !h-screen !w-screen"}
                id="map"
              />

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
