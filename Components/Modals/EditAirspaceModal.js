
import { Fragment, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import swal from 'sweetalert';

import TimeSelect from '../TimeSelect';
import TimezoneSelectComponent from '../Timezone';
import { setAdditionalInfoModal } from '@/redux/slices/userSlice';
import PropertiesService from "@/services/PropertiesService";
import { counterActions } from '@/store/store';

const EditAispaceModal = (props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [costChecked, setCostChecked] = useState(props.variable);
  const [deckChecked, setDeckChecked] = useState(props.deck);
  const [stationChecked, setStationChecked] = useState(props.station);
  const [storageChecked, setStorageChecked] = useState(props.storage);

  const [negotiable, setNegotiable] = useState(false);
  const [deck, setDeck] = useState('');
  // const [station, setStation] = useState("");
  const [storage, setStorage] = useState('');
  const [rentAirspace, setRentAirspace] = useState('');
  const [sellAirspace, setSellAirspace] = useState('');
  const [airspaceStatus, setAirspaceStatus] = useState(props.status);
  const [monAvailable, setMonAvailable] = useState(props.weeks[0].isAvailable);
  const [tueAvailable, setTueAvailable] = useState(props.weeks[1].isAvailable);
  const [wedAvailable, setWedAvailable] = useState(props.weeks[2].isAvailable);
  const [thuAvailable, setThuAvailable] = useState(props.weeks[3].isAvailable);
  const [friAvailable, setFriAvailable] = useState(props.weeks[4].isAvailable);
  const [satAvailable, setSatAvailable] = useState(props.weeks[5].isAvailable);
  const [sunAvailable, setSunAvailable] = useState(props.weeks[6].isAvailable);
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
  const [timezone, setTimezone] = useState(props.timeZone);

  const airspaceTitleRef = useRef();
  const { updateClaimedProperty } = PropertiesService();

  const dispatch = useDispatch();

  const closeModalHandler = (e) => {
    e.preventDefault();
    dispatch(counterActions.setAdditionalInfoModal(false));
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

  const rentHandler = () => {
    setRentChecked(!rentChecked);
  };

  const sellHandler = () => {
    setSellChecked(!sellChecked);

    if (!sellChecked) {
      setSellAirspace('Sell AirSpace');
    } else {
      setSellAirspace('');
    }
  };

  const airspaceStatusHandler = (e) => {
    setAirspaceStatus(!airspaceStatus);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const airspaceTitle = airspaceTitleRef.current.value;

      const weekDayRanges = [
        {
          weekDayId: 0,
          fromTime: +fromMonday,
          toTime: +toMonday,
          isAvailable: monAvailable && !airspaceStatus ? true : false,
        },
        {
          weekDayId: 1,
          fromTime: +fromTuesday,
          toTime: +toTuesday,
          isAvailable: tueAvailable && !airspaceStatus ? true : false,
        },
        {
          weekDayId: 2,
          fromTime: +fromWednesday,
          toTime: +toWednesday,
          isAvailable: wedAvailable && !airspaceStatus ? true : false,
        },
        {
          weekDayId: 3,
          fromTime: +fromThursday,
          toTime: +toThursday,
          isAvailable: thuAvailable && !airspaceStatus ? true : false,
        },
        {
          weekDayId: 4,
          fromTime: +fromFriday,
          toTime: +toFriday,
          isAvailable: friAvailable && !airspaceStatus ? true : false,
        },
        {
          weekDayId: 5,
          fromTime: +fromSaturday,
          toTime: +toSaturday,
          isAvailable: satAvailable && !airspaceStatus ? true : false,
        },
        {
          weekDayId: 6,
          fromTime: +fromSunday,
          toTime: +toSunday,
          isAvailable: sunAvailable && !airspaceStatus ? true : false,
        },
      ];

      setIsLoading(true);

      const responseData = await updateClaimedProperty({
        ownerId: props.user.id,
        propertyId: props.id,
        title: airspaceTitle,
        transitFee: '$0.01 - $99.00',
        hasStorageHub: storageChecked,
        hasLandingDeck: deckChecked,
        hasChargingStation: stationChecked,
        isFixedTransitFee: costChecked,
        noFlyZone: !airspaceStatus ? false : true,
        weekDayRanges,
        timezone: !airspaceStatus ? timezone : 'GMT',
      })

      if (responseData & !responseData.errorMessage) { 
        swal({
          title: 'Submitted',
          text: 'Airspace record updated successfully',
          icon: 'success',
          button: 'Ok',
        }).then(() => {
          dispatch(counterActions.setAdditionalInfoModal(false));
          // setIsLoading(false);
          router.push('/homepage/dashboard2');
        });
      } else if (responseData && responseData.errorMessage) {
        toast.error(responseData.errorMessage);
      } else {
        swal({
          title: 'Oops!',
          text: 'Something went wrong. Kindly try again',
        });
      }
    } catch (error) {
      console.error(error);
      const err = error.toString().split(':');
      swal({
        title: 'Oops!',
        text: err[1] || 'Something went wrong. Kindly try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      {/* {isLoading && createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
        {isLoading && createPortal(<Spinner />, document.getElementById("backdrop-root"))} */}
      <div
        className='fixed z-20 overflow-y-auto rounded bg-white py-10'
        style={{
          width: '740px',
          height: '90vh',
          maxHeight: '908px',
          top: '7vh', // This is for live environment
          left: 'calc(50% - 370px)',
        }}
      >
        <button onClick={props.onClose} className='absolute right-3 top-3'>
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
              defaultValue={props.title}
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
              {!airspaceStatus && (
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
              disabled={airspaceStatus || !costChecked}
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
                  defaultValue={airspaceStatus ? 'No-fly zone' : 'Available'}
                  onChange={airspaceStatusHandler}
                  className='mt-2 rounded-sm bg-light-blue ps-2 text-sml text-dark-brown placeholder:text-sml placeholder:text-light-brown'
                  style={{ width: '143px', height: '27px' }}
                >
                  <option disabled>Status</option>
                  <option>Available</option>
                  <option>No-fly zone</option>
                </select>
              </div>
              {/* <div className="flex flex-row justify-center mt-10 -ms-14 items-center"> */}
              <div style={{ width: '138px' }} className='mt-10'>
                <TimezoneSelectComponent
                  onChange={(e) => {
                    setTimezone(e.target.value);
                  }}
                  timeZone={props.timeZone}
                  disable={airspaceStatus}
                />
              </div>
            </div>
            {!airspaceStatus && (
              <div>
                <div className='mb-1 flex flex-row items-center justify-between gap-2'>
                  <div className='flex flex-row gap-1'>
                    {!airspaceStatus && (
                      <input
                        name='monday'
                        checked={monAvailable}
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
                    disable={airspaceStatus || !monAvailable}
                    timeSelect={
                      !airspaceStatus && monAvailable && props.weeks[0].fromTime
                    }
                    toTimeSelect={
                      !airspaceStatus && monAvailable && props.weeks[0].toTime
                    }
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
                    {!airspaceStatus && (
                      <input
                        name='tuesday'
                        checked={tueAvailable}
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
                    disable={airspaceStatus || !tueAvailable}
                    timeSelect={
                      !airspaceStatus && tueAvailable && props.weeks[1].fromTime
                    }
                    toTimeSelect={
                      !airspaceStatus && tueAvailable && props.weeks[1].toTime
                    }
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
                    {!airspaceStatus && (
                      <input
                        checked={wedAvailable}
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
                    disable={airspaceStatus || !wedAvailable}
                    timeSelect={
                      !airspaceStatus && wedAvailable && props.weeks[2].fromTime
                    }
                    toTimeSelect={
                      !airspaceStatus && wedAvailable && props.weeks[2].toTime
                    }
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
                    {!airspaceStatus && (
                      <input
                        name='thursday'
                        checked={thuAvailable}
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
                    disable={airspaceStatus || !thuAvailable}
                    timeSelect={
                      !airspaceStatus && thuAvailable && props.weeks[3].fromTime
                    }
                    toTimeSelect={
                      !airspaceStatus && thuAvailable && props.weeks[3].toTime
                    }
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
                    {!airspaceStatus && (
                      <input
                        checked={friAvailable}
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
                    disable={airspaceStatus || !friAvailable}
                    timeSelect={
                      !airspaceStatus && friAvailable && props.weeks[4].fromTime
                    }
                    toTimeSelect={
                      !airspaceStatus && friAvailable && props.weeks[4].toTime
                    }
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
                    {!airspaceStatus && (
                      <input
                        name='saturday'
                        checked={satAvailable}
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
                    disable={airspaceStatus || !satAvailable}
                    timeSelect={
                      !airspaceStatus && satAvailable && props.weeks[5].fromTime
                    }
                    toTimeSelect={
                      !airspaceStatus && satAvailable && props.weeks[5].toTime
                    }
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
                    {!airspaceStatus && (
                      <input
                        checked={sunAvailable}
                        name='sunday'
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
                    disable={airspaceStatus || !sunAvailable}
                    timeSelect={
                      !airspaceStatus && sunAvailable && props.weeks[6].fromTime
                    }
                    toTimeSelect={
                      !airspaceStatus && sunAvailable && props.weeks[6].toTime
                    }
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
              onClick={props.onClose}
              disabled={isLoading}
              className={`${isLoading ? 'cursor-wait' : 'cursor-pointer'
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
              className={`${isLoading ? 'cursor-wait' : 'cursor-pointer'
                } rounded-md bg-dark-blue text-white`}
              style={{ width: '120px', height: '40px' }}
            >
              {isLoading ? 'Submiting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default EditAispaceModal;
