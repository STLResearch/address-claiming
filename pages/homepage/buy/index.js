import { Fragment, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { MagnifyingGlassIcon } from '@/Components/Icons';
import Sidebar from '@/Components/Sidebar';
import PageHeader from '@/Components/PageHeader';
import Spinner from '@/Components/Spinner';
import Backdrop from '@/Components/Backdrop';
import useDatabase from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import Head from 'next/head';

const Explorer = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
}) => {
  return (
    <div
      className='z-20 m-[39px] hidden max-h-full max-w-[362px] flex-col items-center gap-[15px] rounded-[30px] bg-[#FFFFFFCC] px-[29px] py-[43px] md:flex'
      style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
    >
      <div className='flex items-center gap-[5px]'>
        <p className='text-xl font-medium text-[#222222]'>SkyMarket Hub</p>
      </div>
      <p className='text-[15px] font-normal text-[#222222]'>
        Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial Freedom.
      </p>
      <div
        className='relative w-full rounded-lg bg-white px-[22px] py-[16px]'
        style={{ border: '1px solid #87878D' }}
      >
        <input
          autoComplete='off'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type='text'
          name='searchAirspaces'
          id='searchAirspaces'
          placeholder='Search Airspaces'
          className='w-full pr-[20px] outline-none'
        />
        <div className='absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2'>
          <MagnifyingGlassIcon />
        </div>
        {showOptions && (
          <div className='absolute left-0 top-[55px] w-full flex-col bg-white'>
            {addresses.map((item) => {
              return (
                <div
                  key={item.id}
                  value={item.place_name}
                  onClick={() => handleSelectAddress(item.place_name)}
                  className='w-full p-5 text-left text-[#222222]'
                  style={{
                    borderTop: '0.2px solid #222222',
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
}) => {
  return (
    <div className='z-[40] flex items-center gap-[15px] bg-white px-[21px] pb-[19px]'>
      <div
        className='relative w-full rounded-lg bg-white px-[22px] py-[16px]'
        style={{ border: '1px solid #87878D' }}
      >
        <input
          autoComplete='off'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type='text'
          name='searchAirspaces'
          id='searchAirspaces'
          placeholder='Search Airspaces'
          className='w-full pr-[20px] outline-none'
        />
        <div className='absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2'>
          <MagnifyingGlassIcon />
        </div>
        {showOptions && (
          <div className='absolute left-0 top-[55px] w-full flex-col bg-white'>
            {addresses.map((item) => {
              return (
                <div
                  key={item.id}
                  value={item.place_name}
                  onClick={() => handleSelectAddress(item.place_name)}
                  className='w-full p-5 text-left text-[#222222]'
                  style={{
                    borderTop: '0.2px solid #222222',
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

const Buy = () => {
  const [isLoading, setIsLoading] = useState(false);
  // map
  const [map, setMap] = useState(null);
  const { isMobile } = useMobile();
  // variables
  const [address, setAddress] = useState('');
  const [addressData, setAddressData] = useState();
  const [addresses, setAddresses] = useState([]);
  const [flyToAddress, setFlyToAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    longitude: '',
    latitude: '',
  });
  const [marker, setMarker] = useState();
  const defaultData = {
    address: flyToAddress,
    name: '',
    rent: false,
    sell: false,
    hasPlanningPermission: false,
    hasChargingStation: false,
    hasLandingDeck: false,
    hasStorageHub: false,
    sellingPrice: '',
    timezone: 'UTC+0',
    transitFee: '1-99',
    isFixedTransitFee: false,
    noFlyZone: false,
    weekDayRanges: [
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 0 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 1 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 2 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 3 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 4 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 5 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 6 },
    ],
  };
  // showing
  const [showOptions, setShowOptions] = useState(false);
  const [data, setData] = useState({ ...defaultData });

  useEffect(() => {
    if (map) return;

    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

      const newMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-15.498211, 28.035056],
        zoom: 15,
        // attributionControl: false
      });

      newMap.on('load', function () {
        newMap.addLayer({
          id: 'maine',
          type: 'fill',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [],
              },
            },
          },
          layout: {},
          paint: {
            'fill-color': '#D20C0C',
          },
        });
      });

      setMap(newMap);
    };

    createMap();
  }, []);

  useEffect(() => {
    if (!showOptions) setShowOptions(true);
    if (!address) return setShowOptions(false);

    let timeoutId;

    const getAddresses = async () => {
      setCoordinates({ longitude: '', latitude: '' });

      timeoutId = setTimeout(async () => {
        try {
          const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

          const response = await fetch(mapboxGeocodingUrl);

          if (!response.ok) throw new Error('Error while getting addresses');

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
          throw new Error('Error while getting new address location');

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
          throw new Error('Address not found');
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

        let el = document.createElement('div');
        el.id = 'markerWithExternalCss';

        // Add the new marker to the map and update the marker state
        const newMarker = new maplibregl.Marker(el)
          .setLngLat(endPoint)
          .addTo(map);
        setMarker(newMarker);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    goToAddress();
  }, [flyToAddress, map]);

  useEffect(() => {
    if (flyToAddress === address) setShowOptions(false);
    if (flyToAddress) setData((prev) => ({ ...prev, address: flyToAddress }));
  }, [flyToAddress, address]);

  const handleSelectAddress = (placeName) => {
    setAddress(placeName);
    setFlyToAddress(placeName);
    setShowOptions(false);
  };

  return (
    <Fragment>
      <Head>
        <title>Marketplace: Buy</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

      <div className='relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]'>
        <Sidebar />
        <div className='flex h-full w-full flex-col'>
          <PageHeader pageTitle={isMobile ? 'Buy' : 'Marketplace: Buy'} />
          {isMobile && (
            <ExplorerMobile
              address={address}
              setAddress={setAddress}
              addresses={addresses}
              showOptions={showOptions}
              handleSelectAddress={handleSelectAddress}
            />
          )}
          <section
            className={`relative mb-[79px] flex h-full w-full items-start justify-start md:mb-0`}
          >
            <div
              className={`!absolute !left-0 !top-0 !m-0 !h-screen !w-full`}
              id='map'
              style={{ zIndex: '20' }}
            />
            {!isMobile && (
              <div className='flex items-start justify-start'>
                <Explorer
                  address={address}
                  setAddress={setAddress}
                  addresses={addresses}
                  showOptions={showOptions}
                  handleSelectAddress={handleSelectAddress}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Buy;
