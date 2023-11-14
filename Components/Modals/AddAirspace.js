import { counterActions } from '@/store/store';
import maplibregl from 'maplibre-gl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useVerification } from '@/hooks/useVerification';
import swal from 'sweetalert';

const AddAirspace = (props) => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [addressData, setAddressData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [addressValid, setAddressValid] = useState(false);
  const [confirmMap, setConfirmMap] = useState(true);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      attributionControl: false,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12,
      center: [-122.42, 37.779],
    });

    map.on('load', function () {
      map.addLayer({
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
  }, []);

  useEffect(() => {
    setConfirmMap(true);
    setAddressValid(false);
    setError(false);
    if (address) {
      const addressHandler = setTimeout(() => {
        const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxToken}`;

        fetch(mapboxGeocodingUrl)
          .then((res) => {
            if (!res.ok) {
              return res.json().then((errorData) => {
                throw new Error(errorData.message);
              });
            }
            return res.json();
          })
          .then((resData) => {
            setAddresses(resData.features);
          })
          .catch((err) => {
            console.log(err);
            setAddresses([]);
          });
      }, 500);
      return () => {
        clearTimeout(addressHandler);
      };
    }
  }, [address]);

  const addressChangeHandler = (e) => {
    if (!showOptions) {
      setShowOptions(true);
    }

    setAddress(e.target.value);
  };

  const buttonSelectHandler = (e) => {
    e.preventDefault(), setAddress(e.target.value), setShowOptions(false);
  };

  const mapLoadHandler = (e) => {
    e.preventDefault();

    const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxToken}`;

    fetch(mapboxGeocodingUrl)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(errorData.message);
          });
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.features.length === 0) {
          setError('No location found for the given address.');
          return;
        }

        setAddressValid(true);
        console.log({ addF: resData.features });
        setAddressData(resData.features[0]);

        const endPoint = resData.features[0].center;

        const map = new maplibregl.Map({
          container: 'map',
          attributionControl: false,
          style: 'mapbox://styles/mapbox/streets-v11',
          zoom: 18,
          center: endPoint,
        });

        var nav = new maplibregl.NavigationControl();
        map.addControl(nav, 'top-right');

        if (resData.features[0].geometry.type !== 'Polygon') {
          let el = document.createElement('div');
          el.id = 'markerWithExternalCss';

          new maplibregl.Marker(el).setLngLat(endPoint).addTo(map);

          setConfirmMap(false);
          return;
        }

        map.on('load', function () {
          map.addLayer({
            id: 'maine',
            type: 'fill',
            source: {
              type: 'geojson',
              data: resData.features[0].geometry,
            },
            layout: {},
            paint: {
              'fill-color': '#D20C0C',
              'fill-opacity': 0.5,
            },
          });
        });

        setConfirmMap(false);
        setError('');
      })
      .catch((err) => {
        console.log(err);
        setError(
          `${err.message || ''}${
            err.message ? '.' : ''
          } kindly check your address and try again`
        );
      });
  };

  const closeModalHandler = () => {
    dispatch(counterActions.closeConfirmOnMapModal());
  };

  const confirmAddressHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (props.user.categoryId === 1 && props.user.KYCStatusId !== 2) {
      swal({
        title: 'Sorry!',
        text: 'Your KYB is yet to be completed. A member of our team will be in contact with you soon',
      });
      return;
    }

    const vertexes = [];

    if (addressData.geojson && addressData.geojson.type === 'Polygon') {
      for (const address of addressData.geojson.coordinates) {
        for (const val of address) {
          const addValue = {};
          const long = parseFloat(val[0].toFixed(2));
          const lat = parseFloat(val[1].toFixed(2));
          addValue.longitude = +long;
          addValue.latitude = +lat;
          vertexes.push(addValue);
        }
      }
    }

    const longitude = parseFloat(addressData.lon).toFixed(2);
    const latitude = parseFloat(addressData.lat).toFixed(2);

    const addressValue = {
      address: address,
      longitude: +longitude,
      latitude: +latitude,
      vertexes: vertexes,
    };

    dispatch(counterActions.airspaceData(addressValue));

    // await verificationCheck(props.users);

    dispatch(counterActions.closeConfirmOnMapModal());
    dispatch(counterActions.additionalInfoModal());
  };

  return (
    <div
      className='fixed z-20 overflow-y-auto rounded bg-white'
      style={{
        width: '886px',
        height: '564px',
        top: '7vh',
        left: 'calc(50% - 443px)',
      }}
      onClick={() => {
        setShowOptions(false);
      }}
    >
      <div className='relative'>
        <button onClick={closeModalHandler} className='absolute right-9 top-5'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='34'
            height='34'
            viewBox='0 0 34 34'
            fill='none'
          >
            <path
              d='M12.7578 12.7285L21.2431 21.2138'
              stroke='#252530'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12.7569 21.2138L21.2422 12.7285'
              stroke='#252530'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
      <div className='mb-8 mt-10 flex flex-row items-center justify-center gap-4'>
        <h2 className='font-bold'>Add New Airspace</h2>
      </div>
      <form className='relative'>
        <label className='ms-12 font-medium text-light-brown'>
          Address<span className='text-red-500'>*</span>
        </label>{' '}
        <br />
        <div className='me-12 flex flex-row items-center justify-end gap-2.5'>
          <div className='relative'>
            <p className='absolute -top-2 right-0 text-sm text-red-500'>
              {error}
            </p>
            <input
              placeholder='AirSpace Address'
              onChange={addressChangeHandler}
              value={address}
              className='ms-12 mt-2.5 text-ellipsis rounded py-2.5 pe-36 ps-5 placeholder:text-sm placeholder:text-light-brown focus:outline-blue-200'
              style={{
                width: '656px',
                height: '37px',
                border: '0.35px solid #0653EA',
              }}
            />

            {addressValid && (
              <div className='absolute right-3 top-4 z-10 flex flex-row items-center justify-center gap-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                >
                  <path
                    d='M6 11.375C3.035 11.375 0.625 8.965 0.625 6C0.625 3.035 3.035 0.625 6 0.625C8.965 0.625 11.375 3.035 11.375 6C11.375 8.965 8.965 11.375 6 11.375ZM6 1.375C3.45 1.375 1.375 3.45 1.375 6C1.375 8.55 3.45 10.625 6 10.625C8.55 10.625 10.625 8.55 10.625 6C10.625 3.45 8.55 1.375 6 1.375Z'
                    fill='#29AE55'
                  />
                  <path
                    d='M5.28997 7.79078C5.18997 7.79078 5.09497 7.75078 5.02497 7.68078L3.60997 6.26578C3.46497 6.12078 3.46497 5.88078 3.60997 5.73578C3.75497 5.59078 3.99497 5.59078 4.13997 5.73578L5.28997 6.88578L7.85997 4.31578C8.00497 4.17078 8.24497 4.17078 8.38997 4.31578C8.53497 4.46078 8.53497 4.70078 8.38997 4.84578L5.55497 7.68078C5.48497 7.75078 5.38997 7.79078 5.28997 7.79078Z'
                    fill='#29AE55'
                  />
                </svg>
                <p className='text-xml text-light-green'>Found</p>
              </div>
            )}
          </div>
          <button
            disabled={!address}
            onClick={mapLoadHandler}
            className='mt-2.5 rounded-md bg-dark-blue text-sm text-white disabled:cursor-not-allowed disabled:bg-light-blue'
            style={{ width: '120px', height: '37px', border: 'none' }}
          >
            Search
          </button>
        </div>
        {addresses.length > 0 && address.length > 0 && (
          <div
            style={{
              width: '656px',
              height: '259px',
              border: '0.35px solid #0653EA',
              marginLeft: '52px',
            }}
            className={`${
              (!showOptions || !addresses.length > 1) && 'hidden'
            } absolute z-10 overflow-y-auto rounded bg-white px-3 py-1`}
          >
            <p className='text-xs text-red-500'>
              If any of the addresses listed below matches your address, click
              on it to select
            </p>
            {addresses.map((address) => {
              return (
                <button
                  key={address.osm_id + Math.random()}
                  value={address.display_address}
                  onClick={buttonSelectHandler}
                  className='py-2 text-left'
                  style={{ borderBottom: '0.2px solid #0653EA', width: '100%' }}
                >
                  {address.display_address}
                </button>
              );
            })}
          </div>
        )}
        <div className='mt-8'>
          <p className='-mb-7 ms-12'>Kindly Confirm the Address on the Map</p>
          <div
            id='map'
            style={{ width: '786px', height: '250px' }}
            className='mt-0 rounded-md'
          ></div>
          <div className='mt-5 flex flex-row items-center justify-center gap-5'>
            <button
              onClick={closeModalHandler}
              className='rounded-md text-dark-blue'
              style={{
                border: '1px solid #0653EA',
                width: '120px',
                height: '40px',
              }}
            >
              Cancel
            </button>
            <button
              disabled={!address || confirmMap || isLoading}
              onClick={confirmAddressHandler}
              className='rounded-md bg-dark-blue text-white disabled:cursor-wait disabled:bg-light-blue'
              style={{ width: '120px', height: '40px' }}
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAirspace;
