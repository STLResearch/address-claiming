import { counterActions } from '@/store/store';
import { Fragment, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import swal from 'sweetalert';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Web3Auth } from '@web3auth/modal';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';
import base58 from 'bs58';

import TimeSelect from '../TimeSelect';
import TimezoneSelectComponent from '../Timezone';

const AdditionalAispaceInformation = (props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [costChecked, setCostChecked] = useState(true);
  const [deckChecked, setDeckChecked] = useState(false);
  const [stationChecked, setStationChecked] = useState(false);
  const [storageChecked, setStorageChecked] = useState(false);
  const [rentChecked, setRentChecked] = useState(true);

  const [deck, setDeck] = useState('');
  const [storage, setStorage] = useState('');
  const [airspaceStatus, setAirspaceStatus] = useState('Available');
  const [monAvailable, setMonAvailable] = useState(true);
  const [tueAvailable, setTueAvailable] = useState(true);
  const [wedAvailable, setWedAvailable] = useState(true);
  const [thuAvailable, setThuAvailable] = useState(true);
  const [friAvailable, setFriAvailable] = useState(true);
  const [satAvailable, setSatAvailable] = useState(true);
  const [sunAvailable, setSunAvailable] = useState(true);
  const [fromMonday, setFromMonday] = useState(7);
  const [toMonday, setToMonday] = useState(22);
  const [fromTuesday, setFromTuesday] = useState(7);
  const [toTuesday, setToTuesday] = useState(22);
  const [fromWednesday, setFromWednesday] = useState(7);
  const [toWednesday, setToWednesday] = useState(22);
  const [fromThursday, setFromThursday] = useState(7);
  const [toThursday, setToThursday] = useState(22);
  const [fromFriday, setFromFriday] = useState(7);
  const [toFriday, setToFriday] = useState(22);
  const [fromSaturday, setFromSaturday] = useState(7);
  const [toSaturday, setToSaturday] = useState(22);
  const [fromSunday, setFromSunday] = useState(7);
  const [toSunday, setToSunday] = useState(22);
  const [timezone, setTimezone] = useState('US/Central');

  const airspaceTitleRef = useRef();

  const dispatch = useDispatch();

  const airspaceData = useSelector((state) => state.value.airspaceData);

  const closeModalHandler = (e) => {
    e.preventDefault();
    dispatch(counterActions.closeAdditionalInfoModal());
  };

  const costCheckedHandler = (e) => {
    setCostChecked(!costChecked);
  };

  const deckCheckedHandler = (e) => {
    setDeckChecked(!deckChecked);

    if (!deckChecked) {
      setDeck('Landing Deck');
    } else {
      setDeck('');
    }
  };

  const stationHandler = (e) => {
    setStationChecked(!stationChecked);
  };

  const storageHandler = (e) => {
    setStorageChecked(!storageChecked);

    if (!storageChecked) {
      setStorage('Storage Hub');
    } else {
      setStorage('');
    }
  };

  const airspaceStatusHandler = (e) => {
    setAirspaceStatus(e.target.value);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const airspaceTitle = airspaceTitleRef.current.value;

    const weekDayRanges = [
      {
        weekDayId: 0,
        fromTime: +fromMonday,
        toTime: +toMonday,
        isAvailable:
          monAvailable && airspaceStatus === 'Available' ? true : false,
      },
      {
        weekDayId: 1,
        fromTime: +fromTuesday,
        toTime: +toTuesday,
        isAvailable:
          tueAvailable && airspaceStatus === 'Available' ? true : false,
      },
      {
        weekDayId: 2,
        fromTime: +fromWednesday,
        toTime: +toWednesday,
        isAvailable:
          wedAvailable && airspaceStatus === 'Available' ? true : false,
      },
      {
        weekDayId: 3,
        fromTime: +fromThursday,
        toTime: +toThursday,
        isAvailable:
          thuAvailable && airspaceStatus === 'Available' ? true : false,
      },
      {
        weekDayId: 4,
        fromTime: +fromFriday,
        toTime: +toFriday,
        isAvailable:
          friAvailable && airspaceStatus === 'Available' ? true : false,
      },
      {
        weekDayId: 5,
        fromTime: +fromSaturday,
        toTime: +toSaturday,
        isAvailable:
          satAvailable && airspaceStatus === 'Available' ? true : false,
      },
      {
        weekDayId: 6,
        fromTime: +fromSunday,
        toTime: +toSunday,
        isAvailable:
          sunAvailable && airspaceStatus === 'Available' ? true : false,
      },
    ];

    const signatureObj = {};

    const chainConfig = {
      chainNamespace: 'solana',
      chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
      rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
      displayName: 'Solana Mainnet',
      blockExplorer: 'https://explorer.solana.com',
      ticker: 'SOL',
      tickerName: 'Solana',
    };

    const web3auth = new Web3Auth({
      // For Production
      // clientId: "",
      clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,

      // For Development
      // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
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
    payload.address = props.user.blockchainAddress;
    payload.statement = 'Sign in with Solana to the app.';
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
    signatureObj.sign_address = props.user.blockchainAddress;

    const airspaceInformation = {
      ...airspaceData,
      ownerId: props.user.id,
      title: airspaceTitle,
      transitFee: '$0.01 - $99.00',
      hasStorageHub: storageChecked,
      hasLandingDeck: deckChecked,
      hasChargingStation: stationChecked,
      isRentableAirspace: rentChecked,
      isFixedTransitFee: costChecked,
      noFlyZone: airspaceStatus === 'Available' ? false : true,
      weekDayRanges,
      timezone: airspaceStatus === 'Available' ? timezone : 'GMT',
    };

    fetch(`/api/proxy?${Date.now()}`, {
      method: 'POST',
      body: JSON.stringify(airspaceInformation),
      headers: {
        'Content-Type': 'application/json',
        URI: '/private/properties/claim',
        sign: signatureObj.sign,
        time: signatureObj.sign_issue_at,
        nonce: signatureObj.sign_nonce,
        address: signatureObj.sign_address,
      },
    })
      .then((res) => {
        if (!res.ok || res.statusCode === 500) {
          return res.json().then((err) => {
            console.log(err);
            throw new Error(err.errorMessage);
          });
        }
        return res.json().then((response) => {
          if (response.statusCode === 500) {
            throw new Error('something went wrong');
          }

          swal({
            title: 'Submitted',
            text: 'Airspace Registered Successfully',
            icon: 'success',
            button: 'Ok',
          }).then(() => {
            dispatch(counterActions.closeAdditionalInfoModal());
            // setIsLoading(false);
            router.push('/homepage/dashboard');
          });
        });
      })
      .catch((error) => {
        console.log(error);
        const err = error.toString().split(':');
        setIsLoading(false);
        swal({
          title: 'Oops!',
          text: err[1] || 'Something went wrong. Kindly try again',
        });
      });
  };

  return (
    <div
      className='fixed z-20 overflow-y-auto rounded bg-white py-10'
      style={{
        width: '740px',
        height: '90vh',
        maxHeight: '908px',
        top: '7vh',
        left: 'calc(50% - 370px)',
      }}
    >
      <button onClick={closeModalHandler} className='absolute right-3 top-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='34'
          height='34'
          viewBox='0 0 34 34'
          fill='none'
        >
          <path
            d='M12.7279 12.7285L21.2132 21.2138'
            stroke='#252530'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12.7279 21.2138L21.2132 12.7285'
            stroke='#252530'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      <h3 className='pt-6 text-center font-semibold'>AirSpace Details</h3>
      <form className='px-10'>
        <div className='flex flex-row items-center justify-between gap-8 px-14 pb-5'>
          <div style={{ width: '114px' }} className='mt-9'>
            <p className='font-medium'>Title</p>
            <p className='text-xs'>
              Give a unique name to the AirSpace for easy identification
            </p>
          </div>
          <input
            ref={airspaceTitleRef}
            type='text'
            placeholder='AirSpace Title'
            style={{ width: '383px', height: '27px' }}
            className='rounded-sm bg-light-blue ps-2 placeholder:text-sml placeholder:text-light-brown focus:outline-blue-200'
            name='AirSpace Title'
          />
        </div>
        <hr />
        <div className='flex flex-row items-center gap-8 px-14 pb-5 pt-5'>
          <div className='flex flex-row items-center gap-1'>
            {airspaceStatus === 'Available' && (
              <input
                name='monday'
                type='checkbox'
                onChange={costCheckedHandler}
                checked={costChecked}
                className='cursor-pointer'
              />
            )}
            <label
              htmlFor='AirSpace Title'
              onClick={costCheckedHandler}
              className='me-10 cursor-pointer font-medium'
            >
              Variable Rental Range (per transit)
            </label>
          </div>
          <select
            defaultValue='$0.01 - $99.00'
            disabled={airspaceStatus !== 'Available' || !costChecked}
            className='rounded-sm bg-light-blue ps-2 text-sml text-dark-brown placeholder:text-sml placeholder:text-light-brown'
            style={{ width: '180px', height: '27px' }}
          >
            <option>$0.01 - $99.00</option>
          </select>
        </div>
        <hr />
        <div className='flex flex-row items-center justify-start gap-3 px-14 pb-5 pt-3'>
          <div style={{ width: '147px' }} className=''>
            <p className='font-medium'>Facilities</p>
            <p className='text-xs'>
              Select the extra features your facility provides
            </p>
          </div>
          <div className='ps-1'>
            <div className='flex flex-row items-center justify-start gap-2'>
              <input
                type='checkbox'
                onChange={deckCheckedHandler}
                checked={deckChecked}
                value={deck}
                name='hour'
                min='1'
                style={{ height: '27px' }}
                className='w-4 cursor-pointer rounded-sm bg-light-blue ps-2 checked:bg-blue-500'
              />
              <label
                htmlFor='hour'
                onClick={deckCheckedHandler}
                className='cursor-pointer text-sml text-dark-brown'
              >
                Landing Deck
              </label>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <input
                type='checkbox'
                onChange={stationHandler}
                checked={stationChecked}
                name='hour'
                min='1'
                style={{ height: '27px' }}
                className='w-4 cursor-pointer rounded-sm bg-light-blue ps-2 checked:bg-blue-500'
              />
              <label
                htmlFor='hour'
                onClick={stationHandler}
                className='cursor-pointer text-sml text-dark-brown'
              >
                Charging station
              </label>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <input
                type='checkbox'
                onChange={storageHandler}
                checked={storageChecked}
                value={storage}
                name='hour'
                min='1'
                style={{ height: '27px' }}
                className='w-4 cursor-pointer rounded-sm bg-light-blue ps-2 checked:bg-blue-500'
              />
              <label
                htmlFor='hour'
                onClick={storageHandler}
                className='cursor-pointer text-sml text-dark-brown'
              >
                Storage Hub
              </label>
            </div>
          </div>
        </div>
        <hr />
        <div className='flex flex-row items-start gap-36 px-14 pb-2 pt-3'>
          <div>
            <div style={{ width: '138px' }} className=''>
              <p className='font-medium'>Status</p>
              <p className='text-xs'>Give your AirSpace a Status</p>
              <select
                defaultValue='Available'
                onChange={airspaceStatusHandler}
                className='mt-2 rounded-sm bg-light-blue ps-2 text-sml text-dark-brown placeholder:text-sml placeholder:text-light-brown'
                style={{ width: '143px', height: '27px' }}
              >
                <option disabled>Status</option>
                <option>Available</option>
                <option>No-fly zone</option>
              </select>
            </div>
            <div style={{ width: '138px' }} className='mt-10'>
              <TimezoneSelectComponent
                onChange={(e) => {
                  setTimezone(e.target.value);
                }}
                timeZone={timezone}
                disable={airspaceStatus !== 'Available'}
              />
            </div>
          </div>
          {airspaceStatus === 'Available' && (
            <div>
              <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row gap-1'>
                  {airspaceStatus === 'Available' && (
                    <input
                      name='monday'
                      checked={monAvailable}
                      disabled={airspaceStatus !== 'Available'}
                      onChange={() => setMonAvailable(!monAvailable)}
                      type='checkbox'
                      className='cursor-pointer'
                    />
                  )}
                  <label
                    htmlFor='monday'
                    className='cursor-pointer text-sml'
                    onClick={() => setMonAvailable(!monAvailable)}
                  >
                    Mon
                  </label>
                </div>
                <TimeSelect
                  disable={!monAvailable || airspaceStatus !== 'Available'}
                  fromChange={(value) => {
                    setFromMonday(value);
                  }}
                  toChange={(value) => {
                    setToMonday(value);
                  }}
                />
              </div>
              <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row gap-1'>
                  {airspaceStatus === 'Available' && (
                    <input
                      name='tuesday'
                      checked={tueAvailable}
                      disabled={airspaceStatus !== 'Available'}
                      onChange={() => setTueAvailable(!tueAvailable)}
                      type='checkbox'
                      className='cursor-pointer'
                    />
                  )}
                  <label
                    htmlFor='tuesday'
                    onClick={() => setTueAvailable(!tueAvailable)}
                    className='cursor-pointer text-sml'
                  >
                    Tue
                  </label>
                </div>
                <TimeSelect
                  disable={!tueAvailable || airspaceStatus !== 'Available'}
                  fromChange={(value) => {
                    setFromTuesday(value);
                  }}
                  toChange={(value) => {
                    setToTuesday(value);
                  }}
                />
              </div>
              <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row gap-1'>
                  {airspaceStatus === 'Available' && (
                    <input
                      checked={wedAvailable}
                      disabled={airspaceStatus !== 'Available'}
                      onChange={() => setWedAvailable(!wedAvailable)}
                      name='wednesday'
                      type='checkbox'
                      className='cursor-pointer'
                    />
                  )}
                  <label
                    htmlFor='wednesday'
                    onClick={() => setWedAvailable(!wedAvailable)}
                    className='cursor-pointer text-sml'
                  >
                    Wed
                  </label>
                </div>
                <TimeSelect
                  disable={!wedAvailable || airspaceStatus !== 'Available'}
                  fromChange={(value) => {
                    setFromWednesday(value);
                  }}
                  toChange={(value) => {
                    setToWednesday(value);
                  }}
                />
              </div>
              <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row gap-1'>
                  {airspaceStatus === 'Available' && (
                    <input
                      name='thursday'
                      checked={thuAvailable}
                      disabled={airspaceStatus !== 'Available'}
                      onChange={() => setThuAvailable(!thuAvailable)}
                      type='checkbox'
                      className='cursor-pointer'
                    />
                  )}
                  <label
                    htmlFor='thursday'
                    className='cursor-pointer text-sml'
                    onClick={() => setThuAvailable(!thuAvailable)}
                  >
                    Thu
                  </label>
                </div>
                <TimeSelect
                  disable={!thuAvailable || airspaceStatus !== 'Available'}
                  fromChange={(value) => {
                    setFromThursday(value);
                  }}
                  toChange={(value) => {
                    setToThursday(value);
                  }}
                />
              </div>
              <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row gap-1'>
                  {airspaceStatus === 'Available' && (
                    <input
                      checked={friAvailable}
                      disabled={airspaceStatus !== 'Available'}
                      name='friday'
                      onChange={() => setFriAvailable(!friAvailable)}
                      type='checkbox'
                      className='cursor-pointer'
                    />
                  )}
                  <label
                    className='cursor-pointer text-sml'
                    htmlFor='friday'
                    onClick={() => setFriAvailable(!friAvailable)}
                  >
                    Fri
                  </label>
                </div>
                <TimeSelect
                  disable={!friAvailable || airspaceStatus !== 'Available'}
                  fromChange={(value) => {
                    setFromFriday(value);
                  }}
                  toChange={(value) => {
                    setToFriday(value);
                  }}
                />
              </div>
              <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row gap-1'>
                  {airspaceStatus === 'Available' && (
                    <input
                      name='saturday'
                      checked={satAvailable}
                      disabled={airspaceStatus !== 'Available'}
                      onChange={() => setSatAvailable(!satAvailable)}
                      type='checkbox'
                      className='cursor-pointer'
                    />
                  )}
                  <label
                    htmlFor='saturday'
                    onClick={() => setSatAvailable(!satAvailable)}
                    className='cursor-pointer text-sml'
                  >
                    Sat
                  </label>
                </div>
                <TimeSelect
                  disable={!satAvailable || airspaceStatus !== 'Available'}
                  fromChange={(value) => {
                    setFromSaturday(value);
                  }}
                  toChange={(value) => {
                    setToSaturday(value);
                  }}
                />
              </div>
              <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row gap-1'>
                  {airspaceStatus === 'Available' && (
                    <input
                      checked={sunAvailable}
                      name='sunday'
                      disabled={airspaceStatus !== 'Available'}
                      onChange={() => setSunAvailable(!sunAvailable)}
                      type='checkbox'
                      className='cursor-pointer'
                    />
                  )}
                  <label
                    htmlFor='sunday'
                    onClick={() => setSunAvailable(!sunAvailable)}
                    className='cursor-pointer text-sml'
                  >
                    Sun
                  </label>
                </div>
                <TimeSelect
                  disable={!sunAvailable || airspaceStatus !== 'Available'}
                  fromChange={(value) => {
                    setFromSunday(value);
                  }}
                  toChange={(value) => {
                    setToSunday(value);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className='mt-8 flex flex-row items-center justify-center gap-5'>
          <button
            onClick={closeModalHandler}
            disabled={isLoading}
            className={`${
              isLoading ? 'cursor-wait' : 'cursor-pointer'
            } rounded-md text-dark-blue`}
            style={{
              border: '1px solid #0653EA',
              width: '120px',
              height: '40px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={formSubmitHandler}
            disabled={isLoading}
            className={`${
              isLoading ? 'cursor-wait' : 'cursor-pointer'
            } rounded-md bg-dark-blue text-white`}
            style={{ width: '120px', height: '40px' }}
          >
            {isLoading ? 'Submiting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalAispaceInformation;
