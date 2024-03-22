import { Fragment, useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";
import maplibregl from "maplibre-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MagnifyingGlassIcon } from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import { DroneIconRadar } from "@/Components/Icons";
import { ArrowLeftIcon } from "@/Components/Icons";
import { RadarZoomOutIcon,RadarLocationIcon,RadarZoomInIcon,RadarLayerIcon } from "@/Components/Icons";
import { useMobile } from "@/hooks/useMobile";
import axios from "axios";
import Head from "next/head";
import RadarTooltip from "@/Components/Tooltip/RadarTooltip";
import DroneMobileBottomBar from "@/Components/Modals/DroneMobileBottomBar";
import RadarModal from "@/Components/Modals/RadarModal";
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

  const mockDroneData = [
    { id: 1, name: "Drone 1", latitude: 41.386405, longitude: 2.170048 }, 
    { id: 2, name: "Drone 2", latitude: 40.416775, longitude: -3.70379 }, 
    { id: 3, name: "Drone 3", latitude: 37.389092, longitude: -5.984459 },
    { id: 4, name: "Drone 4", latitude: 43.362343, longitude: -8.41154 }, 
    { id: 5, name: "Drone 5", latitude: 28.123545, longitude: -15.436257 },
  ];

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
        zoom: 3.5,
      });
      var nav = new mapboxgl.NavigationControl();
      newMap.addControl(nav, "top-right");
      newMap.on("load", () => {
        // const draw = new MapboxDraw({ displayControlsDefault: false });
        // newMap.addControl(draw, "top-right");
        setMap(newMap);
      });
    };
    createMap();
  }, [map]);

  let activePopup = null;
  let activePopupHover = null;
  let activeMarkerHover = null;
  useEffect(() => {
    if (!map) return;
    const addDroneMarkers = (droneData) => {
      let activeMarker = null;
      droneData.forEach((data) => {
        const { id, name, latitude, longitude } = data;
        const markerElement = document.createElement("div");
        markerElement.innerHTML = renderToStaticMarkup(<DroneIconRadar />);
        const marker = new mapboxgl.Marker({
          element: markerElement,
          draggable: false,
        })
          .setLngLat([longitude, latitude])
          .addTo(map);
        const showPopup = () => {
          if (activePopup) {
            activePopup.remove();
            activePopup = null;
          }

          const tooltipContent = ReactDOMServer.renderToString(
            <RadarTooltip content={name} />
          );
          activePopup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(marker.getLngLat())
            .setHTML(tooltipContent)
            .addTo(map);
        };

        if (!isMobile) {
          const handleMouseEnter = () => {
            const tooltipContent = ReactDOMServer.renderToString(
              <RadarTooltip content={name} />
            );
            if (activePopupHover) {
              activePopupHover.remove();
              activePopupHover = null;
            }
            activePopupHover = new mapboxgl.Popup({ closeOnClick: false })
              .setLngLat(marker.getLngLat())
              .setHTML(tooltipContent)
              .addTo(map);
            activeMarkerHover = markerElement.querySelectorAll("svg path");

            activeMarkerHover.forEach((path) => {
              path.setAttribute("stroke", "#FF3D00");
            });
          };
          const handleMouseLeave = () => {
            if (activePopupHover) {
              activePopupHover.remove();
              activePopupHover = null;
            }
            if(activeMarkerHover){
              activeMarkerHover.forEach((path) => {
                path.setAttribute("stroke", "#0000FF");
              });
            }
          };
          const handleClick = () => {
            activeMarkerHover = null;
            if (activeMarker) {
              let paths = activeMarker.querySelectorAll("svg path");
              paths.forEach((path) => {
                path.setAttribute("stroke", "#0000FF");
              });
            }
            activeMarker = markerElement;
            showPopup();
            setDroneDataSelected(data);
            setShowDroneDetail(true);
            let paths = markerElement.querySelectorAll("svg path");

            paths.forEach((path) => {
              path.setAttribute("stroke", "#FF3D00");
            });
          };
          marker.getElement().addEventListener("click", handleClick);

          if (!showDroneDetail) {
            activeMarker = null;
            marker
              .getElement()
              .addEventListener("mouseenter", handleMouseEnter);
            marker
              .getElement()
              .addEventListener("mouseleave", handleMouseLeave);
          }
        }
        if (isMobile) {
          marker.getElement().addEventListener("touchend", (e) => {
            e.preventDefault();
            if (activeMarker) {
              let paths = activeMarker.querySelectorAll("svg path");
              paths.forEach((path) => {
                path.setAttribute("stroke", "#0000FF");
              });
            }
            activeMarker = markerElement;
            showPopup();
            setDroneDataSelected(data);
            setMobileBottomDroneDetailVisible(true);
            const paths = markerElement.querySelectorAll("svg path");
            paths.forEach((path) => {
              path.setAttribute("stroke", "#FF3D00");
            });
          });
        }
      });
    };
    const closePopups = () => {
      if (activePopup) {
        activePopup.remove();
        activePopup = null;
      }
    };

    addDroneMarkers(mockDroneData);
    return () => {
      map.off("click", closePopups); 
    };
  }, [map, isMobile]);

  const handleZoomIn = () => {
    if(map){
      const currentZoom = map.getZoom()
      map.setZoom(currentZoom + 1)    
      console.log(currentZoom, "map.getZoom")
    }
  }
  const handleZoomOut = () => {
    if(map){
      const currentZoom = map.getZoom()
      map.setZoom(currentZoom - 1)
      console.log(currentZoom, "map.getZoom")
    }
  }
 
  const Layer = () => {
    map.addLayer({
      id: "water",
      type: "circle",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [],
          },
        },
      },
      layout: {},
      paint: {
        "fill-color": "#00ffff",
        "line-width":3
      },
    });
   
}


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
    // if (flyToAddress) setData((prev) => ({ ...prev, address: flyToAddress }));
  }, [flyToAddress, address]);

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
  useEffect(() => {
  }, [showDroneDetail, mobileBottomDroneDetailVisible]);
  const handleShowDetailFullMobile = () => {
    setMobileBottomDroneDetailVisible(false);
    setShowDroneDetail(true);
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
                />
              </div>
            )} 

            <div className="relative w-full h-full  ">
                    <div
                      className="  justify-center  w-[10%]  h-[10%] absolute top-0 right-0   hidden md:flex bg-[#FFFFFFCC]  rounded-[8px] mt-4 mr-5  items-center gap-[10px] z-20 "
                      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
                    >
                    <RadarLocationIcon />
                   <button onClick={() => { console.log("Button clicked"); Layer(map);}}>
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
