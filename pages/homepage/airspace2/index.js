import { Fragment, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import maplibregl from "maplibre-gl";
import Script from "next/script";
import { InfoIcon, MagnifyingGlassIcon } from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import {
  HelpQuestionIcon,
  ArrowLeftIcon,
  CloseIcon,
  LocationPointIcon,
  SuccessIcon,
  FailureIcon,
  EarthIcon,
} from "@/Components/Icons";
import useDatabase from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import Link from "next/link";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import axios from "axios";
import Head from "next/head";
import EditAddAirspaceModal from '@/Components/Modals/EditAddAirspaceModal'
import PopUp from '@/Components/PopUp/PopUp'


const Explorer = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  onClaimAirspace,
  flyToAddress,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  return (
    <div
      className="z-20 m-[39px] hidden max-h-full max-w-[362px] flex-col items-center gap-[15px] rounded-[30px] bg-[#FFFFFFCC] px-[29px] py-[43px] md:flex"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex items-center gap-[5px]">
        <p className="text-xl font-medium text-[#222222]">Claim Airspace</p>
        <div
          onClick={() => setIsInfoVisible((prev) => !prev)}
          className="relative flex h-[20px] w-[20px] items-center justify-center"
        >
          <InfoIcon />
          {isInfoVisible && (
            <div className="absolute -top-4 left-6 w-[189px] rounded-[4px] bg-[#CCE3FC] p-[12px] text-[10px] font-normal italic">
              Note that we store your data securely with advanced encryption and
              strict authentication measures to ensure utmost privacy and
              protection.
            </div>
          )}
        </div>
      </div>
      <p className="text-[15px] font-normal text-[#222222]">
        Ready to claim your airspace? No registered airspace yet, but exciting
        times ahead!
      </p>
      <div
        className="relative w-full rounded-lg bg-white px-[22px] py-[16px]"
        style={{ border: "1px solid #87878D" }}
      >
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchAirspaces"
          id="searchAirspaces"
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
      {flyToAddress && (
        <div
          onClick={onClaimAirspace}
          className="w-full cursor-pointer rounded-lg bg-[#0653EA] py-[16px] text-center text-[15px] font-normal text-white"
        >
          Claim Airspace
        </div>
      )}
      
    </div>
  );
};

const ExplorerMobile = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  onClaimAirspace,
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
          name="searchAirspaces"
          id="searchAirspaces"
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

const Slider = () => {
  const [isFullyVisible, setIsFullyVisible] = useState(false);

    return (
        <div onClick={() => setIsFullyVisible(prev => !prev)} className={`cursor-pointer rounded-t-[30px] absolute ${isFullyVisible ? 'bottom-0' : '-bottom-[600px]'} right-6 flex flex-col items-center gap-[34px] py-[43px] px-[23px] bg-white max-w-[362px] duration-5000 z-20`}>
            <div className="flex items-center gap-[4px]">
                <div className="flex items-center justify-center w-[24px] h-[24px]"><HelpQuestionIcon /></div>
                <p className="font-medium text-xl text-[#222222] text-center">How to Claim My Airspsace?</p>
            </div>
            <div className="flex flex-col px-[6px]">
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={1}>
                    <p className="">1.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Discover Your Address</p>
                        <p>Enter your address using the map for accuracy.</p>
                    </div>
                </div>
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={2}>
                    <p className="">2.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Move the Pin If Needed</p>
                        <p>Easily adjust the location pin if Google Maps is off.</p>
                    </div>
                </div>
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={4}>
                    <p className="">3.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Claim Airspace</p>
                        <p>Click the 'Claim Airspace' button to confirm your airspace address. Your Airspace is saved. Modify your details anytime.</p>
                    </div>
                </div>
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={5}>
                    <p className="">4.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Checking the details</p>
                        <p>We confirm official records.</p>
                    </div>
                </div>
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={6}>
                    <p className="">5.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Passive income is on the way</p>
                        <p>We will update you as your account receives funds.</p>
                    </div>
                </div>
            </div>
            <div className="font-normal text-[15px] text-[#222222] text-center">Let's get started on creating the future and receiving passive income from your skies. 🚀✨</div>
        </div>
  );
};

const FailurePopUp = ({ isVisible }) => {
  return (
    <div
      className={` z-20 absolute top-[14px] ${isVisible ? "right-0" : "-right-[100%]"} bg-white p-5 flex items-center gap-5 duration-500`}
    >
      {/* <div className='flex items-center justify-center w-[18px] h-[18px]'>
					<FailureIcon />
				</div> */}
      🛑 Claim Failed! Please review your submission and ensure all information
      is correct.
    </div>
  );
};

