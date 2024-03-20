import React ,{Fragment,useState} from "react";
import {ArrowLeftIcon,CloseIcon,LocationPointIcon} from '@/Components/Icons'
import Link from "next/link";
import { InfoIcon, MagnifyingGlassIcon } from "@/Components/Icons";


const Toggle = ({ checked, setChecked }) => {
  return (
      <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer" checked={checked} onClick={setChecked} />
          <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
  )
}

const TimeZoneSelect = ({ timeZone, setTimeZone }) => {
  const utcOffsets = Array.from({ length: 24 }, (_, index) => index - 11);

  const handleTimeZoneChange = (event) => {
      const selectedTimeZone = event.target.value;
      setTimeZone(selectedTimeZone);
  };

  return (
      <Fragment>
          <label htmlFor="timeZone" className="font-normal text-[14px] text-[#838187]">Time Zone<span className="text-[#E04F64]">*</span></label>
          <select value={timeZone} onChange={handleTimeZoneChange} name="timeZone" id="timeZone" className="w-full rounded-lg py-[16px] px-[22px] text-[#222222] text-[14px] font-normal appearance-none focus:outline-none" style={{ border: "1px solid #87878D" }} >
              {utcOffsets.map((offset) => (
                  <option key={offset} value={`UTC${offset >= 0 ? '+' : ''}${offset}`}>
                      {`UTC${offset >= 0 ? '+' : ''}${offset}`}
                  </option>
              ))}
          </select>
      </Fragment>
  );
}


const VariableFeeRentalRangesSelect = ({ fee, setFee }) => {
  const handleVariableFeeRentalRangeChange = (event) => {
      const selectedFee = event.target.value;
      setFee(selectedFee);
  };

  return (
      <Fragment>
          <label htmlFor="variableFeeRentalRange" className="font-normal text-[14px] text-[#838187]">Variable Fee Rental Range (per transit)<span className="text-[#E04F64]">*</span></label>
          <select value={fee} onChange={handleVariableFeeRentalRangeChange} name="variableFeeRentalRange" id="variableFeeRentalRange" className="w-full rounded-lg py-[16px] px-[22px] text-[#222222] text-[14px] font-normal appearance-none focus:outline-none" style={{ border: "1px solid #87878D" }}>
              <option value="1-99" >$1-$99</option>
              <option value="100-199">$100-$199</option>
              <option value="200-299">$200-$299</option>
              <option value="300-399">$300-$399</option>
              <option value="400-499">$400-$499</option>
              <option value="500-599">$500-$599</option>
          </select>
      </Fragment>
  )
}

const WeekDayRangesForm = ({ weekDayRanges, setWeekDayRanges }) => {
  const weekDays = ["SUNDAYS", "MONDAYS", "TUESDAYS", "WEDNESDAYS", "THURSDAYS", "FRIDAYS", "SATURDAYS"];

  const options = Array.from({ length: 25 });

  const handleToggle = (day) => {
      const weekDayRangesCopy = JSON.parse(JSON.stringify(weekDayRanges));
      weekDayRangesCopy[day].isAvailable = !weekDayRangesCopy[day].isAvailable;
      setWeekDayRanges(weekDayRangesCopy);
  }

  const handleFromTimeChange = (day, time) => {
      const weekDayRangesCopy = JSON.parse(JSON.stringify(weekDayRanges));
      weekDayRangesCopy[day].fromTime = time;
      setWeekDayRanges(weekDayRangesCopy);
  }

  const handleToTimeChange = (day, time) => {
      const weekDayRangesCopy = JSON.parse(JSON.stringify(weekDayRanges));
      weekDayRangesCopy[day].toTime = time;
      setWeekDayRanges(weekDayRangesCopy);
  }

  return (
      weekDays.map((day, index) => {
          const isDayAvailable = weekDayRanges[index].isAvailable;

          return (
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[15px] pr-[32px]">
                      <Toggle checked={isDayAvailable} setChecked={() => handleToggle(index)} />
                      <p>{day}</p>
                  </div>
                  <div className="flex items-center gap-[66px]">
                      <select disabled={!isDayAvailable} value={weekDayRanges[index].fromTime} onChange={(e) => handleFromTimeChange(index, +e.target.value)} name={`${index}/start`} id={`${index}/start`} className="rounded-lg py-[5px] px-[22px] text-[#87878D] text-[14px] font-normal appearance-none focus:outline-none" style={{ border: "1px solid #87878D" }}>
                          {options.map((_, index) => (
                              <option value={index}>{index.toString().padStart(2, '0')}:00</option>
                          ))}
                      </select>
                      <p>to</p>
                      <select disabled={!isDayAvailable} value={weekDayRanges[index].toTime} onChange={(e) => handleToTimeChange(index, +e.target.value)} name={`${index}/end`} id={`${index}/end`} className="rounded-lg py-[5px] px-[22px] text-[#87878D] text-[14px] font-normal appearance-none focus:outline-none" style={{ border: "1px solid #87878D" }}>
                          {options.map((_, index) => (
                              <option value={index}>{index.toString().padStart(2, '0')}:00</option>
                          ))}
                      </select>
                  </div>
              </div>
          )
      })
  )
}

