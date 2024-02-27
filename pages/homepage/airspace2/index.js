import { Fragment, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import Script from 'next/script';
import { InfoIcon, MagnifyingGlassIcon } from '@/Components/Icons';
import Sidebar from '@/Components/Sidebar';
import PageHeader from '@/Components/PageHeader';
import Spinner from '@/Components/Spinner';
import Backdrop from '@/Components/Backdrop';
import {
  HelpQuestionIcon,
  ArrowLeftIcon,
  CloseIcon,
  LocationPointIcon,
  SuccessIcon,
  EarthIcon,
} from '@/Components/Icons';
import useDatabase from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import Link from 'next/link';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import axios from "axios";
import Head from "next/head";

const Toggle = ({ checked, setChecked }) => {
  return (
    <label class='relative inline-flex cursor-pointer items-center'>
      <input
        type='checkbox'
        value=''
        class='peer sr-only'
        checked={checked}
        onClick={setChecked}
      />
      <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );
};

const TimeZoneSelect = ({ timeZone, setTimeZone }) => {
  const labelStyle = 'original';
  const timezones = {
    ...allTimezones,
    'Europe/Berlin': 'Frankfurt',
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const [selectedLabel, setSelectedLabel] = useState('Europe/London');
  const handleTimeZoneChange = (event) => {
    const selectedTimeZone = event.target.value;
    const parsedTimeZone = parseTimezone(selectedTimeZone);
    const gmtOffset = parsedTimeZone.offset;
    const gmtString =
      parseInt(gmtOffset) >= 0 ? `GMT+${gmtOffset}` : `GMT${gmtOffset}`;

    setTimeZone(gmtString);
    setSelectedLabel(selectedTimeZone);
  };


  return (
    <Fragment>
      <label
        htmlFor='timeZone'
        className='text-[14px] font-normal text-[#838187]'
      >
        Time Zone<span className='text-[#E04F64]'>*</span>
      </label>
      <select
        value={selectedLabel}
        onChange={handleTimeZoneChange}
        name='timeZone'
        id='timeZone'
        className='w-full appearance-none rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#222222] focus:outline-none'
        style={{ border: '1px solid #87878D' }}
      >
        {options.map((geographicTimeZone) => (
          <option
            key={geographicTimeZone.value}
            value={geographicTimeZone.value}
          >
            {`${geographicTimeZone.label} ${geographicTimeZone.value}`}
          </option>
        ))}
      </select>
      
    </Fragment>
  );
};

const VariableFeeRentalRangesSelect = ({ fee, setFee }) => {
  const handleVariableFeeRentalRangeChange = (event) => {
    const selectedFee = event.target.value;
    setFee(selectedFee);
  };

  return (
    <Fragment>
      <label
        htmlFor='variableFeeRentalRange'
        className='text-[14px] font-normal text-[#838187]'
      >
        Variable Fee Rental Range (per transit)
        <span className='text-[#E04F64]'>*</span>
      </label>
      <select
        value={fee}
        onChange={handleVariableFeeRentalRangeChange}
        name='variableFeeRentalRange'
        id='variableFeeRentalRange'
        className='w-full appearance-none rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#222222] focus:outline-none'
        style={{ border: '1px solid #87878D' }}
      >
        <option value='1-99'>$1-$99</option>
        <option value='100-199'>$100-$199</option>
        <option value='200-299'>$200-$299</option>
        <option value='300-399'>$300-$399</option>
        <option value='400-499'>$400-$499</option>
        <option value='500-599'>$500-$599</option>
      </select>
    </Fragment>
  );
};

const WeekDayRangesForm = ({ weekDayRanges, setWeekDayRanges }) => {
  const weekDays = [
    'SUNDAYS',
    'MONDAYS',
    'TUESDAYS',
    'WEDNESDAYS',
    'THURSDAYS',
    'FRIDAYS',
    'SATURDAYS',
  ];

  const options = Array.from({ length: 25 });

  const handleToggle = (day) => {
    const weekDayRangesCopy = JSON.parse(JSON.stringify(weekDayRanges));
    weekDayRangesCopy[day].isAvailable = !weekDayRangesCopy[day].isAvailable;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleFromTimeChange = (day, time) => {
    const weekDayRangesCopy = JSON.parse(JSON.stringify(weekDayRanges));
    weekDayRangesCopy[day].fromTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleToTimeChange = (day, time) => {
    const weekDayRangesCopy = JSON.parse(JSON.stringify(weekDayRanges));
    weekDayRangesCopy[day].toTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  return weekDays.map((day, index) => {
    const isDayAvailable = weekDayRanges[index].isAvailable;

    return (
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[15px] pr-[32px]'>
          <Toggle
            checked={isDayAvailable}
            setChecked={() => handleToggle(index)}
          />
          <p>{day}</p>
        </div>
        <div className='flex items-center gap-[66px]'>
          <select
            disabled={!isDayAvailable}
            value={weekDayRanges[index].fromTime}
            onChange={(e) => handleFromTimeChange(index, +e.target.value)}
            name={`${index}/start`}
            id={`${index}/start`}
            className='appearance-none rounded-lg px-[22px] py-[5px] text-[14px] font-normal text-[#87878D] focus:outline-none'
            style={{ border: '1px solid #87878D' }}
          >
            {options.map((_, index) => (
              <option value={index}>
                {index.toString().padStart(2, '0')}:00
              </option>
            ))}
          </select>
          <p>to</p>
          <select
            disabled={!isDayAvailable}
            value={weekDayRanges[index].toTime}
            onChange={(e) => handleToTimeChange(index, +e.target.value)}
            name={`${index}/end`}
            id={`${index}/end`}
            className='appearance-none rounded-lg px-[22px] py-[5px] text-[14px] font-normal text-[#87878D] focus:outline-none'
            style={{ border: '1px solid #87878D' }}
          >
            {options.map((_, index) => (
              <option value={index}>
                {index.toString().padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  });
};

const ClaimModal = ({ onCloseModal, data, setData, onClaim }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false)
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(37,37,48,0.45)] flex items-center justify-center z-50">
        <div className="px-8  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFFFFF]  md:rounded-[30px]  w-full max-h-screen h-screen md:max-h-[600px] md:h-auto overflow-y-auto overflow-x-auto md:w-[689px] z-50 flex flex-col gap-[15px] short-scrollbar">
                <div className=" z-[100] sticky top-0 left-0 right-0 py-[20px] px-[2opx] -mt-[1px] md:shadow-none bg-[#FFFFFF] ">
                    <div className="relative flex items-center gap-[20px] md:p-0">
                    <div className="  w-[16px] h-[12px] md:hidden" onClick={onCloseModal}><ArrowLeftIcon /></div>
                    <div className="flex gap-[5px] items-center">
                        <p className="text-xl font-medium text-[#222222]">Claim Airspace</p>
                        <div onClick={() => setIsInfoVisible(prev => !prev)} className="relative w-[20px] h-[20px] flex justify-center items-center">
                            <InfoIcon />
                            {isInfoVisible && <div className="absolute -top-4 left-6 w-[189px] bg-[#CCE3FC] rounded-[4px] p-[12px] font-normal text-[10px] italic">Note that we store your data securely with advanced encryption and strict authentication measures to ensure utmost privacy and protection.</div>}
                        </div>
                        <div onClick={onCloseModal} className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"><CloseIcon /></div>
                    </div>
                    </div>
                    </div>
                    <div className=" py-2">

                    <div className="mb-2 flex items-center gap-[10px] py-4 px-[22px] rounded-lg" style={{ border: "1px solid #4285F4" }}>
                        <div className="w-6 h-6"><LocationPointIcon /></div>
                        <p className="font-normal text-[#222222] text-[14px] flex-1">{data.address}</p>
                    </div>
                    <div className=" mb-2 flex flex-col gap-[5px]">
                        <label htmlFor="name">Name of airspace<span className="text-[#E04F64]">*</span></label>
                        <input value={data.name} onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))} className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222]" style={{ border: '1px solid #87878D' }} type="text" name="name" id="name" autoComplete="off" />
                    </div>
                    <div className=" mb-2 flex flex-col gap-[10px]">
                        <p className="text-[14px] font-normal text-[#838187]">Are you looking to Rent or Sell your airspace?</p>
                        <div className="flex items-center gap-[7px]">
                        <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="rent" name="rent" checked={data.rent}  onChange={() => setData(prev => ({ ...prev, rent: !prev.rent }))}/>
                         <label htmlFor="rent">Rent</label>
                            <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="sell" name="sell" checked={data.sell} onChange={() => setData(prev => ({ ...prev, sell: !prev.sell }))} />
                            <label htmlFor="sell">Sell</label>
                        </div>

                    </div>
                    {data.rent && (
                        <Fragment>
                            <h2 className="text-[#222222] font-normal text-[20px]">Rental Details</h2>
                            <Link target="_blank" href={"https://skytrade.tawk.help"} className="text-[#0653EA] text-[14px] font-normal cursor-pointer">Learn more about rentals in our FAQ.</Link>
                            <div className="flex items-center justify-between gap-[15px]">
                                <div className="flex-1">
                                    <VariableFeeRentalRangesSelect fee={data.transitFee} setFee={(fee) => setData(prev => ({ ...prev, transitFee: '' + fee }))} />
                                </div>
                                <div className="flex-1">
                                    <TimeZoneSelect timeZone={data.timezone} setTimeZone={(timezone) => setData(prev => ({ ...prev, timezone }))} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-[10px]">
                                <p className="text-[14px] font-normal text-[#838187]">Select extra features your facility provides<span className="text-[#E04F64]">*</span></p>
                                <div className="flex items-center gap-[10px]">
                                    <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="hasLandingDeck" name="hasLandingDeck" checked={data.hasLandingDeck} onChange={() => setData(prev => ({ ...prev, hasLandingDeck: !prev.hasLandingDeck }))} />
                                    <label htmlFor="hasLandingDeck" className="text-[#87878D] text-[14px] font-normal">Landing Deck</label>
                                    <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="hasChargingStation" name="hasChargingStation" checked={data.hasChargingStation} onChange={() => setData(prev => ({ ...prev, hasChargingStation: !prev.hasChargingStation }))} />
                                    <label htmlFor="hasChargingStation"  className="text-[#87878D] text-[14px] font-normal">Charging Station</label>
                                    <input className='w-[18px] h-[18px] cursor-pointer' type="checkbox" id="hasStorageHub" name="hasStorageHub" checked={data.hasStorageHub} onChange={() => setData(prev => ({ ...prev, hasStorageHub: !prev.hasStorageHub }))} />
                                    <label htmlFor="hasStorageHub"  className="text-[#87878D] text-[14px] font-normal">Storage Hub</label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[15px]">
                                <p>Availability<span className="text-[#E04F64]">*</span></p>
                                <WeekDayRangesForm weekDayRanges={data.weekDayRanges} setWeekDayRanges={(weekDayRanges) => setData(prev => ({ ...prev, weekDayRanges }))} />
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

                    <p className=" mb-2 text-[14px] font-normal text-[#838187]">Do you currently have zoning or planning permission to develop above your land or property? <span className="italic text-[10px]">(Your answer won't affect your claim)<span className="text-[#E04F64]">*</span></span> </p>
                    <div className=" mb-2 flex items-center gap-[7px] text-[#87878D] text-[14px]">
                        <input className='relative w-[16.67px] h-[16.67px] p-[2.5px] cursor-pointer bg-cover' checked={data.hasPlanningPermission} onChange={() => setData(prev => ({ ...prev, hasPlanningPermission: true }))} style={{ appearance: "none", border: !data.hasPlanningPermission ? "2px solid #222222" : "2px solid #0653EA", backgroundColor: data.hasPlanningPermission ? "#0653EA" : "transparent", borderRadius: "50%", backgroundClip: "content-box" }} type="checkbox" name="yes" id="yes" />
                        <label htmlFor="yes"> Yes</label>
                        <input className='relative w-[16.67px] h-[16.67px] p-[2.5px] cursor-pointer' checked={!data.hasPlanningPermission} onChange={() => setData(prev => ({ ...prev, hasPlanningPermission: false }))} style={{ appearance: "none", border: data.hasPlanningPermission ? "2px solid #222222" : "2px solid #0653EA", backgroundColor: !data.hasPlanningPermission ? "#0653EA" : "transparent", borderRadius: "50%", backgroundClip: "content-box" }} type="checkbox" name="no" id="no" />    
                        <label htmlFor="no">No</label>
                    </div>
                    <div className=" flex items-center justify-center gap-[20px] text-[14px]">
                        <button onClick={onCloseModal} className="rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer" style={{ border: "1px solid #0653EA" }}>Cancel</button>
                       <button onClick={onClaim} className="rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer">Claim Airspace</button>
                    </div>
                    </div>

                </div>
        </div>
       
    )
}

const Explorer = ({ address, setAddress, addresses, showOptions, handleSelectAddress, claimedProperty, onClaimAirspace, flyToAddress }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false);

    const displayClaimBtn = () => {
        if (claimedProperty){
            return (
                <div className=" max-w-[320px] max-h-full z-20">
                <div>
                <h1 className="mt-2 text-[20px] font-medium text-[#222222] text-center">My Airspaces</h1>
                </div>
                    <div className="space-x-4 px-4 py-4 w-full mt-2  border flex items-center  bg-[#FFFFFF] rounded-lg  cursor-pointer  ">
                    
                      <div className=" w-6 h-6"><LocationPointIcon /></div>
                        <p className="flex-1 min-w-0 font-normal text-[#222222] text-[15px] overflow-hidden whitespace-nowrap overflow-ellipsis">{claimedProperty.name} </p>
                       <div  className="w-4 h-4" ><ChevronRightIcon /></div>
                        
                    </div>
            </div>
            )
        } else if(flyToAddress){
            return (
                <div onClick={onClaimAirspace} className="bg-[#0653EA] text-white rounded-lg py-[16px] text-center text-[15px] font-normal cursor-pointer w-full">Claim Airspace</div>
            )
        }
    }

    return (
        <div className="hidden md:flex bg-[#FFFFFFCC] py-[43px] px-[29px] rounded-[30px] flex-col items-center gap-[15px] max-w-[362px] max-h-full z-20 m-[39px]" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <div className="flex gap-[5px] items-center">
                <p className="text-xl font-medium text-[#222222]">Claim Airspace</p>
                <div onClick={() => setIsInfoVisible(prev => !prev)} className="relative w-[20px] h-[20px] flex justify-center items-center">
                    <InfoIcon />
                    {isInfoVisible && <div className="absolute -top-4 left-6 w-[189px] bg-[#CCE3FC] rounded-[4px] p-[12px] font-normal text-[10px] italic">Note that we store your data securely with advanced encryption and strict authentication measures to ensure utmost privacy and protection.</div>}
                </div>
            </div>
            <p className="text-[15px] font-normal text-[#222222]">Ready to claim your airspace? No registered airspace yet, but exciting times ahead!</p>
            <div className="relative px-[22px] py-[16px] bg-white rounded-lg w-full" style={{ border: "1px solid #87878D" }}>
                <input autoComplete="off" value={address} onChange={(e) => setAddress(e.target.value)} type="text" name="searchAirspaces" id="searchAirspaces" placeholder="Search Airspaces" className="outline-none w-full pr-[20px]" />
                <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
                    <MagnifyingGlassIcon />
                </div>
                {showOptions && (
                    <div className="absolute top-[55px] left-0 bg-white w-full flex-col">
                        {addresses.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    value={item.place_name}
                                    onClick={() => handleSelectAddress(item.place_name)}
                                    className='p-5 text-left text-[#222222] w-full'
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
            {displayClaimBtn()}
        </div>
    )
}


const ExplorerMobile = ({ address, setAddress, addresses, showOptions, handleSelectAddress, onClaimAirspace, flyToAddress, onGoBack }) => {

    return (
        <div className="flex bg-white items-center gap-[15px] py-[19px] px-[21px] z-[40]">
            <div onClick={onGoBack} className="flex items-center justify-center w-6 h-6"><ArrowLeftIcon /></div>
            <div className="relative px-[22px] py-[16px] bg-white rounded-lg w-full" style={{ border: "1px solid #87878D" }}>
                <input autoComplete="off" value={address} onChange={(e) => setAddress(e.target.value)} type="text" name="searchAirspaces" id="searchAirspaces" placeholder="Search Airspaces" className="outline-none w-full pr-[20px]" />
                <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
                    <MagnifyingGlassIcon />
                </div>
                {showOptions && (
                    <div className="absolute top-[55px] left-0 bg-white w-full flex-col">
                        {addresses.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    value={item.place_name}
                                    onClick={() => handleSelectAddress(item.place_name)}
                                    className='p-5 text-left text-[#222222] w-full'
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





const Slider = () => {
  const [isFullyVisible, setIsFullyVisible] = useState(false);

    return (
        <div onClick={() => setIsFullyVisible(prev => !prev)} className={`cursor-pointer rounded-t-[30px] absolute ${isFullyVisible ? 'bottom-0' : '-bottom-[600px]'} right-6 flex flex-col items-center gap-[34px] py-[43px] px-[23px] bg-white max-w-[362px] duration-5000 z-50`}>
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
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={3}>
                    <p className="">3.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Define Your Property</p>
                        <p>Outline your land using the polygon tool if the location is not exact (top right of the map).</p>
                    </div>
                </div>
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={4}>
                    <p className="">4.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Claim Airspace</p>
                        <p>Click the 'Claim Airspace' button to confirm your airspace address. Your Airspace is saved. Modify your details anytime.</p>
                    </div>
                </div>
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={5}>
                    <p className="">5.</p>
                    <div className="flex flex-col">
                        <p className="font-bold">Checking the details</p>
                        <p>We confirm official records.</p>
                    </div>
                </div>
                <div className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]" key={6}>
                    <p className="">6.</p>
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

const PopUp = ({ status }) => {
    return (
        <div className={` z-20 absolute top-[14px] right-0 bg-white p-5 flex items-center gap-5 duration-500`}>
            <div className="flex items-center justify-center w-[18px] h-[18px]">
                {status === 'success' ? (
                <SuccessIcon />
                ) : (
                    <CloseIcon />
                )}

            </div>
            {status === 'failed' ? 'Failed to claim air space' : 'Congratulations on claiming your piece of the sky successfully!'}
        </div>
    );
}

const HowToModal = ({ goBack }) => {
  const [section, setSection] = useState(0);
  return (
    <div className='absolute z-50 flex h-screen w-screen flex-col items-center justify-center bg-white'>
      <div
        onClick={goBack}
        className='absolute right-[18px] top-[26px] h-[14px] w-[14px]'
      >
        <CloseIcon />
      </div>
      {section === 0 && (
        <div className='flex flex-col items-center justify-center gap-[15px] px-[30px]'>
          <div className='h-[72px] w-[72px]'>
            <EarthIcon isActive={true} />
          </div>
          <p className='px-[30px] text-center text-[15px] text-[#222222]'>
            Ready to claim your airspace? No registered airspace yet, but
            exciting times ahead! 🚀✨
          </p>
          <div
            onClick={() => setSection(1)}
            className='w-full cursor-pointer rounded-[8px] bg-[#0653EA] py-[16px] text-center text-white'
          >
            Next
          </div>
        </div>
      )}
      {section === 1 && (
        <div className='flex flex-col items-center justify-center gap-[15px] px-[60px] text-center text-[#222222]'>
          <p className='text-[20px] font-medium'>How to Claim My Airspace?</p>
          <div className='flex flex-col items-center justify-center py-[30px] text-center'>
            <p className='text-[15px]'>
              <span className='font-bold'>1. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className='text-[15px]'>
              <span className='font-bold'>2. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className='text-[15px]'>
              <span className='font-bold'>3. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className='text-[15px]'>
              <span className='font-bold'>4. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className='text-[15px]'>
              <span className='font-bold'>5. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
            <p className='text-[15px]'>
              <span className='font-bold'>6. Discover Your Address</span>
              <br />
              Enter your address using the map for accuracy.
            </p>
          </div>
          <p className='text-[15px]'>
            Let's get started on creating the future and receiving passive
            income from your skies. 🚀✨
          </p>
          <div
            onClick={goBack}
            className='w-full cursor-pointer rounded-[8px] bg-[#0653EA] py-[16px] text-center text-white'
          >
            Claim Airspace
          </div>
        </div>
      )}
      <div className='mt-[15px] flex items-center justify-center gap-[11px] pt-5'>
        {[0, 1].map((_, index) => (
          <div
            onClick={() => setSection(index)}
            className='h-[14px] w-[14px] cursor-pointer'
            style={{
              background: index !== section ? '#D9D9D9' : 'transparent',
              border: index === section ? '1px solid #D9D9D9' : 'none',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Airspaces = () => {
    const [isLoading, setIsLoading] = useState(false);
    // map
    const [map, setMap] = useState(null);
    const { isMobile } = useMobile();
    const [showMobileMap, setShowMobileMap] = useState(false);
    const [showHowToModal, setShowHowToModal] = useState(false);
    // variables
    const [address, setAddress] = useState('');
    const [addressData, setAddressData] = useState();
    const [addresses, setAddresses] = useState([]);
    const [flyToAddress, setFlyToAddress] = useState('');
    const [coordinates, setCoordinates] = useState({ longitude: '', latitude: '' })
    const [marker, setMarker] = useState();
    const defaultData = {
        address: flyToAddress, name: 'My Airspace', rent: false, sell: false, hasPlanningPermission: false, hasChargingStation: false, hasLandingDeck: false, hasStorageHub: false, sellingPrice: '', timezone: 'UTC+0', transitFee: "1-99", isFixedTransitFee: false, noFlyZone: false, weekDayRanges: [
            { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 0 },
            { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 1 },
            { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 2 },
            { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 3 },
            { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 4 },
            { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 5 },
            { fromTime: 9, toTime: 21, isAvailable: true, weekDayId: 6 },
        ]
    }
    // showing
    const [showOptions, setShowOptions] = useState(false);
    const [confirmationStatus, setConfirmationStatus] = useState(null);
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
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-15.498211, 28.035056],
                zoom: 15,
                bounds:[[-73.9876, 40.7661], [-73.9397, 40.8002]]
                // attributionControl: false
            })
           
             
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
    flyToUserIpAddress(newMap)
        }
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
        console.error(err);
      }
    };

    goToAddress();
  }, [flyToAddress, map]);

    useEffect(() => {
        if (!confirmationStatus) return;
        const timeoutId = setTimeout(() => {
            setConfirmationStatus(null);
        }, 4000);

        return () => clearTimeout(timeoutId)
    }, [confirmationStatus])
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

  const handleSelectAddress = (placeName) => {
    setAddress(placeName);
    setFlyToAddress(placeName);
    setShowOptions(false);
  };

    const [claimedProperty, setClaimedProperty] = useState(null)

    const onClaim = async () => {
        try {
            const { address, name, hasChargingStation, hasLandingDeck, hasPlanningPermission, hasStorageHub, rent, timezone, transitFee, noFlyZone, isFixedTransitFee, weekDayRanges } = data;
            let { latitude, longitude } = coordinates;
            latitude = Number(latitude)
            longitude = Number(longitude)  
            if(!name)return
            const addProperty = await createProperty(user.blockchainAddress, {
                address,
                ownerId: user.id,
                propertyStatusId: 0,
                hasChargingStation,
                hasLandingDeck,
                hasStorageHub,
                isRentableAirspace: rent,
                title: name,
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

            if(!response){
                setConfirmationStatus('failed');
            } else {
                setConfirmationStatus('success');
                setClaimedProperty({name: data.name})
            }
            setData({ ...defaultData });


        } catch (error) {
            setConfirmationStatus('failed');
        } finally {
            setShowClaimModal(false);
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

            <div className="relative rounded bg-[#F0F0FA] h-screen w-screen flex items-center justify-center overflow-hidden">
                {!showMobileMap && <Sidebar />}
                <div className="w-full h-full flex flex-col">
                    {!showMobileMap && <PageHeader pageTitle={'Airspaces'} />}
                    {(showMobileMap && isMobile) && <ExplorerMobile onGoBack={() => setShowMobileMap(false)} flyToAddress={flyToAddress} address={address} setAddress={setAddress} addresses={addresses} showOptions={showOptions} handleSelectAddress={handleSelectAddress} onClaimAirspace={() => setShowClaimModal(true)} />}
                    {showHowToModal && <HowToModal goBack={() => setShowHowToModal(false)} />}
                    <section className={`flex relative w-full h-full justify-start items-start md:mb-0 ${showMobileMap ? '' : 'mb-[79px]'}`}>
                        <div
                            className={`!absolute !top-0 !left-0 !w-full !h-screen !m-0`}
                            id='map'
                            style={{ opacity: (!isMobile) ? '1' : (showMobileMap) ? '1' : '0', zIndex: (!isMobile) ? '20' : (showMobileMap) ? '20' : '-20' }}
                        />
                        {(isMobile && showMobileMap && flyToAddress) && <div onClick={() => setShowClaimModal(true)} className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#0653EA] text-white rounded-lg py-[16px] text-center text-[15px] font-normal cursor-pointer w-[90%] z-[25]">Claim Airspace</div>}
                        {isMobile && (
                            <Fragment>
                                {showClaimModal && <ClaimModal onCloseModal={() => setShowClaimModal(false)} data={data} setData={setData} onClaim={onClaim} />}
                            </Fragment>
                        )}
                        {!isMobile && (<div className="flex justify-start items-start">
                            <Explorer flyToAddress={flyToAddress} claimedProperty={claimedProperty} address={address} setAddress={setAddress} addresses={addresses} showOptions={showOptions} handleSelectAddress={handleSelectAddress} onClaimAirspace={() => setShowClaimModal(true)} />
                            <Slider />
                            {confirmationStatus && <PopUp status={confirmationStatus} />}
                            {showClaimModal && <ClaimModal onCloseModal={() => setShowClaimModal(false)} data={data} setData={setData} onClaim={onClaim} />}
                        </div>)}
                        {!showMobileMap && <div className="flex md:hidden flex-col w-full h-full">
                            <div onClick={() => setShowMobileMap(true)} className="flex flex-col justify-between p-[17px] w-full gap-[184px] bg-no-repeat bg-center bg-cover" style={{ backgroundImage: "url('/images/map-bg.png')" }}>
                                <div className="font-normal text-base text-white text-center bg-[#222222] w-full p-[12px] rounded-[20px]">Exciting times ahead!<br />Claim your airspace 🚀✨</div>
                                <div className="font-normal text-base text-white text-center bg-[#0653EA] w-full p-[12px] rounded-lg">Claim your airspace</div>
                            </div>
                            <div className="py-[29px] px-[13px] flex flex-col gap-[23px] flex-1">
                                <div className="flex items-center gap-[14px] flex-1">
                                    <Link href={'/homepage/portfolio'} className="flex flex-col justify-between p-[17px] w-full gap-[184px] bg-no-repeat bg-center bg-cover h-full rounded-[20px] cursor-pointer" style={{ backgroundImage: "url('/images/airspace-preview.png')" }}>
                                        <p className="text-white text-xl font-medium">Airspace</p>
                                    </Link>
                                    <Link href={'/homepage/portfolio'} className="flex flex-col justify-between p-[17px] w-full gap-[184px] bg-no-repeat bg-center bg-cover h-full rounded-[20px] cursor-pointer" style={{ backgroundImage: "url('/images/portfolio.jpg')" }}>
                                        <p className="text-white text-xl font-medium">Portfolio</p>
                                    </Link>
                                </div>
                                <div onClick={() => setShowHowToModal(true)} className="flex items-center justify-center gap-[7px] p-[13px] bg-[#222222] text-white rounded-[20px] cursor-pointer">
                                    <div className="w-[24px] h-[24px]">
                                        <HelpQuestionIcon color='white' />
                                    </div>
                                    <p>How to Claim My Airspace?</p>
                                </div>
                            </div>
                        </div>}
                    </section>
                </div>

      </div>
    </Fragment>
  );
};

export default Airspaces;
