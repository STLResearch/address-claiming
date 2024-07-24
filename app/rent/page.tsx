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
import supercluster from "supercluster";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import RentPreview from "@/Components/Rent/RentPreview/RentPreview";
import RentSearchMobile from "@/Components/Rent/Explorer/RentSearchMobile";
import {
  createAndUpdateClusters,
} from "@/utils/rent/mapUtils";
import dayjs from "dayjs";

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
  const defaultValueDate = dayjs()
  .add(1, "h")
  .set("minute", 30)
  .startOf("minute");
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
  const clusterIndex = useRef(new supercluster({ radius: 250, maxZoom: 12 }));
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const clustersRef = useRef<mapboxgl.Marker[]>([]);
  const polygonsRef = useRef({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ formattedPropertyValue ,setFormattedPropertyValue] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [date, setDate] = useState(defaultValueDate);
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
    if (!map) return;
    try {
    setLoadingRegAddresses(true);
    const crds = map.getBounds();
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
        setFormattedPropertyValue(formattedProperties);
        setRegisteredAddress(formattedProperties);
        setLoadingRegAddresses(false);

          createAndUpdateClusters(
            map,
            markersRef,
            formattedProperties,
            clusterIndex,
            isMobile,
            setRentData,
            setShowClaimModal,
            map.getZoom(),
           map.getBounds().toArray().flat()

          );
          
        }
      } catch (error) {
        toast.error("please try again !");
      }finally{
        setLoadingRegAddresses(false);
      }
  };
  const debouncedHandleMapMove = debounce(handleMapMove, 500);

  useEffect(() => {
    if (!map) return;
    handleMapMove()
    // map.on("moveend", debouncedHandleMapMove);
    return () => {
      map.off("moveend", debouncedHandleMapMove);
    };
  }, [map, isMobile]);

  useEffect(() => {
    if (map) {
      const handleMapLoad = () => setMapLoaded(true);
      map.on("load", handleMapLoad);
      return () => map.off("load", handleMapLoad);
    }
  }, [map,isMobile]);

  useEffect(()=>{
    if(!map || !formattedPropertyValue || !mapLoaded){
      return;
    }
    map.on('moveend' , ()=>createAndUpdateClusters(
      map,
      markersRef,
      formattedPropertyValue,
      clusterIndex,
      isMobile,
      setRentData,
      setShowClaimModal,
      map.getZoom(),
      map.getBounds().toArray().flat()
    ))
    
  },[map,formattedPropertyValue,mapLoaded])

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
      console.log("no initial Data");
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
        <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center  overflow-clip ">
          {!isMobile && <Sidebar />}

          <div className="w-full h-full flex flex-col">
            {!isMobile && (
              <PageHeader pageTitle={isMobile ? "Rent" : "Marketplace: Rent"} />
            )}
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
              <RentSearchMobile
                searchTerm={searchTerm}
                setSearchTerm={(value: string) => setSearchTerm(value)}
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
                date={date}
                setDate={setDate}
                  setShowRentPreview={setShowRentPreview}
                  setShowClaimModal={setShowClaimModal}
                  rentData={rentData}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}
              {showRentPreview && (
                <RentPreview
                date={date}
                  setShowRentPreview={setShowRentPreview}
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