const HowToModal = ({ goBack }) => {
  console.log("yoo how too")
  const [section, setSection] = useState(0);
  return (
    <div className="absolute z-50 flex h-screen w-screen flex-col items-center justify-center bg-white">
      <div
        onClick={goBack}
        className="absolute right-[18px] top-[26px] h-[14px] w-[14px]"
      >
        <CloseIcon />
      </div>
      {section === 0 && (
        <div className="flex flex-col items-center justify-center gap-[15px] px-[30px]">
          <div className="h-[72px] w-[72px]">
            <EarthIcon isActive={true} />
          </div>
          <p className="px-[30px] text-center text-[15px] text-[#222222]">
            Ready to claim your airspace? No registered airspace yet, but
            exciting times ahead! 🚀✨
          </p>
          <div
            onClick={() => setSection(1)}
            className="w-full cursor-pointer rounded-[8px] bg-[#0653EA] py-[16px] text-center text-white"
          >
            Next
          </div>
        </div>
      )}
      {section === 1 && (
        <div className="flex flex-col items-center justify-center gap-[15px] px-[60px] text-center text-[#222222]">
          <p className="text-[20px] font-medium">How to Claim My Airspace?</p>
          <div className="flex flex-col items-center justify-center py-[30px] text-center">
            <p className="text-[15px]">
              <span className="font-bold">1. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className="text-[15px]">
              <span className="font-bold">2. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className="text-[15px]">
              <span className="font-bold">3. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className="text-[15px]">
              <span className="font-bold">4. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className="text-[15px]">
              <span className="font-bold">5. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className="text-[15px]">
              <span className="font-bold">6. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
          </div>
          <p className="text-[15px]">
            Let's get started on creating the future and receiving passive
            income from your skies. 🚀✨
          </p>
          <div
            onClick={goBack}
            className="w-full cursor-pointer rounded-[8px] bg-[#0653EA] py-[16px] text-center text-white"
          >
            Claim Airspace
          </div>
        </div>
      )}
      <div className="mt-[15px] flex items-center justify-center gap-[11px] pt-5">
        {[0, 1].map((_, index) => (
          <div
            onClick={() => setSection(index)}
            className="h-[14px] w-[14px] cursor-pointer"
            style={{
              background: index !== section ? "#D9D9D9" : "transparent",
              border: index === section ? "1px solid #D9D9D9" : "none",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Airspaces = () => {
  const [isLoading, setIsLoading] = useState(false);
  // 
  const [claimButtonLoading,setClaimButtonLoading] = useState(false);
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
  const defaultData = {
    address: flyToAddress,
    name: "",
    rent: true,
    sell: false,
    hasPlanningPermission: null,
    hasChargingStation: false,
    hasLandingDeck: false,
    hasStorageHub: false,
    sellingPrice: "0",
    timezone: "UTC+0",
    transitFee: "1-99",
    isFixedTransitFee: false,
    noFlyZone: false,
    weekDayRanges: [
      { fromTime: 9, toTime: 21, isAvailable: false, weekDayId: 0 },
      { fromTime: 9, toTime: 21, isAvailable: false, weekDayId: 1 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 2 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 3 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 4 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 5 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 6 },
    ],
  };
  // showing
  const [showOptions, setShowOptions] = useState(false);
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);
  const [showFailurePopUp, setShowFailurePopUp] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [data, setData] = useState({ ...defaultData });
  // database
  const { createProperty } = useDatabase();
  const { user } = useAuth();

  useEffect(() => {
    if (map) return;

    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-15.498211, 28.035056],
        zoom: 15,
        bounds: [
          [-73.9876, 40.7661],
          [-73.9397, 40.8002],
        ],
        // attributionControl: false
      });

      newMap.on("load", function () {
        newMap.addLayer({
          id: "maine",
          type: "fill",
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
            "fill-color": "#D20C0C",
          },
        });
      });

      setMap(newMap);
      flyToUserIpAddress(newMap);
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

    const onClaim = async () => {
        try {
            const { address, title, hasChargingStation, hasLandingDeck, hasPlanningPermission, hasStorageHub, rent, timezone, transitFee, noFlyZone, isFixedTransitFee, weekDayRanges } = data;
            let { latitude, longitude } = coordinates;
            latitude = Number(latitude)
            longitude = Number(longitude)  
            if(!title)return
            const addProperty = await createProperty(user.blockchainAddress, {
                address,
                ownerId: user.id,
                propertyStatusId: 0,
                hasChargingStation,
                hasLandingDeck,
                hasStorageHub,
                isRentableAirspace: rent,
                title,
                transitFee,
                noFlyZone,
                isFixedTransitFee,
                latitude,
                longitude,
                timezone,
                isActive: hasPlanningPermission,
                vertexes: [
                    { latitude: latitude + 0.0001, longitude: longitude + 0.0001 },
                    { latitude: latitude + 0.0001, longitude: longitude - 0.0001 },
                    { latitude: latitude - 0.0001, longitude: longitude + 0.0001 },
                    { latitude: latitude - 0.0001, longitude: longitude - 0.0001 },
                ],
                weekDayRanges
            })
          if (addProperty === undefined) {
            setShowFailurePopUp(true);
          } else {
            setShowSuccessPopUp(true);
          }
            setShowClaimModal(false);
            setData({ ...defaultData });
        } catch (error) {
            console.log(error)
        }
    }
    const flyToUserIpAddress = async (map) => {
        if (!map) {
            return;
        }
        try {
            const ipResponse = await axios.get("https://api.ipify.org/?format=json");
            const ipAddress = ipResponse.data.ip;
            const  ipGeolocationApiUrl = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION}&ip=${ipAddress}`);
            const latitude = parseFloat(ipGeolocationApiUrl.data.latitude);
            const longitude = parseFloat(ipGeolocationApiUrl.data.longitude);
    
            if (isNaN(latitude) || isNaN(longitude)) {
                return;
            }
            map.flyTo({
                center: [longitude, latitude],
                zoom: 15 
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Airspaces</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

				<div className='relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]'>
					{!showMobileMap && <Sidebar />}
					<div className='flex h-full w-full flex-col'>
						{!showMobileMap && <PageHeader pageTitle={'Airspaces'} />}
						{showMobileMap && isMobile && (
							<ExplorerMobile
								onGoBack={() => setShowMobileMap(false)}
								flyToAddress={flyToAddress}
								address={address}
								setAddress={setAddress}
								addresses={addresses}
								showOptions={showOptions}
								handleSelectAddress={handleSelectAddress}
								onClaimAirspace={() => setShowClaimModal(true)}
							/>
						)}
						{showHowToModal && (
							<HowToModal goBack={() => setShowHowToModal(false)} />
						)}
						<section
							className={`relative flex h-full w-full items-start justify-start md:mb-0 ${showMobileMap ? '' : 'mb-[79px]'}`}>
							<div
								className={`!absolute !left-0 !top-0 !m-0 !h-screen !w-full`}
								id='map'
								style={{
									opacity: !isMobile ? '1' : showMobileMap ? '1' : '0',
									zIndex: !isMobile ? '20' : showMobileMap ? '20' : '-20',
								}}
							/>
							{isMobile && showMobileMap && flyToAddress && (
								<div
									onClick={() => setShowClaimModal(true)}
									className='absolute bottom-2 left-1/2 z-[25] w-[90%] -translate-x-1/2 cursor-pointer rounded-lg bg-[#0653EA] py-[16px] text-center text-[15px] font-normal text-white'>
									Claim Airspace
								</div>
							)}
							{isMobile && (
								<Fragment>
									{showClaimModal && (
										<EditAddAirspaceModal onCloseModal={() => setShowClaimModal(false)} data={data} setData={setData} onClaim={onClaim} />
									)}
								</Fragment>
							)}
							{!isMobile && (
								<div className='flex items-start justify-start'>
									<Explorer
										flyToAddress={flyToAddress}
										address={address}
										setAddress={setAddress}
										addresses={addresses}
										showOptions={showOptions}
										handleSelectAddress={handleSelectAddress}
										onClaimAirspace={() => setShowClaimModal(true)}
									/>
									<Slider />
									<PopUp isVisible={showSuccessPopUp} type='success' message='Congratulations on claiming your piece of the sky successfully!'/>
									<FailurePopUp isVisible={showFailurePopUp} />

									{showClaimModal && (
										<EditAddAirspaceModal onCloseModal={() => setShowClaimModal(false)} data={data} setData={setData} onClaim={onClaim} />
									)}
								</div>
							)}
							{!showMobileMap && (
								<div className='flex h-full w-full flex-col md:hidden'>
									<div
										onClick={() => setShowMobileMap(true)}
										className='flex w-full flex-col justify-between gap-[184px] bg-cover bg-center bg-no-repeat p-[17px]'
										style={{ backgroundImage: "url('/images/map-bg.png')" }}>
										<div className='w-full rounded-[20px] bg-[#222222] p-[12px] text-center text-base font-normal text-white'>
											Exciting times ahead!
											<br />
											Claim your airspace 🚀✨
										</div>
										<div className='w-full rounded-lg bg-[#0653EA] p-[12px] text-center text-base font-normal text-white'>
											Claim your airspace
										</div>
									</div>
									<div className='flex flex-1 flex-col gap-[23px] px-[13px] py-[29px]'>
										<div className='flex flex-1 items-center gap-[14px]'>
											<Link
												href={'/homepage/portfolio'}
												className='flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]'
												style={{
													backgroundImage:
														"url('/images/airspace-preview.png')",
												}}>
												<p className='text-xl font-medium text-white'>
													Airspace
												</p>
											</Link>
											<Link
												href={'/homepage/portfolio'}
												className='flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]'
												style={{
													backgroundImage: "url('/images/portfolio.jpg')",
												}}>
												<p className='text-xl font-medium text-white'>
													Portfolio
												</p>
											</Link>
										</div>
										<div
											onClick={() => setShowHowToModal(true)}
											className='flex cursor-pointer items-center justify-center gap-[7px] rounded-[20px] bg-[#222222] p-[13px] text-white'>
											<div className='h-[24px] w-[24px]'>
												<HelpQuestionIcon color='white' />
											</div>
											<p>How to Claim My Airspace?</p>
										</div>
									</div>
								</div>
							)}
						</section>
					</div>
				</div>
			</Fragment>
		);
};

export default Airspaces;
