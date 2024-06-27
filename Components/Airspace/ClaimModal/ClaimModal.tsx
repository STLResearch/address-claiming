import React, { Fragment, useEffect, useState } from "react";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import useAuth from "@/hooks/useAuth";
import { ArrowLeftIcon, CloseIcon, InfoIcon, LocationPointIcon } from "@/Components/Icons";
import Link from "next/link";
import VariableFeeRentalRangesSelect from "./RentalDetails/VariableFeeRentalRangesSelect";
import TimeZoneSelect from "./RentalDetails/TimeZoneSelect";
import WeekDayRangesForm from "./RentalDetails/WeekDayRangesForm";
import Backdrop from "@/Components/Backdrop";

interface PropsI {
  onCloseModal: () => void;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onClaim: () => void;
  claimButtonLoading: boolean;
}

const ClaimModal = ({
  onCloseModal,
  data,
  setData,
  onClaim,
  claimButtonLoading,
}: PropsI) => {

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {

    let airSpaceName = data.address.split(",");
    console.log('name chamge', airSpaceName)
    setData((prev) => {
      return {
        ...prev,
        name: airSpaceName[0],
      };
    });
  }, [data.address]);
  const handleSellPrice = (e) => {
    let inputVal = e.target.value;
    let parsedVal = parseFloat(inputVal);
    if (parsedVal >= 0 && !Number.isNaN(parsedVal)) {
      setData((prev) => {
        return {
          ...prev,
          sellingPrice: inputVal,
        };
      });
    } else {
      setData((prev) => {
        return {
          ...prev,
          sellingPrice: "0",
        };
      });
    }
  };
  return ( 
    <div>
    <Backdrop onClick={() => {}} />
    <div className="fixed top-0 left-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white md:rounded-[30px] w-full max-h-screen h-screen md:max-h-[640px] md:h-auto overflow-y-auto overflow-x-auto md:w-[689px] z-[500] sm:z-50 flex flex-col gap-[15px] ">
      <div
        className="z-[100] sticky top-0 left-0 right-0 bg-white py-[20px] px-[29px] -mt-[1px] md:shadow-none"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="relative flex items-center gap-[20px] md:p-0">
          <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <div className="flex justify-center items-center w-[95%] gap-2 ">
            <h2 className="text-[#222222] text-center font-medium text-xl">
              Claim Airspace
            </h2>
            <div onClick={() => setIsInfoVisible((prev) => !prev)}
              className="hidden md:block w-[20px] h-[20px] relative tems-center justify-center">
              <InfoIcon />
              {isInfoVisible && (
                <div className="absolute -top-4 left-6 w-[189px] bg-[#CCE3FC] rounded-[4px] p-[12px] font-normal text-[10px] italic">
                  Note that we store your data securely with advanced encryption and
                  strict authentication measures to ensure utmost privacy and
                  protection.
                </div>
              )}
            </div>
          </div>

          <div
            onClick={onCloseModal}
            className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
          >
            <CloseIcon />
          </div>
        </div>
      </div>
      <div className="md:overflow-y-scroll">
        <div className="px-[29px]">
          <div
            className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg"
            style={{ border: "1px solid #4285F4" }}
          >
            <div className="w-6 h-6">
              <LocationPointIcon />
            </div>
            <p className="font-normal text-[#222222] text-[14px] flex-1">
              {data?.address}
            </p>
          </div>
          <div className="flex flex-col gap-[5px] mt-3 md:mt-4 ">
            <label htmlFor="name">
              Name of airspace<span className="text-[#E04F64]">*</span>
            </label>
            <input
              value={data?.name}
              onChange={(e) =>
                setData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222] mt-0.5 md:mt-1"
              style={{ border: "1px solid #87878D" }}
              type="text"
              name="name"
              id="name"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-[10px] mt-2 md:mt-3">
            <p className="text-[14px] font-normal text-[#838187] ">
              Are you looking to Rent or Sell your airspace?
            </p>
            <div className="flex items-center gap-[7px]">
              <input
                className="h-[18px] w-[18px] cursor-pointer"
                type="checkbox"
                id="rent"
                name="rent"
                checked={true}
                onChange={() =>
                  setData((prev) => {
                    const newData = { ...prev, rent: true };
                    newData.sell = false;
                    return newData;
                  })
                }
              />
              <label htmlFor="rent">Rent</label>
              {/* <input
                className="h-[18px] w-[18px] cursor-pointer"
                type="checkbox"
                id="sell"
                disabled
                name="sell"
                checked={data?.sell}
                onChange={() =>
                  setData((prev) => {
                    const newData = { ...prev, sell: !prev.sell };
                    newData.rent = false;
                    return newData;
                  })
                }
              />
              <label htmlFor="sell">Sell</label> */}
            </div>
          </div>
          <Fragment>
            <h2 className="text-[#222222] font-normal text-[20px] leading-[3rem] ">
              Rental Details
            </h2>
            <Link
              target="_blank"
              href={"https://skytrade.tawk.help"}
              className="text-[#0653EA] text-[14px] font-normal cursor-pointer leading-[1.5rem]"
            >
              Learn more about rentals in our FAQ.
            </Link>
            <div className="md:flex items-center justify-between gap-[15px] mt-4">
              <div className="flex-1 ">
                <VariableFeeRentalRangesSelect
                  fee={data?.transitFee}
                  setFee={(fee) =>
                    setData((prev) => ({ ...prev, transitFee: "" + fee }))
                  }
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0 ">
                <TimeZoneSelect
                  setTimeZone={(timezone) =>
                    setData((prev) => ({ ...prev, timezone }))
                  }
                />
              </div>
            </div>
            <div
              className="
          flex flex-col gap-[10px] "
            >
              <p className="text-[14px] font-normal text-[#838187] mt-4">
                Select extra features your facility provides
              </p>
              <div className=" flex-col  flex md:flex-row  md:items-center gap-[10px] leading-[2rem]">
                <div className="flex items-center gap-[5px]">
                  <input
                    className="w-[18px] h-[18px] cursor-pointer"
                    type="checkbox"
                    id="hasLandingDeck"
                    name="hasLandingDeck"
                    checked={data?.hasLandingDeck}
                    onChange={() =>
                      setData((prev) => ({
                        ...prev,
                        hasLandingDeck: !prev.hasLandingDeck,
                      }))
                    }
                  />
                  <label
                    htmlFor="hasLandingDeck"
                    className="text-[#87878D] text-[14px] font-normal"
                  >
                    Landing Deck
                  </label>
                </div>
                <div className="flex items-center gap-[5px] mt-1">
                  <input
                    className="w-[18px] h-[18px] cursor-pointer"
                    type="checkbox"
                    id="hasChargingStation"
                    name="hasChargingStation"
                    checked={data?.hasChargingStation}
                    onChange={() =>
                      setData((prev) => ({
                        ...prev,
                        hasChargingStation: !prev.hasChargingStation,
                      }))
                    }
                  />
                  <label
                    htmlFor="hasChargingStation"
                    className="text-[#87878D] text-[14px] font-normal"
                  >
                    Charging Station
                  </label>
                </div>
                <div className="flex items-center gap-[5px] mt-1">
                  <input
                    className="w-[18px] h-[18px] cursor-pointer"
                    type="checkbox"
                    id="hasStorageHub"
                    name="hasStorageHub"
                    checked={data?.hasStorageHub}
                    onChange={() =>
                      setData((prev) => ({
                        ...prev,
                        hasStorageHub: !prev.hasStorageHub,
                      }))
                    }
                  />
                  <label
                    htmlFor="hasStorageHub"
                    className="text-[#87878D] text-[14px] font-normal"
                  >
                    Storage Hub
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[15px] mt-2">
              <p>
                Availability<span className="text-[#E04F64]">*</span>
              </p>
              <WeekDayRangesForm
                weekDayRanges={data?.weekDayRanges}
                setWeekDayRanges={(weekDayRanges) =>
                  // @ts-ignore
                  setData((prev) => ({ ...prev, weekDayRanges }))
                }
              />
            </div>
          </Fragment>
          
          {data?.sell && (
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
                    value={data?.sellingPrice}
                    onChange={handleSellPrice}
                    name="sellingPrice"
                    id="sellingPrice"
                  />
                </div>
              </div>
            </Fragment>
          )}

          <div className="mt-4">
            <p className="text-[16px]  md:text-[14px] font-normal text-[#838187]">
              Do you currently have zoning or planning permission to develop
              above your land or property?{" "}
              <span className="italic  text-[12px] md:text-[10px]">
                (Your answer won't affect your claim)
                <span className="text-[#E04F64]">*</span>
              </span>{" "}
            </p>
          </div>
          <div className="flex items-center gap-[7px] text-[#87878D] text-[14px] mt-4">
            <input
              className="relative h-[16.67px] w-[16.67px] cursor-pointer bg-cover p-[2.5px]"
              checked={data?.hasPlanningPermission === "true"}
              onChange={() =>
                setData((prev) => ({ ...prev, hasPlanningPermission: "true" }))
              }
              style={{
                appearance: "none",
                border:
                  data?.hasPlanningPermission !== "true"
                    ? "2px solid #222222"
                    : "2px solid #0653EA",
                backgroundColor:
                  data?.hasPlanningPermission === "true"
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
              checked={data?.hasPlanningPermission === "false"}
              onChange={() =>
                setData((prev) => ({ ...prev, hasPlanningPermission: "false" }))
              }
              style={{
                appearance: "none",
                border:
                  data?.hasPlanningPermission !== "false"
                    ? "2px solid #222222"
                    : "2px solid #0653EA",
                backgroundColor:
                  data?.hasPlanningPermission === "false"
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
              checked={!data?.hasPlanningPermission}
              onChange={() =>
                setData((prev) => ({ ...prev, hasPlanningPermission: null }))
              }
              style={{
                appearance: "none",
                border: data?.hasPlanningPermission
                  ? "2px solid #222222"
                  : "2px solid #0653EA",
                backgroundColor: !data?.hasPlanningPermission
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

          <div className="  flex items-center md:justify-center gap-[20px] text-[14px]  my-8">
            <div
              onClick={onCloseModal}
              className="rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer"
              style={{ border: "1px solid #0653EA" }}
            >
              Cancel
            </div>

            <div className="w-[75%] md:w-[25%] rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer">
              <div className="flex justify-center items-center w-full ">
                <LoadingButton onClick={onClaim} isLoading={claimButtonLoading} color={'white'}>
                  Claim Airspace
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ClaimModal;
