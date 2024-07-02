import React, { useState } from "react";
import BidAirspaceHeader from "./BidHeader";
import { LocationPointIcon, RectangleIcon } from "@/Components/Icons";
import Image1 from "@/public/images/AHImage.png";
import Image from "next/image";
import Accordion from "./Accordion";
import CustomTable from "./CustomTable";
import AirspaceHistory from "./AirspaceHistory";
import { useMobile } from "@/hooks/useMobile";
import { getTimeLeft } from "@/utils/marketplaceUtils/getTimeLeft";
interface BidDetailsProps {
  auctionDetailData:any;
  onCloseModal: () => void;
  onPlaceBid:() => void;
  currentUserBid:number;
  setCurrentUserBid:any;
}

const BidDetails: React.FC<BidDetailsProps> = ({
  auctionDetailData,

  onCloseModal,
  onPlaceBid,
  setCurrentUserBid,
  currentUserBid
}) => {
  const { isMobile } = useMobile();
  const previousBidData = [
    {
      price: 100,
      date: "15 december 2023",
      from: "Jane Doe",
    },
    {
      price: 95,
      date: "5 december 2023",
      from: "Jane Doe",
    },
    {
      price: 91,
      date: "29 november 2023",
      from: "Jane Doe",
    },
  ];
  const airspaceHistoryMockData = [
    {
      price: "Rental",
      date: "15 december 2023",
      from: "bcndkl,spuifijdczvè”yçh",
    },
    {
      price: "Rental",
      date: "5 december 2023",
      from: "bvqnx,,qzidjcn-’bfszdxd",
    },
    {
      price: "Sell",
      date: "29 november 2023",
      from: "adncjdjf, chzjneofjiochui",
    },
  ];
  console.log(auctionDetailData,"auction detail")
  const handleCurrentBidInputChanged = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    const decimalCount = inputValue.split(".").length - 1;
    if (decimalCount > 1) {
      inputValue = inputValue.slice(0, inputValue.lastIndexOf("."));
    }

    setCurrentUserBid(inputValue);
  };
  const totalBId = 3;
  // const endDate = new Date('2024-06-28T16:48:21.658Z');
  const endDate = new Date(auctionDetailData?.endDate);
  const timeLeft = getTimeLeft(endDate)
  console.log(auctionDetailData,"hello 2")
  return (
    <div>
      <div className="fixed bottom-0  sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white rounded-t-[30px] md:rounded-[30px] w-full h-[82%] md:h-[640px] overflow-y-auto overflow-x-auto md:w-[689px] z-[500] sm:z-50 flex flex-col gap-[15px] ">
        {isMobile && (
          <div
            onClick={onCloseModal}
            className=" flex flex-col justify-end items-center mt-4 md:mt-0 "
          >
            <div className=" w-[90%] flex justify-center  items-center">
              <RectangleIcon />
            </div>
          </div>
        )}
        <div
          className="z-[100] sticky top-0 left-0 right-0 bg-white py-[20px] px-[29px] -mt-[1px] flex flex-col gap-[15px] shadow-[0_12px_34px_-10px_rgba(58, 77, 233, 0.15)]"
        >
          <BidAirspaceHeader onCloseModal={onCloseModal} />
          <div
            className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg h-[46px]"
            style={{ border: "1px solid #4285F4" }}
          >
            <div className="w-6 h-6">
              <LocationPointIcon />
            </div>
            <p className="font-normal text-[#222222] text-[14px] flex-1">
              {auctionDetailData?.properties[0]?.address}
            </p>
          </div>
          <div>
            <div className="relative border-2 h-[130px]">
              <Image
                src={auctionDetailData?.metadata?.data?.uri ? auctionDetailData?.metadata?.data?.uri : Image1}
                alt="airspace image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="flex justify-between px-[15px] py-[10px]  bg-[#4285F4] bg-opacity-5">
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] leading-[26px] text-[#727272]">
                Highest Bid
              </p>
              <h1 className="text-[14px]  leading-[26px] font-bold text-[#050505]">
                ${auctionDetailData?.highestBid}
              </h1>
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px]  text-[#727272]">Time left</p>
              <h1 className="text-[14px] font-bold text-[#050505]">
                {timeLeft}
              </h1>
            </div>
          </div>
          <div>
            <div className="flex pb-[5px]">
              <p className="text-[#838187] text-[14px] leading-[21px]">
                Your Bid
              </p>
              <span className="text-[#E04F64]">*</span>
            </div>
            <div
              className=" flex w-full items-center text-[#232F4A] py-[14px] px-[22px] rounded-lg h-[46px]"
              style={{ border: "1px solid #87878D" }}
            >
              <label
                className=" text-[14px] font-normal leading-[21px]"
              >
                $
              </label>
              <input
                type="text"
                name="currentBid"
                id="currentBid"
                placeholder="place your bid here"
                value={currentUserBid}
                required
                onChange={handleCurrentBidInputChanged}
                className="appearance-none outline-none border-none flex-1 text-[14px] leading-[21px] "
              />
            </div>
          </div>
          <div className="w-full bg-[#0653EA] text-white rounded-lg ">
            <button disabled={!currentUserBid} className="w-full h-[42px]" onClick={onPlaceBid}>Place a Bid</button>
          </div>
          {/* <hr />
          <div>
            <Accordion
              title={`Previous Bid (${totalBId})`}
              content={<CustomTable header={["Price", "Date", "From"]} body={previousBidData} />}
            />
          </div>
          <hr /> */}
          {/* <div>
            <Accordion
              title={"Airspace History"}
              content={
                <AirspaceHistory
                  airspaceHistory={airspaceHistoryMockData}
                  totalLifeTimeIncome={200.0}
                  MtdTotalIncome={200.0}
                  WtdTotalIncome={200.0}
                />
              }
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BidDetails;
