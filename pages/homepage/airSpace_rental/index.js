import { Fragment, useState, useEffect } from 'react';

import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';
import Script from 'next/script';
import Image from 'next/image';

import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';

import { useAuth } from '@/hooks/useAuth';

import { Web3Auth } from '@web3auth/modal';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';
import base58 from 'bs58';
import swal from 'sweetalert';

import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import Backdrop from '@/Components/Backdrop';
import MyAirspaceOverview from '@/Components/MyAirspaces/MyAirspaceOverview';
import Airspaces from '@/Components/Airspaces';
import AdditionalAispaceInformation from '@/Components/Modals/AdditionalAirspaceInformation';
import { counterActions } from '@/store/store';
import Spinner from '@/Components/Spinner';
import MyAirspaceTab from '@/Components/MyAirspaceTab';
import EditAispaceModal from '@/Components/Modals/EditAirspaceModal';
// import { useVerification } from '@/hooks/useVerification';
import CollapseAirspace from '@/Components/CollapseAirspace';

const Airspace = () => {
  // const { verificationCheck } = useVerification();

  const router = useRouter();
  const dispatch = useDispatch();

  const [allAirspace, setAllAirSpace] = useState(false);
  const [myAirspace, setMyAirSpace] = useState(true);
  const [showAddReviewModal, setshowAddReviewModal] = useState(false);
  const [showAddAirspaceModal, setShowAddAirspaceModal] = useState(false);
  const [airspace, setAirspace] = useState('mine');
  const [myFilteredAirspace, setMyFilteredAirspace] = useState();
  const [flyToAddress, setFlyToAddress] = useState('');
  const [myAirspaces, setMyAirspaces] = useState();
  const [editAirspace, setEditAirspace] = useState();
  const [viewMyAirspace, setViewMyAirSpace] = useState(false);
  const [address, setAddress] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [addressData, setAddressData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [transition, setTransition] = useState(false);

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const { user: selectorUser } = useAuth();

  useEffect(() => {
    (async () => {
        if(selectorUser == undefined){
                localStorage.removeItem('openlogin_store');
                router.push('/auth/join');
                return;
        }
        const chainConfig = {
            chainNamespace: 'solana',
            chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
            rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
            displayName: `Solana ${process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME}`,
            blockExplorer: 'https://explorer.solana.com',
            ticker: 'SOL',
            tickerName: 'Solana',
        };
        const web3auth = new Web3Auth({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
            chainConfig: chainConfig,
        });
        await web3auth.initModal();
        // await web3auth.connect();
        let userInfo;
        try {
            userInfo = await web3auth.getUserInfo();
        } catch (err) {
            localStorage.removeItem('openlogin_store');
            swal({
              title: 'oops!',
              text: 'Something went wrong. Kindly try again',
            }).then(() => router.push('/auth/join'));
            return;
        }

        const fetchedToken = JSON.parse(
            localStorage.getItem('openlogin_store')
        );

        setToken(fetchedToken.sessionId);
        setUser(selectorUser);
    })()

}, [selectorUser]);

  // CREATE MAP
  useEffect(() => {
    if (token && user && !map) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

      const newMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.42, 37.779],
        zoom: 12,
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
    }
  }, [token, user]);

  // FLY TO ADDRESS
  useEffect(() => {
    if (flyToAddress) {
      setIsLoading(true);

      const mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${flyToAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

      fetch(mapBoxGeocodingUrl)
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errorData) => {
              throw new Error(errorData.message);
            });
          }
          return res.json();
        })
        .then((resData) => {
          if (resData.features && resData.features.length > 0) {
            const coordinates = resData.features[0].geometry.coordinates;
            const endPoint = [coordinates[0], coordinates[1]];

            setLongitude(coordinates[0]);
            setLatitude(coordinates[1]);
            setAddressData(resData.features[0].properties);

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
          } else {
            throw new Error('Address not found');
          }
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          swal({
            title: 'Oops!',
            text: err.message,
          });
        });
    }
  }, [flyToAddress, map]);

  // LOOK FOR ADDRESSES
  useEffect(() => {
    if (address) {
      setLongitude('');
      setLatitude('');

      const addressHandler = setTimeout(() => {
        const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

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
            if (resData.features && resData.features.length > 0) {
              setAddresses(resData.features);
            } else {
              setAddresses([]);
            }
          })
          .catch((err) => {
            console.error(err);
            setAddresses([]);
          });
      }, 500);

      return () => {
        clearTimeout(addressHandler);
      };
    }
  }, [address]);

  // GET USER PROPERTIES / AIRSPACE
  useEffect(() => {
    const getUserAirspace = async () => {
      if (user) {
        const signatureObj = {};

        const chainConfig = {
          chainNamespace: 'solana',
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: 'Solana Mainnet',
          blockExplorer: 'https://explorer.solana.com',
          ticker: 'SOL',
          tickerName: 'Solana',
        };

        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          chainConfig: chainConfig,
        });

        await web3auth.initModal();

        const web3authProvider = await web3auth.connect();

        const solanaWallet = new SolanaWallet(web3authProvider);

        // const userInfo = await web3auth.getUserInfo();

        const domain = window.location.host;
        // const domain = 'localhost:3000';
        const origin = window.location.origin;
        // const origin = 'http://localhost:3000';

        const payload = new SIWPayload();
        payload.domain = domain;
        payload.uri = origin;
        payload.address = user.blockchainAddress;
        payload.statement = 'Sign in to SkyTrade app.';
        payload.version = '1';
        payload.chainId = 1;

        const header = { t: 'sip99' };
        const network = 'solana';

        let message = new SIWWeb3({ header, payload, network });

        const messageText = message.prepareMessage();
        const msg = new TextEncoder().encode(messageText);
        const result = await solanaWallet.signMessage(msg);

        const signature = base58.encode(result);

        signatureObj.sign = signature;
        signatureObj.sign_nonce = message.payload.nonce;
        signatureObj.sign_issue_at = message.payload.issuedAt;
        signatureObj.sign_address = user.blockchainAddress;

        fetch(`/api/proxy?${Date.now()}`, {
          headers: {
            'Content-Type': 'application/json',
            uri: `/private/properties/user-properties/${user.id}`,
            sign: signatureObj.sign,
            time: signatureObj.sign_issue_at,
            nonce: signatureObj.sign_nonce,
            address: signatureObj.sign_address,
          },
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((err) => {
                throw new Error(err.message);
              });
            }
            return res.json().then((data) => {
              setMyAirspaces(data);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    getUserAirspace();
  }, [user]);

  const newAirspace = useSelector((state) => {
    return state.value.newAirspace;
  });

  const additionalInfo = useSelector(
    (state) => state.value.airspaceAdditionalInfo
  );

  const showAddAirspaceModalHandler = (e) => {
    setShowAddAirspaceModal(true);
  };

  const backdropCloseHandler = () => {
    setShowAddAirspaceModal(false);
    setshowAddReviewModal(false);

    dispatch(counterActions.closeNewAirspaceModal());
  };

  const editAirspaceHandler = () => {
    setEditAirspace(true);
  };

  const showAllAirspace = () => {
    setAllAirSpace(true);
    setMyAirSpace(false);
    setAirspace('all');
  };

  const showMyAirspace = () => {
    setMyAirSpace(true);
    setAllAirSpace(false);
    setAirspace('mine');
  };

  const showMyAirspaceHandler = (id) => {
    const filteredAirspace = myAirspaces.filter(
      (airspace) => airspace.id === id
    );
    setMyFilteredAirspace(filteredAirspace[0]);
    setFlyToAddress(filteredAirspace[0].address);

    setViewMyAirSpace(true);
  };

  const closeAirspaceDetailsHandler = () => {
    setViewMyAirSpace(false);
  };

  const addressChangeHandler = (e) => {
    if (!showOptions) {
      setShowOptions(true);
    }

    setAddress(e.target.value);
  };

  const buttonSelectHandler = (e) => {
    e.preventDefault(),
      setAddress(e.target.value),
      setFlyToAddress(e.target.value);

    setShowOptions(false);
  };

  const confirmAddressHandler = (e) => {
    setIsLoading(true);

    // if (user.categoryId === 1 && user.KYCStatusId !== 2) {
    //   swal({
    //     title: 'Sorry!',
    //     text: 'Your KYB is yet to be completed. A member of our team will be in contact with you soon',
    //   });

    //   setIsLoading(false);
    //   return;
    // }

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

    const long = parseFloat(longitude).toFixed(2);
    const lat = parseFloat(latitude).toFixed(2);

    const addressValue = {
      address: address,
      longitude: +long,
      latitude: +lat,
      vertexes: vertexes,
    };

    dispatch(counterActions.airspaceData(addressValue));

    // verificationCheck(selectorUser);

    dispatch(counterActions.additionalInfoModal());
    setIsLoading(false);
  };

  if (!user || !token) {
    return <Spinner />;
  }

  return (
    <Fragment>
      {additionalInfo && <AdditionalAispaceInformation user={user} />}
      {editAirspace &&
        createPortal(
          <EditAispaceModal
            variable={myFilteredAirspace.isFixedTransitFee}
            title={myFilteredAirspace.title}
            fee={myFilteredAirspace.transitFee}
            deck={myFilteredAirspace.hasLandingDeck}
            station={myFilteredAirspace.hasChargingStation}
            storage={myFilteredAirspace.hasStorageHub}
            status={myFilteredAirspace.noFlyZone}
            weeks={myFilteredAirspace.weekDayRanges}
            timeZone={myFilteredAirspace.timezone}
            user={user}
            id={myFilteredAirspace.id}
            onClose={(e) => {
              e.preventDefault();
              setEditAirspace(false);
            }}
          />,
          document.getElementById('modal-root')
        )}

      {(showAddReviewModal ||
        showAddAirspaceModal ||
        newAirspace ||
        additionalInfo ||
        editAirspace) &&
        createPortal(
          <Backdrop onClick={backdropCloseHandler} />,
          document.getElementById('backdrop-root')
        )}
      <div className='mx-auto flex flex-row'>
        <Sidebar user={user} />
        <div
          className='overflow-y-auto overflow-x-hidden'
          style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
        >
          <Navbar
            name={user.name}
            onClose={() => setShowOptions(false)}
            categoryId={user.categoryId}
          // status={user.KYCStatusId}
          >
            <div className='relative'>
              <svg
                onClick={() => {
                  setFlyToAddress(address);
                  setShowOptions(false);
                }}
                xmlns='http://www.w3.org/2000/svg'
                className={`absolute bottom-11 right-2 ${isLoading ? 'cursor-wait' : 'cursor-pointer'
                  }`}
                width='17'
                height='17'
                viewBox='0 0 17 17'
                fill='none'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M10.7118 11.7481C8.12238 13.822 4.33202 13.6588 1.93164 11.2584C-0.643879 8.6829 -0.643879 4.50716 1.93164 1.93164C4.50716 -0.64388 8.68289 -0.643879 11.2584 1.93164C13.6588 4.33202 13.822 8.12238 11.7481 10.7118L16.7854 15.7491C17.0715 16.0352 17.0715 16.4992 16.7854 16.7854C16.4992 17.0715 16.0352 17.0715 15.7491 16.7854L10.7118 11.7481ZM2.96795 10.2221C0.964766 8.21893 0.964766 4.97113 2.96795 2.96795C4.97113 0.964767 8.21892 0.964767 10.2221 2.96795C12.2238 4.96966 12.2253 8.21416 10.2265 10.2177C10.225 10.2192 10.2236 10.2206 10.2221 10.2221C10.2206 10.2236 10.2192 10.225 10.2177 10.2265C8.21416 12.2253 4.96966 12.2238 2.96795 10.2221Z'
                  fill='#252530'
                  fillOpacity='0.55'
                />
              </svg>
              <input
                type='text'
                value={address}
                onChange={addressChangeHandler}
                placeholder='Search here to claim airspace'
                className='my-7 ms-5 text-ellipsis rounded-md pe-8 ps-3 focus:outline-blue-200'
                style={{
                  width: '340px',
                  height: '47px',
                  border: '1px solid rgba(37, 37, 48, 0.55)',
                }}
              />

              {addresses.length > 0 && address.length > 0 && (
                <div
                  style={{
                    width: '340px',
                    height: '259px',
                    border: '0.35px solid #0653EA',
                  }}
                  className={`${(!showOptions || addresses.length < 1) && 'hidden'
                    } absolute top-20 z-50 ms-5 overflow-y-auto rounded bg-white px-3 py-1`}
                >
                  <p className='text-xs text-red-500'>
                    If any of the addresses listed below matches your address,
                    click on it to select
                  </p>
                  {addresses.map((address) => {
                    return (
                      <button
                        key={address.id}
                        value={address.place_name}
                        onClick={buttonSelectHandler}
                        className='py-2 text-left text-black'
                        style={{
                          borderBottom: '0.2px solid #0653EA',
                          width: '100%',
                          // height: 'auto',
                        }}
                      >
                        {address.place_name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Navbar>
          <div
            className='relative mt-0'
            id='map'
            style={{
              width: 'calc(100vw - 257px)',
              height: '100vh',
              marginTop: '0',
            }}
          >
            <CollapseAirspace
              transition={transition}
              collapse={() => setTransition(!transition)}
            />
            <Airspaces
              showMyAirspace={showMyAirspace}
              airspace={airspace}
              allAirspace={allAirspace}
              showAllAirspace={showAllAirspace}
              myAirspace={myAirspace}
              onAddAirspace={showAddAirspaceModalHandler}
              transition={transition}
            >
              <div>
                {latitude && longitude && address.length > 0 && (
                  <p className='mt-3'>Search Result</p>
                )}
                {latitude && longitude && address.length > 0 && (
                  <div
                    className='mb-5 mt-3 bg-white p-3'
                    style={{
                      width: '299px',
                      borderRadius: '3px',
                      border: '1px solid blue',
                    }}
                  >
                    <div className='flex flex-row gap-5'>
                      <Image
                        src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${longitude},${latitude},12,0/70x70?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`}
                        alt='a static map'
                        width={70}
                        height={70}
                        style={{ objectFit: 'cover' }}
                      />
                      <p>{address}</p>
                    </div>
                    <div className='flex flex-row justify-end'>
                      <button
                        onClick={confirmAddressHandler}
                        disabled={isLoading}
                        className='mt-2 rounded-md bg-dark-blue text-white disabled:cursor-wait'
                        style={{ width: '129px', height: '29px' }}
                      >
                        Claim Airspace
                      </button>
                    </div>
                  </div>
                )}
                {!myAirspaces && <p className='mt-10'>Loading...</p>}

                {myAirspaces &&
                  myAirspaces.length > 0 &&
                  latitude &&
                  longitude &&
                  address.length > 0 && (
                    <p className=' mt-5 pt-5'>My Airspaces</p>
                  )}
                {myAirspaces &&
                  myAirspaces.length > 0 &&
                  myAirspaces.map((airspace) => {
                    return (
                      <MyAirspaceTab
                        key={airspace.id}
                        title={airspace.title}
                        name={user.name}
                        address={airspace.address}
                        identification={airspace.identification}
                        status={airspace.noFlyZone}
                        viewMyAirspace={showMyAirspaceHandler.bind(
                          null,
                          airspace.id
                        )}
                        amount={airspace.transitFee}
                        propertyStatus={airspace.propertyStatus.type}
                      ></MyAirspaceTab>
                    );
                  })}
              </div>
            </Airspaces>

            {viewMyAirspace && (
              <MyAirspaceOverview
                viewMyAirspace={showMyAirspaceHandler}
                //  myAirspaceReview={myAirspaceReviewHandler}
                //  aboutMyAirspace={aboutMyAirspaceHandler}
                closeDetails={closeAirspaceDetailsHandler}
                address={myFilteredAirspace.address}
                title={myFilteredAirspace.title}
                name={user.name}
                email={user.email}
                amount={myFilteredAirspace.transitFee}
                landingDeck={myFilteredAirspace.hasLandingDeck}
                chargingStation={myFilteredAirspace.hasChargingStation}
                storageHub={myFilteredAirspace.hasStorageHub}
                noFlyZone={myFilteredAirspace.noFlyZone}
                editAirspace={editAirspaceHandler}
                latitude={myFilteredAirspace.latitude}
                longitute={myFilteredAirspace.longitude}
                propertyStatus={myFilteredAirspace.propertyStatus.type}
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Airspace;
