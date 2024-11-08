import React, { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  DocumentApprovedIcon,
  DocumentRejectedIcon,
  LocationPointIcon,
  ReviewVerificationIcon,
} from "../Icons";
import { calculateTimeLeft, shortenAddress } from "@/utils";

import { useRouter } from "next/navigation";
import UploadedDocuments from "./UploadedDocuments";
import AdditionalDocuments from "./AdditionalDocuments";
import VerificationSuccessPopup from "./VerificationSuccessPopup";
import { RequestDocumentStatus } from "@/types";
import { RxLapTimer } from "react-icons/rx";

const PortfolioItem = ({ airspace, selectAirspace, setUploadedDoc, requestDocument }) => {
  const router = useRouter();
  const { type, address, property } = airspace;
  const [showPopup, setShowPopup] = useState(false);
  const [underReview, setUnderReview] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [badgeCountdown, setBadgeCountdown] = useState("");

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const getHighestBid = () => {
    const highestBid = airspace?.auction?.currentPrice;

    return `$${highestBid}`;
  };

  const handleOutBidCheck = () => {
    return airspace.placedBid.price < airspace.auction.currentPrice;
  };

  function formatCountdown(endTime) {
    const now = new Date();
    //@ts-ignore
    const timeDifference = endTime - now;

    if (timeDifference <= 0) return "Expired";

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}D : ${hours}H : ${minutes}m left`;
  }

  useEffect(() => {
    if (type === "placedBid" && airspace?.auction?.hasEnded) {
      const endTime = new Date(airspace.auction.endDate);
      const countdownEndTime = new Date(endTime.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Set the initial countdown immediately
      setBadgeCountdown(formatCountdown(countdownEndTime));

      const intervalId = setInterval(() => {
        const formattedCountdown = formatCountdown(countdownEndTime);
        setBadgeCountdown(formattedCountdown);

        if (formattedCountdown === "Expired") {
          clearInterval(intervalId);
        }
      }, 60000); // Update every minute

      return () => clearInterval(intervalId);
    }
  }, [type, airspace?.auction?.hasEnded, airspace?.auction?.endDate]);

  return (
    <>
      {type === "receivedBid" || type === "placedBid" ?
        <div
          onClick={selectAirspace}
          className="flex cursor-pointer items-center justify-between gap-[10px] rounded-lg bg-white p-[11px]"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex flex-1 items-center gap-[10px]">
            <div className="h-6 w-6">
              <LocationPointIcon />
            </div>
            <p className="flex-1 text-[14px] font-normal text-[#222222]">
              {type === "receivedBid" && "My Airspace -"}{" "}
              {shortenAddress(airspace?.auction?.layer?.property?.address, 35)}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {type === "placedBid" && (
              <div>
                Your Bid: <span className="font-bold">${airspace?.placedBid?.price}</span>
              </div>
            )}
            <div>
              Highest Bid: <span className="font-bold">{getHighestBid()}</span>
            </div>

            <div>
              Time Left: <span className="font-bold">{calculateTimeLeft(airspace?.auction?.endDate)}</span>
            </div>

            {/* Show red badge with countdown for 7 days after auction ends */}
            {/* {type === "placedBid" && airspace?.auction?.hasEnded && (
              <div className="flex items-center gap-2 rounded bg-red-500 px-2 py-1 text-white">
                <RxLapTimer className="h-4 w-4" /> {badgeCountdown}
              </div>
            )} */}

            {type === "placedBid" && airspace?.auction?.hasEnded && handleOutBidCheck() ?
              <button
                className="rounded bg-blue-500 p-1 px-2 text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`/buy?auctionId=${airspace?.auction?.id}&bid=true`);
                }}
              >
                Place Higher Bid
              </button>
            : <button className="rounded bg-blue-500 p-1 px-2 text-white">Auction History</button>}

            <div className="h-[14px] w-[7px]">
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      : <div
          onClick={selectAirspace}
          className="cursor-pointer items-center justify-between gap-[10px] rounded-lg bg-white p-[11px]"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex cursor-pointer items-center justify-between gap-[10px]">
            <div className="flex flex-1 items-center gap-[10px]">
              <div className="h-6 w-6">
                <LocationPointIcon />
              </div>
              <p className="flex-1 text-[14px] font-normal text-[#222222]">{address}</p>
            </div>
            <div className="flex items-center gap-[10px]">
              {property && property?.noFlyZone && (
                <div className="cursor-pointer rounded-[3px] bg-[#222222] px-[7px] text-sm font-normal text-white">
                  No Fly Zone
                </div>
              )}

              {property && property.layers[0].isCurrentlyInAuction && (
                <div className="cursor-pointer rounded-[3px] bg-gray-300 px-[7px] text-sm font-normal text-black">
                  on Sale
                </div>
              )}

              {property && property.isCurrentlyRented && (
                <div className="cursor-pointer rounded-[3px] bg-gray-300 px-[7px] text-sm font-normal text-black">
                  on Rent
                </div>
              )}

              {requestDocument && requestDocument?.length > 0 && !requestDocument[0]?.document && !underReview && (
                <div onClick={handleButtonClick} className="rounded-md border border-orange-500 p-2">
                  <p className="text-sm font-normal text-orange-500">Additional documents requested</p>
                </div>
              )}
              {((requestDocument && requestDocument[0]?.status === "SUBMITTED") || underReview) && (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-6 w-6">
                    <ReviewVerificationIcon />
                  </div>
                  <p className="text-sm font-normal text-orange-500">Documents under review</p>
                </div>
              )}
              {requestDocument && requestDocument[0]?.status === "APPROVED" && (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-6 w-6">
                    <DocumentApprovedIcon />
                  </div>
                  <p className="text-sm font-normal text-[#1FD387]">Documents approved</p>
                </div>
              )}
              {requestDocument && requestDocument[0]?.status === "REJECTED" && (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-6 w-6">
                    <DocumentRejectedIcon />
                  </div>
                  <p className="text-sm font-normal text-[#E04F64]">Documents rejected</p>
                </div>
              )}
              <div className="h-[14px] w-[7px]">
                <ChevronRightIcon />
              </div>
            </div>
          </div>

          {((requestDocument &&
            requestDocument?.length > 0 &&
            requestDocument[0]?.document &&
            requestDocument[0]?.status !== RequestDocumentStatus.NOT_SUBMITTED) ||
            underReview) && <UploadedDocuments requestDocument={requestDocument} />}
          {showPopup && !underReview && (
            <AdditionalDocuments
              setUnderReview={setUnderReview}
              showPopup={showPopup}
              setUploadedDoc={setUploadedDoc}
              setShowSuccessToast={setShowSuccessToast}
              closePopup={closePopup}
              requestDocument={requestDocument[0]}
            />
          )}

          {showSuccessToast && <VerificationSuccessPopup />}
        </div>
      }
    </>
  );
};

export default PortfolioItem;
