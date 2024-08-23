import React from "react";
import { ChevronRightIcon, LocationPointIcon } from "../Icons";
import { calculateTimeLeft, shortenAddress } from "@/utils";
import { getTimeLeft } from "@/utils/marketplaceUtils";
import Button from "../Shared/Button";

const PortfolioItem = ({ airspace, selectAirspace, tags }) => {
  const { type, address } = airspace;
  console.log({ airspace });

  const getHighestBid = () => {
    let highestBid = 0;
    if (airspace) {
      for (let item of airspace.auction.AuctionBid) {
        if (item.price > highestBid) {
          highestBid = item.price;
        }
      }
    }
    return `$${highestBid}`;
  };

  return (
    <>
      {type === "receivedBid" || type === "placedBid" ? (
        <div
          onClick={selectAirspace}
          className="flex p-[11px] items-center justify-between gap-[10px] rounded-lg bg-white cursor-pointer"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center gap-[10px] flex-1">
            <div className="w-6 h-6">
              <LocationPointIcon />
            </div>
            <p className="font-normal text-[#222222] text-[14px] flex-1">
              {type === "receivedBid" && "My Airspace -"}{" "}
              {shortenAddress(airspace?.auction?.layer?.property?.address, 35)}
            </p>
          </div>
          <div className="flex gap-6 items-center text-sm">
            <div>
              Highest Bid: <span className="font-bold">{getHighestBid()}</span>
            </div>

            <div>
              Time Left:{" "}
              <span className="font-bold">
                {calculateTimeLeft(airspace?.auction?.endDate)}
              </span>
            </div>

            <button className="text-sm px-4 py-2 bg-[#4285F4] text-white rounded">
              Auction History
            </button>

            <div className="w-[7px] h-[14px]">
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={selectAirspace}
          className="flex p-[11px] items-center justify-between gap-[10px] rounded-lg bg-white cursor-pointer"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center gap-[10px] flex-1">
            <div className="w-6 h-6">
              <LocationPointIcon />
            </div>
            <p className="font-normal text-[#222222] text-[14px] flex-1">
              {address}
            </p>
          </div>
          <div className="flex gap-[10px] items-center">
            {!!tags[0] && (
              <div className="bg-[#DBDBDB] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
                {type === "land" ? "On Claim" : "On Rent"}
              </div>
            )}
            {!!tags[1] && (
              <div className="bg-[#E7E6E6] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
                On Sale
              </div>
            )}
            {!!tags[2] && (
              <div className="bg-[#222222] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
                No Fly Zone
              </div>
            )}
            {!!tags[3] && (
              <div className="bg-[#E04F64] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
                Review Offer
              </div>
            )}
            <div className="w-[7px] h-[14px]">
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioItem;
