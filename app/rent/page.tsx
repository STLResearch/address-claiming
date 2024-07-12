"use client";
import { Fragment, useState, useEffect, useRef } from "react";
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
import { getAddresses, goToAddress } from "@/utils/apiUtils/apiFunctions";
import { Coordinates, PropertyData } from "@/types";
import Sidebar from "@/Components/Shared/Sidebar";
import PropertiesService from "../../services/PropertiesService";
import { handleMouseEvent } from "@/utils/eventHandlerUtils/eventHandlers";
import supercluster from "supercluster";
import { toast } from "react-toastify";
import debounce from 'lodash.debounce';

const Rent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [loadingRegAddresses, setLoadingRegAddresses] =
    useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);
  const { isMobile } = useMobile();
  const [registeredAddress, setRegisteredAddress] = useState<PropertyData[]>(
    []
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
  const [showRentDetail, setShowRentDetail] = useState<boolean>(false);
  const [showRentPreview, setShowRentPreview] = useState<boolean>(false);
  const [rentDetailData, setRentDetailData] = useState();
  const [zoom, setZoom] = useState(5);
  const clusterIndex = useRef(new supercluster({ radius: 40, maxZoom: 16 }));
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const clustersRef = useRef<mapboxgl.Marker[]>([]);

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
        // attributionControl: false
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
      setMap(newMap);
    };
    createMap();
  }, [map]);


  const handleMapMove = async () => {
    if(!map)return;
    setLoadingRegAddresses(true);
    const crds = map.getBounds();
    console.log('here reached!');
    const responseData = await findPropertiesByCoordinates({
      postData: {
        minLongitude: crds._sw.lng,
        minLatitude: crds._sw.lat,
        maxLongitude: crds._ne.lng,
        maxLatitude: crds._ne.lat,
      },
    });
    if (responseData) {
      const formattedProperties = responseData.filter((property) => {
        return (
          property.longitude >= crds._sw.lng &&
          property.longitude <= crds._ne.lng &&
          property.latitude >= crds._sw.lat &&
          property.latitude <= crds._ne.lat
        );
      });

      setRegisteredAddress(formattedProperties);
      setLoadingRegAddresses(false);
      if (map.getZoom() < 8) {
        updateMarkers(map, formattedProperties);
      } else {
        drawMarkers(map, formattedProperties);
      }
    }
  };
  const debouncedHandleMapMove = debounce(handleMapMove, 500);

  
  const onIdle = () => {
    debouncedHandleMapMove();
  };
  useEffect(() => {
    if (!map) return;
    // let idle = false;
    // let moveend = false;
    // if(moveend && idle){
    //   onIdle()
    // }

    // map.on("idle", ()=>{moveend=true});
    map.on("moveend", onIdle);

    return () => {
      map.off("idle", onIdle);
      map.off("moveend", onIdle);
    };
  }, [map]);


  const updateMarkers = (newMap, responseData) => {
    clearMarkers();
    removeClusterLayers(newMap);
    if (newMap && responseData) {
      const geoJSONData = responseData.map((point) => ({
        type: "Feature",
        properties: { id: point.id },
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
      }));
      clusterIndex.current.load(geoJSONData);

      const bounds = newMap.getBounds().toArray().flat();
      const clusters = clusterIndex.current.getClusters(bounds, Math.round(zoom));

      if (newMap.getSource("markers")) {
        (newMap.getSource("markers") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: clusters,
        });
      } else {
        newMap.addSource("markers", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: clusters,
          },
        });

        newMap.addLayer({
          id: "clusters",
          type: "circle",
          source: "markers",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#00AEEF",
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              37,
              50,
              52,
              100,
              72,
              550,
              82,
              900,
              124,
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        newMap.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "markers",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#fff",
          },
        });
      }
    }
  };

  const drawMarkers = (newMap, responseData) => {
    clearMarkers();
    removeClusterLayers(newMap);

    if (responseData.length > 0 && newMap.getZoom() >= 8) {
      for (let i = 0; i < responseData.length; i++) {
        const lngLat = new mapboxgl.LngLat(
          responseData[i].longitude,
          responseData[i].latitude
        );

        const marker = new mapboxgl.Marker({
          color: "#3FB1CE",
        })
          .setLngLat(lngLat)
          .addTo(newMap);

        markersRef.current.push(marker);

        const markerElement = marker.getElement();
        handleMouseEvent(
          isMobile,
          markerElement,
          marker,
          newMap,
          responseData[i]
        );

        marker.getElement().addEventListener('click', function () {
          setRentData(responseData[i]);
          setShowClaimModal(true);
        });
      }
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };
  const removeClusterLayers = (newMap) => {
    if (newMap.getLayer('clusters')) {
      newMap.removeLayer('clusters');
    }
    if (newMap.getLayer('cluster-count')) {
      newMap.removeLayer('cluster-count');
    }
    if (newMap.getSource('markers')) {
      newMap.removeSource('markers');
    }
  };
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

    let timeoutId: NodeJS.Timeout | null = null;
    getAddresses(
      setAddresses,
      setCoordinates,
      setLoadingAddresses,
      timeoutId,
      address
    );
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
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
      marker
    );
  }, [flyToAddress, map]);

  useEffect(() => {
    if (flyToAddress === address) setShowOptions(false);
  }, [flyToAddress, address]);

  useEffect(() => {
    const inintialRentDataString = localStorage.getItem("rentData");
    const parsedInitialRentData = inintialRentDataString
      ? JSON.parse(inintialRentDataString)
      : null;
    if (parsedInitialRentData && parsedInitialRentData?.address?.length > 2) {
      setRentData(parsedInitialRentData);
      setFlyToAddress(parsedInitialRentData.address);
      setShowClaimModal(true);
    } else {
      console.log("no initial datta");
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Marketplace : Rent</title>
      </Head>

      {isLoading && <Backdrop onClick={() => {}} />}
      {isLoading && <Spinner />}
      {
        <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center  overflow-hidden ">
          <Sidebar />

          <div className="w-full h-full flex flex-col">
            <PageHeader pageTitle={isMobile ? "Rent" : "Marketplace: Rent"} />
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

              {!isMobile && (
                <div className="flex justify-start items-start">
                  <Explorer
                    setRentDetailData={setRentDetailData}
                    setShowRentDetail={setShowRentDetail}
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
              {/* {showRentDetail && 
              <></>
              } */}
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
