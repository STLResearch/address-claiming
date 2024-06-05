import React from "react";
import { ChevronRightIcon, LocationPointIcon } from "../Icons";

const PortfolioItemMobile = ({ airspaceName, tags, type, selectAirspace }) => {
    return ( 
        <div
        onClick={selectAirspace}
        className="flex shadow-md px-4 py-6 items-center justify-between gap-[10px] rounded-lg bg-white cursor-pointer w-screen"

      >
        <div className="flex items-center gap-[10px] flex-1">
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <p className="font-normal text-[#222222] text-[14px] flex-1">
            {airspaceName.length > 15 ?  airspaceName.slice(0, 25) + ' ...' : airspaceName}
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
        );
}
 
export default PortfolioItemMobile;