const EditAddAirspaceModal = ({ onCloseModal, data, setData, onClaim }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false)
    const[isLoading,setIsLoading] = useState(false);
    const handleClaim = async (event) =>{
        setIsLoading(true);
        await onClaim(event);
        setIsLoading(false)
    }
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white  md:rounded-[30px]  w-full max-h-screen h-screen md:max-h-[600px] md:h-auto overflow-y-auto overflow-x-auto md:w-[689px] z-50 flex flex-col gap-[15px] short-scrollbar">
          <div className="z-[100] sticky top-0 left-0 right-0 bg-white py-[20px] px-[29px] -mt-[1px]      md:shadow-none" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <div className="relative flex items-center gap-[20px] md:p-0">
                <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}><ArrowLeftIcon /></div>
                    <h2 className="text-[#222222] text-center font-medium text-xl">Claim Airspace</h2>
                    <div onClick={onCloseModal} className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"><CloseIcon /></div>
                </div>
            </div>
            <div className="px-[29px]">

            <div className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg" style={{ border: "1px solid #4285F4" }}>
                <div className="w-6 h-6"><LocationPointIcon /></div>
                <p className="font-normal text-[#222222] text-[14px] flex-1">{data?.address}</p>
            </div>
            <div className="flex flex-col gap-[5px]">
                <label htmlFor="name">Name of airspace<span className="text-[#E04F64]">*</span></label>
                <input value={data?.title} onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))} className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222]" style={{ border: '1px solid #87878D' }} type="text" name="name" id="name" autoComplete="off" />
            </div>
            <div className="flex flex-col gap-[10px]">
                <p className="text-[14px] font-normal text-[#838187]">Are you looking to Rent or Sell your airspace?</p>
                <div className="flex items-center gap-[7px]">
                <input className='h-[18px] w-[18px] cursor-pointer' type='checkbox' id='rent' name='rent' checked={data?.rent}
            onChange={() =>
              setData((prev) => {
                const newData = { ...prev, rent: !prev.rent };
                newData.sell = false;
                return newData;
              })
            }
          />
          Rent
          <input className='h-[18px] w-[18px] cursor-pointer' disabled={true} type='checkbox' id='sell' name='sell' checked={data.sell}
            onChange={() =>
              setData((prev) => {
                const newData = { ...prev, sell: !prev.sell };
                newData.rent = false;
                return newData;
              })
            }
          />
          Sell
                </div>

            </div>
            {data.rent && (
                <Fragment>
                    <h2 className="text-[#222222] font-normal text-[20px]">Rental Details</h2>
                    <Link target="_blank" href={"https://skytrade.tawk.help"} className="text-[#0653EA] text-[14px] font-normal cursor-pointer">Learn more about rentals in our FAQ.</Link>
                    <div className="flex items-center justify-between gap-[15px]">
                        <div className="flex-1">
                            {data?.transitFee && <VariableFeeRentalRangesSelect fee={data.transitFee} setFee={(fee) => setData(prev => ({ ...prev, transitFee: '' + fee }))} />}
                        </div>
                        <div className="flex-1">
                            {data?.timeZone && <TimeZoneSelect timeZone={data?.timezone} setTimeZone={(timezone) => setData(prev => ({ ...prev, timezone }))} />}
                        </div>
                    </div>
                    <div className="flex flex-col gap-[10px]">
                        <p className="text-[14px] font-normal text-[#838187]">Select extra features your facility provides<span className="text-[#E04F64]">*</span></p>
                        <div className="flex items-center gap-[10px]">
                            <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="hasLandingDeck" name="hasLandingDeck" checked={data.hasLandingDeck} onChange={() => setData(prev => ({ ...prev, hasLandingDeck: !prev.hasLandingDeck }))} />
                            <p className="text-[#87878D] text-[14px] font-normal">Landing Deck</p>
                            <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="hasChargingStation" name="hasChargingStation" checked={data.hasChargingStation} onChange={() => setData(prev => ({ ...prev, hasChargingStation: !prev.hasChargingStation }))} />
                            <p className="text-[#87878D] text-[14px] font-normal">Charging Station</p>
                            <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="hasStorageHub" name="hasStorageHub" checked={data.hasStorageHub} onChange={() => setData(prev => ({ ...prev, hasStorageHub: !prev.hasStorageHub }))} />
                            <p className="text-[#87878D] text-[14px] font-normal">Storage Hub</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[15px]">
                        <p>Availability<span className="text-[#E04F64]">*</span></p>
                        {data?.weekDayRanges && <WeekDayRangesForm weekDayRanges={data?.weekDayRanges} setWeekDayRanges={(weekDayRanges) => setData(prev => ({ ...prev, weekDayRanges }))} />}
                    </div>
                </Fragment>
            )}
            {data.sell && (
                <Fragment>
                    <div className="flex items-center gap-[7.5px]">
                        <h2 className="text-[#222222] font-normal text-[20px]">Selling Details</h2>
                        <div onClick={() => setIsInfoVisible(prev => !prev)} className="relative w-[20px] h-[20px] flex justify-center items-center">
                            <InfoIcon />
                            {isInfoVisible && <div className="absolute -top-4 left-6 w-[189px] bg-[#CCE3FC] rounded-[4px] p-[12px] font-normal text-[10px] italic">Note that rental availability are not applicable to your selling</div>}
                        </div>
                    </div>
                    <Link href={'https://skytrade.tawk.help'} className="text-[#0653EA] text-[14px] font-normal cursor-pointer">Learn more about selling in our FAQ.</Link>
                    <div className="flex flex-col gap-[5px]">
                        <label className="font-normal text-[#838187] text-[14px]" htmlFor="sellingPrice">Selling Price</label>
                        <div className='relative'>
                            <span class='absolute inset-y-0 left-0 flex items-center text-[14px] pl-[22px] text-[#222222] '>
                                $
                            </span>
                            <input
                                className='rounded-lg pl-[31px] w-full py-[16px] text-[14px] text-[#222222] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                style={{ border: '1px solid #87878D' }}
                                autoComplete='off'
                                type='number'
                                name='sellingPrice'
                                id='sellingPrice'
                            />
                        </div>
                        </div>
                </Fragment>
            )}

            <p className="text-[14px] font-normal text-[#838187]">Do you currently have zoning or planning permission to develop above your land or property? <span className="italic text-[10px]">(Your answer won't affect your claim)<span className="text-[#E04F64]">*</span></span> </p>
            <div className="flex items-center gap-[7px] text-[#87878D] text-[14px]">
            <input className='relative h-[16.67px] w-[16.67px] cursor-pointer bg-cover p-[2.5px]' checked={data?.hasPlanningPermission === 'true'}  onChange={() =>  setData((prev) => ({ ...prev, hasPlanningPermission: 'true' })) }
           style={{
            appearance: 'none',
            border:
              data?.hasPlanningPermission !== 'true'
                ? '2px solid #222222'
                : '2px solid #0653EA',
            backgroundColor:
              data?.hasPlanningPermission === 'true'
                ? '#0653EA'
                : 'transparent',
            borderRadius: '50%',
            backgroundClip: 'content-box',
          }}
          type='checkbox'
          name='individual'
          id='individual'
        />
        Yes
        <input className='relative h-[16.67px] w-[16.67px] cursor-pointer p-[2.5px]' checked={data.hasPlanningPermission === 'false'}
          onChange={() =>
            setData((prev) => ({ ...prev, hasPlanningPermission: 'false' }))
          }
          style={{
            appearance: 'none',
            border:
              data?.hasPlanningPermission !== 'false'
                ? '2px solid #222222'
                : '2px solid #0653EA',
            backgroundColor:
              data?.hasPlanningPermission === 'false' ? '#0653EA' : 'transparent',
            borderRadius: '50%',
            backgroundClip: 'content-box',
          }}
          type='checkbox'
          name='individual'
          id='individual'
        />
        No
        <input className='relative h-[16.67px] w-[16.67px] cursor-pointer p-[2.5px]' checked={!data.hasPlanningPermission}
          onChange={() =>
            setData((prev) => ({ ...prev, hasPlanningPermission: null }))
          }
          style={{
            appearance: 'none',
            border: data?.hasPlanningPermission
              ? '2px solid #222222'
              : '2px solid #0653EA',
            backgroundColor: !data?.hasPlanningPermission
              ? '#0653EA'
              : 'transparent',
            borderRadius: '50%',
            backgroundClip: 'content-box',
          }}
          type='checkbox'
          name='individual'
          id='individual'
        />
        I don't Know
            </div>
            <div className="flex items-center justify-center gap-[20px] text-[14px]">
                <div onClick={onCloseModal} className="rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer" style={{ border: "1px solid #0653EA" }}>Cancel</div>
                    <button disabled={isLoading} onClick={()=>handleClaim(event)} className="rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer">
                        {
                            isLoading ?
                            <svg class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            :
                            data?.id ? 'Edit' : 'Claim Airspace'
                        } 
                    </button>
            </div>
            </div>

        </div>
    )
}
export default EditAddAirspaceModal;