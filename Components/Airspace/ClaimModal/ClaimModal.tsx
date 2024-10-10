import React, { Fragment, useEffect, useState, useRef } from "react";
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import useAuth from "../../../hooks/useAuth";
import { ArrowLeftIcon, CloseIconBlack, InfoIcon, LocationPointIcon } from "../../../Components/Icons";
import Link from "next/link";
import VariableFeeRentalRangesSelect from "./RentalDetails/VariableFeeRentalRangesSelect";
import TimeZoneSelect from "./RentalDetails/TimeZoneSelect";
import WeekDayRangesForm from "./RentalDetails/WeekDayRangesForm";
import { useTour } from "@reactour/tour";
import { useSearchParams } from "next/navigation";
import Backdrop from "@/Components/Backdrop";
import VerificationPopup from "@/Components/MyAccount/VerificationPopup";
import { defaultData } from "../../../types";
import { useMobile } from "@/hooks/useMobile";

interface PropsI {
  onCloseModal: () => void;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onClaim: (address?: string) => void;
  claimButtonLoading: boolean;
  dontShowAddressOnInput: boolean;
  setDontShowAddressOnInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClaimModal = ({
  onCloseModal,
  data,
  setData,
  onClaim,
  claimButtonLoading,
  dontShowAddressOnInput,
  setDontShowAddressOnInput,
}: PropsI) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const searchParams = useSearchParams();
  const endOfDivRef = useRef(null);
  const { currentStep } = useTour();

