import { Fragment, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import maplibregl from "maplibre-gl";
import { useRouter } from 'next/router';
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

const Toggle = ({ checked, setChecked }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value=""
        className="peer sr-only"
        checked={checked}
        onClick={setChecked}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );
};

const TimeZoneSelect = ({ timeZone, setTimeZone }) => {
  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
    "Europe/Berlin": "Frankfurt",
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const [selectedLabel, setSelectedLabel] = useState("Europe/London");
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
        htmlFor="timeZone"
        className="text-[14px] font-normal text-[#838187]"
      >
        Time Zone<span className="text-[#E04F64]">*</span>
      </label>
      <select
        value={selectedLabel}
        onChange={handleTimeZoneChange}
        name="timeZone"
        id="timeZone"
        className="w-full appearance-none rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#222222] focus:outline-none"
        style={{ border: "1px solid #87878D" }}
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
        htmlFor="variableFeeRentalRange"
        className="text-[14px] font-normal text-[#838187]"
      >
        Variable Fee Rental Range (per transit)
        <span className="text-[#E04F64]">*</span>
      </label>
      <select
        value={fee}
        onChange={handleVariableFeeRentalRangeChange}
        name="variableFeeRentalRange"
        id="variableFeeRentalRange"
        className="w-full appearance-none rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#222222] focus:outline-none"
        style={{ border: "1px solid #87878D" }}
      >
        <option value="1-99">$1-$99</option>
        <option value="100-199">$100-$199</option>
        <option value="200-299">$200-$299</option>
        <option value="300-399">$300-$399</option>
        <option value="400-499">$400-$499</option>
        <option value="500-599">$500-$599</option>
      </select>
    </Fragment>
  );
};

