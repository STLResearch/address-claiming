import { Fragment, useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";
import maplibregl from "maplibre-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MagnifyingGlassIcon } from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import DroneSVGComponent from "@/Components/Modals/DroneSVGComponent";
import { ArrowLeftIcon } from "@/Components/Icons";
import {
  RadarZoomOutIcon,
  RadarLocationIcon,
  RadarZoomInIcon,
  RadarLayerIcon,
} from "@/Components/Icons";
import { useMobile } from "@/hooks/useMobile";
import axios from "axios";
import Head from "next/head";
import RadarTooltip from "@/Components/Tooltip/RadarTooltip";
import DroneMobileBottomBar from "@/Components/Modals/DroneMobileBottomBar";
import RadarModal from "@/Components/Modals/RadarModal";
import io from "socket.io-client";
import { useRouter } from "next/router";
const Explorer = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  flyToAddress,
  setSatelliteView,
  handleZoomIn,
  handleZoomOut,
  flyToUserIpAddress,
}) => {
  return (
    <div className="absolute  right-0 z-20 rounded-[8px]  w-[50%] h-[10%] mt-4">
      <div className=" w-full flex justify-end p-2">
        <div
          className=" flex p-4  justify-center w-[70%] h-[10%]  rounded-[10px]   gap-[15px] z-20 bg-[#FFFFFFCC] "
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div
            className="relative w-full flex items-center rounded-lg bg-white px-[10px] py-[10px]"
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
            <div className=" h-[17px] w-[17px]">
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
          <div className="flex gap-3">
            <button onClick={() => flyToUserIpAddress(map)}>
              <RadarLocationIcon />
            </button>
            <button onClick={() => setSatelliteView()}>
              <RadarLayerIcon />
            </button>

            <button onClick={handleZoomIn}>
              <RadarZoomInIcon />
            </button>
            <button onClick={handleZoomOut}>
              <RadarZoomOutIcon />
            </button>
          </div>
        </div>
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
          placeholder="Search Location"
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

const Radar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const { isMobile } = useMobile();
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [address, setAddress] = useState("");
  const [addressData, setAddressData] = useState();
  const [addresses, setAddresses] = useState([]);
  const [flyToAddress, setFlyToAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    longitude: "",
    latitude: "",
  });
  const [marker, setMarker] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [mobileBottomDroneDetailVisible, setMobileBottomDroneDetailVisible] =
    useState(false);
  const [showDroneDetail, setShowDroneDetail] = useState(false);
  const [DroneDataDetailSelected, setDroneDataSelected] = useState(null);
  const [isAllPopupClosed, setIsAllPopupClosed] = useState(false);
  const [isDroneSVGColor, setIsDroneSVGColor] = useState({});
  const [isDroneHoverSVGColor, setIsDroneHoverSVGColor] = useState({});
  const [droneMarker, setDroneMarker] = useState();
  const [droneMarkerArray, setDroneMarkerArray] = useState({});
  const [droneSocketDatas, setSocketDatas] = useState();
  const [droneId, setDroneId] = useState();
  const [boundingBox, setBoundingBox] = useState({
    minLatitude: 17.555484669042485,
    maxLatitude: 55.242651682301556,
    minLongitude: -41.90240522562678,
    maxLongitude: 38.82041496478121,
  });
  const router = useRouter();
  const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

  useEffect(() => {
    setShowMobileMap(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (map) return;
    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
      var newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 40],
        zoom: 6,
      });

      newMap.addControl(new mapboxgl.NavigationControl());

      var nav = new mapboxgl.NavigationControl();
      newMap.addControl(nav, "top-right");
      newMap.on("load", () => {
        setMap(newMap);
      });
    };
    createMap();
  }, [map]);
  useEffect(() => {
    if (!map) return;
    map.on("moveend", function () {
      var bounds = map.getBounds();
      let boundingBoxTemp = {
        minLatitude: bounds.getSouth(),
        maxLatitude: bounds.getNorth(),
        minLongitude: bounds.getWest(),
        maxLongitude: bounds.getEast(),
      };
      setBoundingBox(boundingBoxTemp);
    });
    const socket = io(SOCKET_SERVER_URL);
    socket.on("boundingBoxResponse", (data) => {
      setSocketDatas(data);
    });
    socket.on("droneIdResponse", (data) => {
      setDroneDataSelected(data);
    });

    if (boundingBox != undefined) {
      socket.emit("sendMessageByBoundingBox", boundingBox);
    }
    if (droneId) {
      socket.emit("sendMessageByDroneId", droneId);
    }
    return () => {
      socket.disconnect();
    };
  }, [map, boundingBox, droneId]);

  useEffect(() => {
    if(!map)return;
    if (DroneDataDetailSelected) {
      const dronePath =
        DroneDataDetailSelected?.remoteData?.location?.flightPath;
      const swappedCoordinates = dronePath.map((coord) => [coord[1], coord[0]]);
      if (map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }
      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: swappedCoordinates,
              type: "LineString",
            },
          },
        ],
      };

      map.addSource("route", {
        type: "geojson",
        lineMetrics: true,
        data: geojson,
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#F43E0D",
          "line-width": 1.5,
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "#F79663",
            1,
            "#F43E0D",
          ],
        },
      });
    }
  }, [DroneDataDetailSelected,map]);

  function setSatelliteView() {
    if (map && map?.getStyle().name === "Mapbox Streets") {
      map?.setStyle("mapbox://styles/mapbox/satellite-v9");
    } else {
      map?.setStyle("mapbox://styles/mapbox/streets-v12");
    }
  }

  useEffect(() => {
    if (!map) return;

    const addDroneMarkers = (droneData) => {
      droneData?.forEach((data, index) => {
        const { id } = data;
        const latitude = data?.remoteData?.location?.latitude;
        const longitude = data?.remoteData?.location?.longitude;
        const markerElement = document.createElement("div");
        markerElement.classList.add(`drone-marker-${index}`);

        const droneColor = isDroneSVGColor[index]
          ? "#FF3D00"
          : isDroneHoverSVGColor[index]
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
          marker = new mapboxgl.Marker({
            element: markerElement,
            draggable: false,
          })
            .setLngLat([longitude, latitude])
            .addTo(map);

          setDroneMarkerArray({ [index]: marker });
        } else {
          marker = droneMarkerArray[index];

          const elements = document.getElementsByClassName(
            `drone-marker-${index}`
          );
          Array.from(elements).forEach((element) => element.remove());

          marker = new mapboxgl.Marker({
            element: markerElement,
            draggable: false,
          })
            .setLngLat([longitude, latitude])
            .addTo(map);

          setDroneMarkerArray({ [index]: marker });
        }

        const showPopup = () => {
          const elementToRemove = document.querySelector(
            ".popup-clicked-class"
          );
          if (elementToRemove) elementToRemove.remove();

          const tooltipContent = ReactDOMServer.renderToString(
            <RadarTooltip content={id} />
          );
          new mapboxgl.Popup({
            closeOnClick: false,
            offset: [0, -20],
            className: "popup-clicked-class",
          })
            .setLngLat(marker.getLngLat())
            .setHTML(tooltipContent)
            .addTo(map);
        };

        if (!isMobile) {
          const handleMouseEnter = () => {
            const tooltipContent = ReactDOMServer.renderToString(
              <RadarTooltip content={id} />
            );
            const elementToRemove = document.querySelector(
              ".popup-hovered-class"
            );
            if (elementToRemove) elementToRemove.remove();
            new mapboxgl.Popup({
              closeOnClick: false,
              className: "popup-hovered-class",
              offset: [0, -20],
            })
              .setLngLat(marker.getLngLat())
              .setHTML(tooltipContent)
              .addTo(map);
            setIsDroneHoverSVGColor({ [index]: true });
          };

          const handleMouseLeave = () => {
            const elementToRemove = document.querySelector(
              ".popup-hovered-class"
            );
            if (elementToRemove) elementToRemove.remove();
            setIsDroneHoverSVGColor({ [index]: false });
          };

          const handleClick = () => {
            setIsDroneSVGColor({ [index]: true });
            setIsAllPopupClosed(false);
            showPopup();
            setDroneId(data?.remoteData?.macAddress);
            setShowDroneDetail(true);
          };

          markerElement.addEventListener("click", handleClick);
          markerElement.addEventListener("mouseenter", handleMouseEnter);
          markerElement.addEventListener("mouseleave", handleMouseLeave);
        }

        if (isMobile) {
          markerElement.addEventListener("touchend", (e) => {
            e.preventDefault();
            setIsAllPopupClosed(false);
            setIsDroneSVGColor({ [index]: true });
            showPopup();
            setDroneId(data?.remoteData?.macAddress);
            setMobileBottomDroneDetailVisible(true);
          });
        }
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

  const closePopups = () => {
    const elementToRemove = document.querySelector(".popup-clicked-class");
    if (elementToRemove) elementToRemove.remove();
    const elementHoverToRemove = document.querySelector(".popup-hovered-class");
    if (elementHoverToRemove) elementHoverToRemove.remove();
  };

  useEffect(() => {
    if (isAllPopupClosed) {
      closePopups();
      setIsDroneSVGColor({});
      setIsDroneHoverSVGColor({});
      setDroneDataSelected(null);
      setDroneId(null);
      if (map && map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }
    }
  }, [isAllPopupClosed]);

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom + 1);
    }
  };
  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom - 1);
    }
  };

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
  }, [flyToAddress, address]);

  const handleSelectAddress = (placeName) => {
    setAddress(placeName);
    setFlyToAddress(placeName);
    setShowOptions(false);
  };

  const flyToUserIpAddress = async () => {
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

      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]">
        {!showMobileMap && <Sidebar />}
        <div className="flex h-full w-full flex-col">
          {!showMobileMap && <PageHeader pageTitle={"Radar"} />}
          {showMobileMap && (
            <ExplorerMobile
              onGoBack={handleGoBack}
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
                opacity: "1",
                zIndex: "20",
              }}
            />
            {!isMobile && (
              <div className="flex items-start justify-start">
                <Explorer
                  flyToAddress={flyToAddress}
                  address={address}
                  setAddress={setAddress}
                  addresses={addresses}
                  showOptions={showOptions}
                  handleSelectAddress={handleSelectAddress}
                  setSatelliteView={setSatelliteView}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  flyToUserIpAddress={flyToUserIpAddress}
                />
              </div>
            )}

            {isMobile && (
              <div className="flex flex-col z-[40]   rounded-[10px] gap-[15px] bg-white px-[21px] py-[19px] m-4 ml-auto">
                <button onClick={() => flyToUserIpAddress(map)}>
                  <RadarLocationIcon />
                </button>
                <button onClick={() => setSatelliteView()}>
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
            {isMobile && mobileBottomDroneDetailVisible && (
              <DroneMobileBottomBar
                DroneDataDetailSelected={DroneDataDetailSelected}
                onActivate={handleShowDetailFullMobile}
              />
            )}

            {showDroneDetail && (
              <RadarModal
                onClose={() => {
                  setShowDroneDetail(false);
                  setIsAllPopupClosed(true);
                }}
                DroneDataDetailSelected={DroneDataDetailSelected}
              />
            )}
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Radar;