  useEffect(() => {
    if (endOfDivRef.current && currentStep === 3) {
      const { scrollHeight, clientHeight } = endOfDivRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      (endOfDivRef.current as any).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [currentStep]);

  useEffect(() => {
    const airSpaceName = data.address.split(",");

    if (data.title === "") {
      setData((prev) => {
        return {
          ...prev,
          title: airSpaceName[0],
        };
      });
    }
  }, [data.address]);
  const handleSellPrice = (e) => {
    const inputVal = e.target.value;
    const parsedVal = parseFloat(inputVal);
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
  const [inputAddress, setInputAddress] = useState("");
  const { isMobile } = useMobile();
  return (
    <div>
      <Backdrop />
      <div className="claim-modal-step fixed left-0 top-1/2 z-[500] flex h-[90%] max-h-[50dvh] w-full flex-col gap-[15px] overflow-y-auto overflow-x-hidden rounded-t-3xl bg-white sm:z-50 md:left-1/2 md:top-1/2 md:h-auto md:max-h-[640px] md:w-[689px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[30px]">
        <div
          className="sticky left-0 right-0 top-0 z-[100] -mt-[1px] hidden h-[68px] bg-white px-[29px] py-[20px] md:block md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="relative flex items-center gap-[20px] md:p-0">
            <div className="flex w-[95%] items-center justify-center gap-2">
              <h2 className="text-center text-xl font-medium text-[#222222]">Claim Airspace</h2>
              <div
                onClick={() => setIsInfoVisible((prev) => !prev)}
                className="tems-center relative hidden h-[20px] w-[20px] justify-center md:block"
              >
                <InfoIcon />
                {isInfoVisible && (
                  <div className="absolute -top-4 left-6 w-[189px] rounded-[4px] bg-[#CCE3FC] p-[12px] text-[10px] font-normal italic">
                    Note that we store your data securely with advanced encryption and strict authentication measures to
                    ensure utmost privacy and protection.
                  </div>
                )}
              </div>
            </div>

            <div
              onClick={onCloseModal}
              className="absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block"
            >
              <CloseIconBlack />
            </div>
          </div>
        </div>
        <div className="mt-3 overflow-y-scroll md:mt-0">
          {isMobile && (
            <div onClick={onCloseModal} className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="mb-2 h-2.5 w-16 rounded-full bg-[#D9D9D9]"></div>
                <h1 className="text-lg font-semibold">Claim Airspace</h1>
              </div>
            </div>
          )}
          <div className="mt-4 px-[29px] md:mt-0">
            <div
              className="flex items-center gap-[10px] rounded-lg px-[22px] py-4"
              style={{ border: "1px solid #4285F4" }}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <LocationPointIcon />
              </div>
              {dontShowAddressOnInput ?
                <input
                  value={inputAddress}
                  onChange={(e) => {
                    setInputAddress(e.target.value);
                  }}
                  className="flex-1 text-[14px] text-[#222222] outline-none"
                  style={{ border: "none" }}
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="off"
                  placeholder="Enter address"
                />
              : <input
                  value={data?.address}
                  className="flex-1 text-[14px] text-[#222222] outline-none"
                  style={{ border: "none" }}
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="off"
                  placeholder="Enter address"
                />
              }
            </div>
            <div className="mt-3 flex flex-col gap-[5px] md:mt-4">
              <label htmlFor="name">
                Name of airspace<span className="text-[#E04F64]">*</span>
              </label>

              <input
                value={data?.title}
                onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-0.5 rounded-lg px-[22px] py-[16px] text-[14px] text-[#222222] outline-none md:mt-1"
                style={{ border: "1px solid #87878D" }}
                type="text"
                name="name"
                id="name"
                autoComplete="off"
              />
            </div>
            <div className="mt-2 flex flex-col gap-[10px] md:mt-3">
              <p className="text-[14px] font-normal text-[#838187]">Are you looking to Rent or Sell your airspace?</p>
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
              <h2 className="text-[20px] font-normal leading-[3rem] text-[#222222]">Rental Details</h2>
              <Link
                target="_blank"
                href={"https://skytrade.tawk.help"}
                className="cursor-pointer text-[14px] font-normal leading-[1.5rem] text-[#0653EA]"
              >
                Learn more about rentals in our FAQ.
              </Link>
              <div className="mt-4 items-center justify-between gap-[15px] md:flex">
                <div className="flex-1">
                  <VariableFeeRentalRangesSelect
                    fee={data?.transitFee}
                    setFee={(fee) => setData((prev) => ({ ...prev, transitFee: "" + fee }))}
                  />
                </div>
                <div className="mt-4 flex-1 md:mt-0">
                  <TimeZoneSelect setTimeZone={(timezone) => setData((prev) => ({ ...prev, timezone }))} data={data} />
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="mt-4 text-[14px] font-normal text-[#838187]">
                  Select extra features your facility provides
                </p>
                <div className="flex flex-col gap-[10px] leading-[2rem] md:flex-row md:items-center">
                  <div className="flex items-center gap-[5px]">
                    <input
                      className="h-[18px] w-[18px] cursor-pointer"
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
                    <label htmlFor="hasLandingDeck" className="text-[14px] font-normal text-[#87878D]">
                      Landing Deck
                    </label>
                  </div>
                  <div className="mt-1 flex items-center gap-[5px]">
                    <input
                      className="h-[18px] w-[18px] cursor-pointer"
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
                    <label htmlFor="hasChargingStation" className="text-[14px] font-normal text-[#87878D]">
                      Charging Station
                    </label>
                  </div>
                  <div className="mt-1 flex items-center gap-[5px]">
                    <input
                      className="h-[18px] w-[18px] cursor-pointer"
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
                    <label htmlFor="hasStorageHub" className="text-[14px] font-normal text-[#87878D]">
                      Storage Hub
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-[15px]">
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
                  <h2 className="text-[20px] font-normal text-[#222222]">Selling Details</h2>
                  <div
                    onClick={() => setIsInfoVisible((prev) => !prev)}
                    className="relative flex h-[20px] w-[20px] items-center justify-center"
                  >
                    <InfoIcon />
                    {isInfoVisible && (
                      <div className="absolute -top-4 left-6 w-[189px] rounded-[4px] bg-[#CCE3FC] p-[12px] text-[10px] font-normal italic">
                        Note that rental availability are not applicable to your selling
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  href={"https://skytrade.tawk.help"}
                  className="cursor-pointer text-[14px] font-normal text-[#0653EA]"
                >
                  Learn more about selling in our FAQ.
                </Link>
                <div className="flex flex-col gap-[5px]">
                  <label className="text-[14px] font-normal text-[#838187]" htmlFor="sellingPrice">
                    Selling Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-[22px] text-[14px] text-[#222222]">
                      $
                    </span>
                    <input
                      className="w-full rounded-lg py-[16px] pl-[31px] text-[14px] text-[#222222] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
              <p className="text-[16px] font-normal text-[#838187] md:text-[14px]">
                Do you currently have zoning or planning permission to develop above your land or property?{" "}
                <span className="text-[12px] italic md:text-[10px]">
                  (Your answer won&apos;t affect your claim)
                  <span className="text-[#E04F64]">*</span>
                </span>{" "}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-[7px] text-[14px] text-[#87878D]">
              <input
                className="relative h-[16.67px] w-[16.67px] cursor-pointer bg-cover p-[2.5px]"
                checked={data?.hasPlanningPermission === "true"}
                onChange={() =>
                  setData((prev) => ({
                    ...prev,
                    hasPlanningPermission: "true",
                  }))
                }
                style={{
                  appearance: "none",
                  border: data?.hasPlanningPermission !== "true" ? "2px solid #222222" : "2px solid #0653EA",
                  backgroundColor: data?.hasPlanningPermission === "true" ? "#0653EA" : "transparent",
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
                  setData((prev) => ({
                    ...prev,
                    hasPlanningPermission: "false",
                  }))
                }
                style={{
                  appearance: "none",
                  border: data?.hasPlanningPermission !== "false" ? "2px solid #222222" : "2px solid #0653EA",
                  backgroundColor: data?.hasPlanningPermission === "false" ? "#0653EA" : "transparent",
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
                onChange={() => setData((prev) => ({ ...prev, hasPlanningPermission: null }))}
                style={{
                  appearance: "none",
                  border: data?.hasPlanningPermission ? "2px solid #222222" : "2px solid #0653EA",
                  backgroundColor: !data?.hasPlanningPermission ? "#0653EA" : "transparent",
                  borderRadius: "50%",
                  backgroundClip: "content-box",
                }}
                type="checkbox"
                name="zone-dont-know"
                id="zone-dont-know"
              />
              <label htmlFor="zone-dont-know">I don&apos;t Know</label>
            </div>

            <div className="my-8 flex items-center gap-[20px] text-[14px] md:justify-center">
              <div
                onClick={onCloseModal}
                className="cursor-pointer rounded-[5px] px-[22px] py-[10px] text-[#0653EA]"
                style={{ border: "1px solid #0653EA" }}
              >
                Cancel
              </div>

              <div className="Claim-airspacebtn2-step w-[75%] cursor-pointer rounded-[5px] bg-[#0653EA] px-[22px] py-[10px] text-white md:w-[25%]">
                <div className="flex w-full items-center justify-center">
                  <LoadingButton onClick={() => onClaim(inputAddress)} isLoading={claimButtonLoading} color={"white"}>
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
