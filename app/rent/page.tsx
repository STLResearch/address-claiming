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
import RestrictionService from "@/services/restriction";
import { RestrictedAreaResponseI } from "@/services/restriction/type";
import RestrictedAreaInfo from "@/Components/RestrictedAreaInfo";
import axios from "axios";
import MapButtons from "@/Components/MapButtons";

const Rent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(true);
  const [loadingRegAddresses, setLoadingRegAddresses] =
    useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [registeredAddress, setRegisteredAddress] = useState<PropertyData[]>(
    [],
  );
  const [mapMove, setMapMove] = useState();
  const [address, setAddress] = useState<string>("");
  const [showRestrictedAreas, setShowRestrictedAreas] =
    useState<boolean>(false);
  const [showRestrictedAreasInfo, setShowRestrictedAreasInfo] = useState(false);
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
  const { getRestrictedAreas } = RestrictionService();
  const [clickCount, setClickCount] = useState(1);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [messages, setMessages] = useState<{ text: string; address: string }[]>(
    [],
  );

  const determineGeoHash = (lng: number, lat: number): string => {
    // UK coordinates range
    if (lng >= -10 && lng <= 2 && lat >= 50 && lat <= 60) {
      return "gcp"; // Example geoHash for the UK
    }
    // US coordinates range
    if (lng >= -125 && lng <= -65 && lat >= 24 && lat <= 49) {
      return "9yw"; // Example geoHash for the US
    }

    // Default: No valid geoHash found
    return "";
  };

  const getAddressFromCoordinates = async (
    longitude: number,
    latitude: number,
  ) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        {
          params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_KEY,
          },
        },
      );

      if (response.data.features && response.data.features.length > 0) {
        return response.data.features[0].place_name;
      }
      return "No address found";
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  };

  const fetchRestrictedAreas = async (geoHash: string) => {
    if (!map || !geoHash) return;
    const restrictedAreas = await getRestrictedAreas(geoHash);

    // Create GeoJSON data
    const geoJsonData: FeatureCollection<
      Polygon | MultiPolygon,
      GeoJsonProperties
    > = {
      type: "FeatureCollection",
      features:
        restrictedAreas?.map(
          (area): Feature<Polygon | MultiPolygon, GeoJsonProperties> => {
            let geometry: Polygon | MultiPolygon;

            if (area.region.type === "Polygon") {
              geometry = {
                type: "Polygon",
                coordinates: area.region.coordinates as Position[][],
              };
            } else if (area.region.type === "MultiPolygon") {
              geometry = {
                type: "MultiPolygon",
                coordinates: area.region
                  .coordinates as unknown as Position[][][],
              };
            } else {
              throw new Error(`Unsupported geometry type: ${area.region.type}`);
            }

            return {
              type: "Feature",
              properties: {
                message: area.message,
                address: area.address,
              },
              geometry,
            };
          },
        ) || [],
    };
    if (map.getSource("restricted-areas")) {
      (map.getSource("restricted-areas") as mapboxgl.GeoJSONSource).setData(
        geoJsonData,
      );
    } else {
      map.addSource("restricted-areas", { type: "geojson", data: geoJsonData });
      map.addLayer({
        id: "restricted-areas-layer",
        type: "fill",
        source: "restricted-areas",
        paint: { "fill-color": "#D20C0C", "fill-opacity": 0.2 },
      });
      map.on("click", "restricted-areas-layer", async (e) => {
        const feature = e.features?.[0];
        if (feature) {
          const { geometry, properties } = feature;

          if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
            let coordinates;
            if (geometry.type === "Polygon") {
              coordinates = geometry.coordinates[0];
            } else {
              coordinates = geometry.coordinates[0][0];
            }
            if (Array.isArray(coordinates) && coordinates.length >= 1) {
              const [longitude, latitude] = coordinates[0];
              const address = await getAddressFromCoordinates(
                longitude,
                latitude,
              );
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  text: properties?.message ?? "No message available",
                  address,
                },
              ]);
              setIsButtonVisible(true);
            }
          }
        }
      });
    }
  };
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;
    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-104.718243, 40.413869],
      zoom: 5,
    });

    newMap.on("load", async function () {
      const mapCenter = newMap.getCenter();
      const geoHash = determineGeoHash(mapCenter.lng, mapCenter.lat);

      if (geoHash && showRestrictedAreas) {
        await fetchRestrictedAreas(geoHash);
      }

      newMap.zoomOut({ duration: 4 });
      newMap.dragRotate.disable();

      let timeoutId;
      newMap.on("move", async (e) => {
        setLoadingRegAddresses(true);
        clearTimeout(timeoutId);

        timeoutId = setTimeout(async () => {
          const crds = e.target.getBounds();
          const mapCenter = e.target.getCenter();
          const geoHash = determineGeoHash(mapCenter.lng, mapCenter.lat);

          if (geoHash && showRestrictedAreas) {
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

    newMap.on("render", () => newMap.resize());
    setMap(newMap);

    return () => newMap.remove();
  }, []);

  useEffect(() => {
    const updateMarkersAndRestrictedAreas = async () => {
      if (!map) return;

      const geoHash = determineGeoHash(
        map.getCenter().lng,
        map.getCenter().lat,
      );

      // Fetch and show restricted areas
      if (showRestrictedAreas && geoHash) {
        await fetchRestrictedAreas(geoHash);
      } else if (!showRestrictedAreas) {
        if (map.getLayer("restricted-areas-layer")) {
          map.removeLayer("restricted-areas-layer");
        }
        if (map.getSource("restricted-areas")) {
          map.removeSource("restricted-areas");
        }
      }

      // Fetch and show markers for locations
      const bounds = map.getBounds();
      const responseData = await findPropertiesByCoordinates({
        postData: {
          minLongitude: bounds.getWest(),
          minLatitude: bounds.getSouth(),
          maxLongitude: bounds.getEast(),
          maxLatitude: bounds.getNorth(),
        },
      });

      const formattedProperties = responseData?.filter((property) => {
        return (
          property.longitude >= bounds.getWest() &&
          property.longitude <= bounds.getEast() &&
          property.latitude >= bounds.getSouth() &&
          property.latitude <= bounds.getNorth()
        );
      });

      setRegisteredAddress(formattedProperties || []);
      setLoadingRegAddresses(false);

      formattedProperties?.forEach((property) => {
        const marker = new mapboxgl.Marker({ color: "#3FB1CE" })
          .setLngLat([property.longitude, property.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${property.address}</strong>`,
            ),
          )
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setRentData(property);
          setShowClaimModal(true);
        });
      });
    };

    updateMarkersAndRestrictedAreas();
  }, [map, showRestrictedAreas]);

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
        Sentry.captureException(error);
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
            <MapButtons
              showRestrictedAreas={showRestrictedAreas}
              setShowRestrictedAreas={setShowRestrictedAreas}
              isButtonVisible={isButtonVisible}
              setIsButtonVisible={setIsButtonVisible}
              setClickCount={setClickCount}
              setShowRestrictedAreasInfo={setShowRestrictedAreasInfo}
              messages={messages}
            />

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
            <RestrictedAreaInfo
              showRestrictedAreasInfo={showRestrictedAreasInfo}
              setShowRestrictedAreasInfo={setShowRestrictedAreasInfo}
              messages={messages}
            />

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