const WeekDayRangesForm = ({ weekDayRanges, setWeekDayRanges }) => {
  const weekDays = [
    "SUNDAYS",
    "MONDAYS",
    "TUESDAYS",
    "WEDNESDAYS",
    "THURSDAYS",
    "FRIDAYS",
    "SATURDAYS",
  ];

  const options = Array.from({ length: 25 });

  // Initialize the weekDayRanges state with all days set to available
  useEffect(() => {
    const defaultWeekDayRanges = weekDayRanges.map((day) => ({
      isAvailable: true,
      fromTime: 9,
      toTime: 21,
      weekDayId:day.weekDayId

      
    }));
    setWeekDayRanges(defaultWeekDayRanges);
  }, []);

  const handleToggle = (day) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].isAvailable = !weekDayRangesCopy[day].isAvailable;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleFromTimeChange = (day, time) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].fromTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleToTimeChange = (day, time) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].toTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  return weekDays.map((day, index) => {
    const isDayAvailable = weekDayRanges[index].isAvailable;

    return (
      <div className="flex items-center justify-between" key={index}>
        <div className="flex items-center gap-[15px] pr-[32px]">
          <Toggle
            checked={isDayAvailable}
            setChecked={() => handleToggle(index)}
          />
          <p>{day}</p>
        </div>
        <div className="flex items-center gap-[66px]">
          <select
            disabled={!isDayAvailable}
            value={weekDayRanges[index].fromTime}
            onChange={(e) => handleFromTimeChange(index, +e.target.value)}
            name={`${index}/start`}
            id={`${index}/start`}
            className="appearance-none rounded-lg px-[22px] py-[5px] text-[14px] font-normal text-[#87878D] focus:outline-none"
            style={{ border: "1px solid #87878D" }}
          >
            {options.map((_, index) => (
              <option key={`start-${index}`} value={index}>
                {index.toString().padStart(2, "0")}:00
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
            className="appearance-none rounded-lg px-[22px] py-[5px] text-[14px] font-normal text-[#87878D] focus:outline-none"
            style={{ border: "1px solid #87878D" }}
          >
            {options.map((_, index) => (
              <option key={`end-${index}`} value={index}>
                {index.toString().padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  });
};

const ClaimModal = ({ onCloseModal, data, setData, onClaim ,claimButtonLoading}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  useEffect(()=>{
    let airSpaceName=data.address.split(',')
    setData((prev) => {
      return {
        ...prev,
        name:airSpaceName[0],
      };})
  },[])
  const handleSellPrice=(e)=>{
  let inputVal=e.target.value;
  console.log(inputVal)
  let parsedVal=parseFloat(inputVal)
   if(parsedVal>=0 && parsedVal!=NaN){
    console.log("parseVal ",parseFloat(inputVal))
    setData((prev) => {
      return {
        ...prev,
        sellingPrice: inputVal,
      };})

   }else{
    setData((prev) => {
      return {
        ...prev,
        sellingPrice:'0'
       
      };})
   }
      
    

  }
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white  md:rounded-[30px]  w-full max-h-screen h-screen md:max-h-[600px] md:h-auto overflow-y-auto overflow-x-auto md:w-[689px] z-50 flex flex-col gap-[15px] short-scrollbar">
      <div
        className="z-[100] sticky top-0 left-0 right-0 bg-white py-[20px] px-[29px] -mt-[1px]      md:shadow-none"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="relative flex items-center gap-[20px] md:p-0">
          <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <h2 className="text-[#222222] text-center font-medium text-xl">
            Claim Airspace
          </h2>
          <div
            onClick={onCloseModal}
            className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
          >
            <CloseIcon />
          </div>
        </div>
      </div>
      <div className="px-[29px]">
        <div
          className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg"
          style={{ border: "1px solid #4285F4" }}
        >
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <p className="font-normal text-[#222222] text-[14px] flex-1">
            {data.address}
          </p>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="name">
            Name of airspace<span className="text-[#E04F64]">*</span>
          </label>
          <input
            value={data.name}
            onChange={(e) =>
              setData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222]"
            style={{ border: "1px solid #87878D" }}
            type="text"
            name="name"
            id="name"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[14px] font-normal text-[#838187]">
            Are you looking to Rent or Sell your airspace?
          </p>
          <div className="flex items-center gap-[7px]">
            <input
              className="h-[18px] w-[18px] cursor-pointer"
              type="checkbox"
              id="rent"
              name="rent"
              checked={data.rent}
              onChange={() =>
                setData((prev) => {
                  const newData = { ...prev, rent: !prev.rent };
                  newData.sell = false;
                  return newData;
                })
              }
            />
            <label htmlFor="rent">Rent</label>
            <input
              className="h-[18px] w-[18px] cursor-pointer"
              type="checkbox"
              id="sell"
              disabled
              name="sell"
              checked={data.sell}
              onChange={() =>
                setData((prev) => {
                  const newData = { ...prev, sell: !prev.sell };
                  newData.rent = false;
                  return newData;
                })
              }
            />
            <label htmlFor="sell">Sell</label>
          </div>
        </div>
        {data.rent && (
          <Fragment>
            <h2 className="text-[#222222] font-normal text-[20px]">
              Rental Details
            </h2>
            <Link
              target="_blank"
              href={"https://skytrade.tawk.help"}
              className="text-[#0653EA] text-[14px] font-normal cursor-pointer"
            >
              Learn more about rentals in our FAQ.
            </Link>
            <div className="flex items-center justify-between gap-[15px]">
              <div className="flex-1">
                <VariableFeeRentalRangesSelect
                  fee={data.transitFee}
                  setFee={(fee) =>
                    setData((prev) => ({ ...prev, transitFee: "" + fee }))
                  }
                />
              </div>
              <div className="flex-1">
                <TimeZoneSelect
                  timeZone={data.timezone}
                  setTimeZone={(timezone) =>
                    setData((prev) => ({ ...prev, timezone }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] font-normal text-[#838187]">
                Select extra features your facility provides
                <span className="text-[#E04F64]">*</span>
              </p>
              <div className="flex items-center gap-[10px]">
                <input
                  className="w-[18px] h-[18px] cursor-pointer"
                  type="checkbox"
                  id="hasLandingDeck"
                  name="hasLandingDeck"
                  checked={data.hasLandingDeck}
                  onChange={() =>
                    setData((prev) => ({
                      ...prev,
                      hasLandingDeck: !prev.hasLandingDeck,
                    }))
                  }
                />
                <label htmlFor="hasLandingDeck" className="text-[#87878D] text-[14px] font-normal">
                  Landing Deck
                </label>
                <input
                  className="w-[18px] h-[18px] cursor-pointer"
                  type="checkbox"
                  id="hasChargingStation"
                  name="hasChargingStation"
                  checked={data.hasChargingStation}
                  onChange={() =>
                    setData((prev) => ({
                      ...prev,
                      hasChargingStation: !prev.hasChargingStation,
                    }))
                  }
                />
                <label  htmlFor="hasChargingStation" className="text-[#87878D] text-[14px] font-normal">
                  Charging Station
                </label>
                <input
                  className="w-[18px] h-[18px] cursor-pointer"
                  type="checkbox"
                  id="hasStorageHub"
                  name="hasStorageHub"
                  checked={data.hasStorageHub}
                  onChange={() =>
                    setData((prev) => ({
                      ...prev,
                      hasStorageHub: !prev.hasStorageHub,
                    }))
                  }
                />
                <label htmlFor="hasStorageHub" className="text-[#87878D] text-[14px] font-normal">
                  Storage Hub
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-[15px]">
              <p>
                Availability<span className="text-[#E04F64]">*</span>
              </p>
              <WeekDayRangesForm
                weekDayRanges={data.weekDayRanges}
                setWeekDayRanges={(weekDayRanges) =>
                  setData((prev) => ({ ...prev, weekDayRanges }))
                }
              />
            </div>
          </Fragment>
        )}
        {data.sell && (
          <Fragment>
            <div className="flex items-center gap-[7.5px]">
              <h2 className="text-[#222222] font-normal text-[20px]">
                Selling Details
              </h2>
              <div
                onClick={() => setIsInfoVisible((prev) => !prev)}
                className="relative w-[20px] h-[20px] flex justify-center items-center"
              >
                <InfoIcon />
                {isInfoVisible && (
                  <div className="absolute -top-4 left-6 w-[189px] bg-[#CCE3FC] rounded-[4px] p-[12px] font-normal text-[10px] italic">
                    Note that rental availability are not applicable to your
                    selling
                  </div>
                )}
              </div>
            </div>
            <Link
              href={"https://skytrade.tawk.help"}
              className="text-[#0653EA] text-[14px] font-normal cursor-pointer"
            >
              Learn more about selling in our FAQ.
            </Link>
            <div className="flex flex-col gap-[5px]">
              <label
                className="font-normal text-[#838187] text-[14px]"
                htmlFor="sellingPrice"
              >
                Selling Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center text-[14px] pl-[22px] text-[#222222] ">
                  $
                </span>
                <input
                  className="rounded-lg pl-[31px] w-full py-[16px] text-[14px] text-[#222222] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ border: "1px solid #87878D" }}
                  autoComplete="off"
                  type="number"
                  min={0}
                  value={data.sellingPrice}
                  onChange={handleSellPrice}
                  name="sellingPrice"
                  id="sellingPrice"
                />
              </div>
            </div>
          </Fragment>
        )}

        <p className="text-[14px] font-normal text-[#838187]">
          Do you currently have zoning or planning permission to develop above
          your land or property?{" "}
          <span className="italic text-[10px]">
            (Your answer won't affect your claim)
            <span className="text-[#E04F64]">*</span>
          </span>{" "}
        </p>
        <div className="flex items-center gap-[7px] text-[#87878D] text-[14px]">
          <input
            className="relative h-[16.67px] w-[16.67px] cursor-pointer bg-cover p-[2.5px]"
            checked={data.hasPlanningPermission === "true"}
            onChange={() =>
              setData((prev) => ({ ...prev, hasPlanningPermission: "true" }))
            }
            style={{
              appearance: "none",
              border:
                data.hasPlanningPermission !== "true"
                  ? "2px solid #222222"
                  : "2px solid #0653EA",
              backgroundColor:
                data.hasPlanningPermission === "true"
                  ? "#0653EA"
                  : "transparent",
              borderRadius: "50%",
              backgroundClip: "content-box",
            }}
            type="checkbox"
            name="zone-yes"
            id="zone-yes"
          />
          <label htmlFor="zone-yes">Yes</label>
          <input
            className="relative h-[16.67px] w-[16.67px] cursor-pointer p-[2.5px]"
            checked={data.hasPlanningPermission === "false"}
            onChange={() =>
              setData((prev) => ({ ...prev, hasPlanningPermission: "false" }))
            }
            style={{
              appearance: "none",
              border:
                data.hasPlanningPermission !== "false"
                  ? "2px solid #222222"
                  : "2px solid #0653EA",
              backgroundColor:
                data.hasPlanningPermission === "false"
                  ? "#0653EA"
                  : "transparent",
              borderRadius: "50%",
              backgroundClip: "content-box",
            }}
            type="checkbox"
            name="zone-no"
            id="zone-no"
          />
          <label htmlFor="zone-no">No</label>
          <input
            className="relative h-[16.67px] w-[16.67px] cursor-pointer p-[2.5px]"
            checked={!data.hasPlanningPermission}
            onChange={() =>
              setData((prev) => ({ ...prev, hasPlanningPermission: null }))
            }
            style={{
              appearance: "none",
              border: data.hasPlanningPermission
                ? "2px solid #222222"
                : "2px solid #0653EA",
              backgroundColor: !data.hasPlanningPermission
                ? "#0653EA"
                : "transparent",
              borderRadius: "50%",
              backgroundClip: "content-box",
            }}
            type="checkbox"
            name="zone-dont-know"
            id="zone-dont-know"
          />
          <label htmlFor="zone-dont-know">I don't Know</label>
        </div>
        <div className="flex items-center justify-center gap-[20px] text-[14px]">
          <div
            onClick={onCloseModal}
            className="rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer"
            style={{ border: "1px solid #0653EA" }}
          >
            Cancel
          </div>
          <button
            onClick={onClaim}
            className="rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer"
          >
            {
              claimButtonLoading ? 
              <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              :
              'Claim Airspace'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

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

const PopUp = ({ isVisible }) => {
  return (
    <div
      className={` z-20 absolute top-[14px] ${isVisible ? "right-0" : "-right-[100%]"} bg-white p-5 flex items-center gap-5 duration-500`}
    >
      <div className="flex items-center justify-center w-[18px] h-[18px]">
        <SuccessIcon />
      </div>
      Congratulations on claiming your piece of the sky successfully!
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
  const router = useRouter();

  useEffect(()=>{
    if(user == undefined){
      localStorage.removeItem('openlogin_store');
      router.push('/auth/join');
      return;
    }
  },[user])

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
      setClaimButtonLoading(true);
      const {
        address,
        name,
        hasChargingStation,
        hasLandingDeck,
        hasPlanningPermission,
        hasStorageHub,
        rent,
        timezone,
        transitFee,
        noFlyZone,
        isFixedTransitFee,
        weekDayRanges,
      } = data;
      let { latitude, longitude } = coordinates;
      latitude = Number(latitude);
      longitude = Number(longitude);
      if (!name) return;
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
        weekDayRanges,
      });
      console.log("add property results ,",addProperty)
      if (addProperty === undefined) {
        setShowFailurePopUp(true);
      } else {
        setShowSuccessPopUp(true);
      }
      setShowClaimModal(false);
      setIsLoading(false)
      setData({ ...defaultData });
    } catch (error) {
      console.log(error);
    } finally{
      setClaimButtonLoading(false)
    }

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

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Airspaces</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]">
        {!showMobileMap && <Sidebar />}
        <div className="flex h-full w-full flex-col">
          {!showMobileMap && <PageHeader pageTitle={"Airspaces"} />}
          {showMobileMap && isMobile && (
            <ExplorerMobile
              onGoBack={() => setShowMobileMap(false)}
              flyToAddress={flyToAddress}
              address={address}
              setAddress={setAddress}
              addresses={addresses}
              showOptions={showOptions}
              handleSelectAddress={handleSelectAddress}
              onClaimAirspace={() => {setShowClaimModal(true);setIsLoading(true)}}
            />
          )}
          {showHowToModal && (
            <HowToModal goBack={() => setShowHowToModal(false)} />
          )}
          <section
            className={`relative flex h-full w-full items-start justify-start md:mb-0 ${showMobileMap ? "" : "mb-[79px]"}`}
          >
            <div
              className={`!absolute !left-0 !top-0 !m-0 !h-screen !w-full`}
              id="map"
              style={{
                opacity: !isMobile ? "1" : showMobileMap ? "1" : "0",
                zIndex: !isMobile ? "20" : showMobileMap ? "20" : "-20",
              }}
            />
            {isMobile && showMobileMap && flyToAddress && (
              <div
                onClick={() =>{ setShowClaimModal(true);setIsLoading(true)}}
                className="absolute bottom-2 left-1/2 z-[25] w-[90%] -translate-x-1/2 cursor-pointer rounded-lg bg-[#0653EA] py-[16px] text-center text-[15px] font-normal text-white"
              >
                Claim Airspace
              </div>
            )}
            {isMobile && (
              <Fragment>
                {showClaimModal && (
                  <ClaimModal
                    onCloseModal={() => {setShowClaimModal(false);setIsLoading(false)}}
                    data={data}
                    setData={setData}
                    onClaim={onClaim}
                    claimButtonLoading={claimButtonLoading}
                  />
                )}
              </Fragment>
            )}
            {!isMobile && (
              <div className="flex items-start justify-start">
                <Explorer
                  flyToAddress={flyToAddress}
                  address={address}
                  setAddress={setAddress}
                  addresses={addresses}
                  showOptions={showOptions}
                  handleSelectAddress={handleSelectAddress}
                  onClaimAirspace={() => {setShowClaimModal(true);setIsLoading(true)}}
                />
                <Slider />
                <PopUp isVisible={showSuccessPopUp} />
                <FailurePopUp isVisible={showFailurePopUp} />

                {showClaimModal && (
                  <ClaimModal
                    onCloseModal={() =>{ setShowClaimModal(false);setIsLoading(false)}}
                    data={data}
                    setData={setData}
                    onClaim={onClaim}
                    claimButtonLoading={claimButtonLoading}
                  />
                )}
              </div>
            )}
            {!showMobileMap && (
              <div className="flex h-full w-full flex-col md:hidden">
                <div
                  onClick={() => setShowMobileMap(true)}
                  className="flex w-full flex-col justify-between gap-[184px] bg-cover bg-center bg-no-repeat p-[17px]"
                  style={{ backgroundImage: "url('/images/map-bg.png')" }}
                >
                  <div className="w-full rounded-[20px] bg-[#222222] p-[12px] text-center text-base font-normal text-white">
                    Exciting times ahead!
                    <br />
                    Claim your airspace 🚀✨
                  </div>
                  <div className="w-full rounded-lg bg-[#0653EA] p-[12px] text-center text-base font-normal text-white">
                    Claim your airspace
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-[23px] px-[13px] py-[29px]">
                  <div className="flex flex-1 items-center gap-[14px]">
                    <Link
                      href={"/homepage/portfolio"}
                      className="flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]"
                      style={{
                        backgroundImage: "url('/images/airspace-preview.png')",
                      }}
                    >
                      <p className="text-xl font-medium text-white">Airspace</p>
                    </Link>
                    <Link
                      href={"/homepage/portfolio"}
                      className="flex h-full w-full cursor-pointer flex-col justify-between gap-[184px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[17px]"
                      style={{
                        backgroundImage: "url('/images/portfolio.jpg')",
                      }}
                    >
                      <p className="text-xl font-medium text-white">
                        Portfolio
                      </p>
                    </Link>
                  </div>
                  <div
                    onClick={() => setShowHowToModal(true)}
                    className="flex cursor-pointer items-center justify-center gap-[7px] rounded-[20px] bg-[#222222] p-[13px] text-white"
                  >
                    <div className="h-[24px] w-[24px]">
                      <HelpQuestionIcon color="white" />
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
