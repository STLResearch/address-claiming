import { Fragment, useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";
import maplibregl from "maplibre-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { MagnifyingGlassIcon } from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import { DroneIconRadar } from "@/Components/Icons";
import { ArrowLeftIcon } from "@/Components/Icons";
import { useMobile } from "@/hooks/useMobile";
import axios from "axios";
import Head from "next/head";
import RadarTooltip from "@/Components/Tooltip/RadarTooltip";
import Image from "next/image";

const Explorer = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  flyToAddress,
}) => {
  return (
    <div
      className="absolute right-0 top-0 z-20 mt-[13px] ml-[18px] max-h-full max-w-[362px] flex-col items-center rounded-[8px] bg-[#FFFFFFCC] px-[10px] py-[10px] md:flex"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div
        className="relative w-full rounded-lg bg-white px-[10px] py-[10px]"
        style={{ border: "1px solid rgb(135, 135, 141,0.3)" }}
      >
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchLocation"
          id="searchLocation"
          placeholder="Search location"
          className="w-full pr-[20px] outline-none"
        />
        <div className="absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2">
          <MagnifyingGlassIcon />
        </div>
        {showOptions && (
          <div className="absolute left-0 top-[55px] w-full flex-col bg-white">
            {addresses.map((item) => {
              return (
                <div
                  key={item.id}
                  value={item.place_name}
                  onClick={() => handleSelectAddress(item.place_name)}
                  className="w-full p-5 text-left text-[#222222]"
                  style={{
                    borderTop: "0.2px solid #222222",
                  }}
                >
                  {item.place_name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const ExplorerMobile = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  flyToAddress,
  onGoBack,
}) => {
  return (
    <div className="z-[40] flex items-center gap-[15px] bg-white px-[21px] py-[19px]">
      <div
        onClick={onGoBack}
        className="flex h-6 w-6 items-center justify-center"
      >
        <ArrowLeftIcon />
      </div>
      <div
        className="relative w-full rounded-lg bg-white px-[22px] py-[16px]"
        style={{ border: "1px solid #87878D" }}
      >
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchLocation"
          id="searchLocation"
          placeholder="Search Airspaces"
          className="w-full pr-[20px] outline-none"
        />
        <div className="absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2">
          <MagnifyingGlassIcon />
        </div>
        {showOptions && (
          <div className="absolute left-0 top-[55px] w-full flex-col bg-white">
            {addresses.map((item) => {
              return (
                <div
                  key={item.id}
                  value={item.place_name}
                  onClick={() => handleSelectAddress(item.place_name)}
                  className="w-full p-5 text-left text-[#222222]"
                  style={{
                    borderTop: "0.2px solid #222222",
                  }}
                >
                  {item.place_name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const RadarModal = () => {
  return (
    <div className=" w-[362px] z-20 m-[39px] hidden max-h-full max-w-[362px] flex-col  gap-[15px] rounded-[30px] bg-[#FFFFFFCC] px-[10px] py-[10px] md:flex">
      <div className=" flex justify-end">
        <Image src="/images/Clear.png" alt="star icon" width={24} height={24} />
      </div>
      <div className="flex justify-center items-center gap-[10px]   h-[30px] border">
        <Image src="/images/drone.png" alt="star icon" width={24} height={24} />
        <h1 className="text-[20px] font-[500]">Drone ABC</h1>
      </div>
     <div>
     <p className="text-[14px]  text-[#4285F4] font-[600] leading-[2rem]">CONNECTION</p>
     <p className="text-[14px]  text-[#4285F4] font-[600]">CONNECTION</p>
     <div className="border-t-2"></div>
     <div>
      <p>RSSI <span>-40 dBm Beacon</span></p>
      <p>MAC <span>04:33:c2:67:1:45</span></p>
      <p>Started <span>05:01 ago</span></p>
      <p>Last seen <span>0:01 ago</span></p>
      <p>Msg <span>2.6s</span></p>
      <p>Distance <span>68m</span></p>
     </div>
     </div>
    </div>
  );
};

const Radar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  const [map, setMap] = useState(null);
  const { isMobile } = useMobile();
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  // variables
  const [address, setAddress] = useState("");
  const [addressData, setAddressData] = useState();
  const [addresses, setAddresses] = useState([]);
  const [flyToAddress, setFlyToAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    longitude: "",
    latitude: "",
  });
  const [marker, setMarker] = useState();

  // showing
  const [showOptions, setShowOptions] = useState(false);
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);
  const [showFailurePopUp, setShowFailurePopUp] = useState(false);

  useEffect(() => {
    if (map) return;

    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 0],
        zoom: 5,
      });
      const draw = new MapboxDraw({ displayControlsDefault: true });
      newMap.addControl(draw, "top-right");

      // newMap.on('draw.create', updateArea);
      // newMap.on('draw.delete', updateArea)

      // Add drone markers
      const addDroneMarkers = (droneData) => {
        droneData.forEach((data) => {
          const { id, name, latitude, longitude } = data;
          const markerElement = document.createElement("div");
          markerElement.innerHTML = renderToStaticMarkup(
            <DroneIconRadar isActive={true} />
          );
          const marker = new mapboxgl.Marker({
            element: markerElement,
            draggable: false,
          })
            .setLngLat([longitude, latitude])
            .addTo(newMap);

          // Add popup when marker is clicked
          marker.getElement().addEventListener("click", () => {
            // Simulate fetching detailed information from backend
            fetchDroneDetails(id);
          });
          let tooltip;
          marker.getElement().addEventListener("mouseenter", () => {
            const tooltipContent = ReactDOMServer.renderToString(
              <RadarTooltip content={data?.name} />
            );
            tooltip = new mapboxgl.Popup({
              closeButton: false,
              className: "custom-popup-style",
            })
              .setLngLat(marker.getLngLat())
              .setHTML(tooltipContent)
              .addTo(newMap);
          });

          // Remove tooltip when mouse leaves marker
          marker.getElement().addEventListener("mouseleave", () => {
            if (tooltip) {
              tooltip.remove(); // Check if tooltip exists before attempting to remove
            }
          });
        });
      };

      // Simulate receiving drone data
      const mockDroneData = [
        { id: 1, name: "Drone 1", latitude: 41.386405, longitude: 2.170048 }, // Barcelona
        { id: 2, name: "Drone 2", latitude: 40.416775, longitude: -3.70379 }, // Madrid
        { id: 3, name: "Drone 3", latitude: 37.389092, longitude: -5.984459 }, // Seville
        { id: 4, name: "Drone 4", latitude: 43.362343, longitude: -8.41154 }, // La Coruña
        { id: 5, name: "Drone 5", latitude: 28.123545, longitude: -15.436257 }, // Las Palmas de Gran Canaria
        // Add more mock drone data as needed
      ];

      // addDroneMarkers(mockDroneData);

      setMap(newMap);
    };

    createMap();
  }, []);

  useEffect(() => {
    if (!showOptions) setShowOptions(true);
    if (!address) return setShowOptions(false);

    let timeoutId;

    const getAddresses = async () => {
      setCoordinates({ longitude: "", latitude: "" });

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
          console.log(error);
        }
      }, 500);
    };

    getAddresses();

    return () => clearTimeout(timeoutId);
  }, [address]);

  useEffect(() => {
    if (!flyToAddress) return;

    const goToAddress = async () => {
      try {
        setIsLoading(true);

        const mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${flyToAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

        const response = await fetch(mapBoxGeocodingUrl);

        if (!response.ok)
          throw new Error("Error while getting new address location");

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
          throw new Error("Address not found");
        }

        const coordinates = data.features[0].geometry.coordinates;
        const endPoint = [coordinates[0], coordinates[1]];

        setCoordinates({ longitude: coordinates[0], latitude: coordinates[1] });
        setAddressData(data.features[0].properties);
        setIsLoading(false);

        map.flyTo({
          center: endPoint,
          zoom: 16,
        });

        if (marker) {
          marker.remove();
        }

        let el = document.createElement("div");
        el.id = "markerWithExternalCss";

        // Add the new marker to the map and update the marker state
        const newMarker = new maplibregl.Marker(el)
          .setLngLat(endPoint)
          .addTo(map);
        setMarker(newMarker);
      } catch (error) {
        setIsLoading(false);
        console.error(err);
      }
    };

    goToAddress();
  }, [flyToAddress, map]);

  useEffect(() => {
    if (flyToAddress === address) setShowOptions(false);
    if (flyToAddress) setData((prev) => ({ ...prev, address: flyToAddress }));
  }, [flyToAddress, address]);

  useEffect(() => {
    if (!showSuccessPopUp) return;
    const timeoutId = setTimeout(() => {
      setShowSuccessPopUp(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [showSuccessPopUp]);

  useEffect(() => {
    if (!showFailurePopUp) return;
    const timeoutId = setTimeout(() => {
      setShowFailurePopUp(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [showFailurePopUp]);

  const handleSelectAddress = (placeName) => {
    setAddress(placeName);
    setFlyToAddress(placeName);
    setShowOptions(false);
  };

  const flyToUserIpAddress = async (map) => {
    if (!map) {
      return;
    }
    try {
      const ipResponse = await axios.get("https://api.ipify.org/?format=json");
      const ipAddress = ipResponse.data.ip;
      const ipGeolocationApiUrl = await axios.get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION}&ip=${ipAddress}`
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Radar</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]">
        {!showMobileMap && <Sidebar />}
        <div className="flex h-full w-full flex-col">
          {!showMobileMap && <PageHeader pageTitle={"Radar"} />}
          {showMobileMap && isMobile && (
            <ExplorerMobile
              onGoBack={() => setShowMobileMap(false)}
              flyToAddress={flyToAddress}
              address={address}
              setAddress={setAddress}
              addresses={addresses}
              showOptions={showOptions}
              handleSelectAddress={handleSelectAddress}
            />
          )}
          <section
            className={`relative flex h-full w-full items-start justify-start md:mb-0 ${showMobileMap ? "" : "mb-[79px]"}`}
          >
            <div
              className={`!absolute !left-0 !top-0 !m-0 !h-screen !w-full`}
              id="map"
              style={{
                opacity: !isMobile ? "1" : showMobileMap ? "1" : "0",
                zIndex: !isMobile ? "20" : showMobileMap ? "20" : "-20",
              }}
            />
            {/* {isMobile && showMobileMap && flyToAddress && (
              <div
                onClick={() =>{ setShowClaimModal(true);setIsLoading(true)}}
                className="absolute bottom-2 left-1/2 z-[25] w-[90%] -translate-x-1/2 cursor-pointer rounded-lg bg-[#0653EA] py-[16px] text-center text-[15px] font-normal text-white"
              >
                Claim Airspace test 2
              </div>
            )} */}

            {/* {!isMobile && (
              <div className="flex items-start justify-start">
                <Explorer
                  flyToAddress={flyToAddress}
                  address={address}
                  setAddress={setAddress}
                  addresses={addresses}
                  showOptions={showOptions}
                  handleSelectAddress={handleSelectAddress}
                />
              </div>
            )} */}
            {!isMobile && <RadarModal />}

            {!showMobileMap && (
              <div className="flex h-full w-full flex-col md:hidden">
                <div
                  onClick={() => setShowMobileMap(true)}
                  className="flex w-full flex-col justify-between gap-[184px] bg-cover bg-center bg-no-repeat p-[17px]"
                  style={{ backgroundImage: "url('/images/map-bg.png')" }}
                ></div>
              </div>
            )}
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Radar;
