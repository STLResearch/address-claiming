"use client";

import React, { Fragment, SetStateAction, useEffect, useState } from "react";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import PropertiesService from "@/services/PropertiesService";
import { PropertyData, RequestDocument } from "@/types";
import { calculateTimeLeft, formatDate } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import TransferCertificate from "./TransferCertificate";
import { ArrowLeftIcon, CloseIcon, LocationPointIcon } from "../Icons";
import { Page, Text, View, Document, StyleSheet, pdf, Image as Img } from "@react-pdf/renderer";
import { useAppSelector } from "@/redux/store";
import { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import UploadVerifiedDocuments from "./UploadedVerifiedDocuments";
import Backdrop from "../Backdrop";
import MarketplaceService from "@/services/MarketplaceService";
import { getMapboxStaticImage } from "@/utils/marketPlaceUtils";
import Accordion from "../Buy/BidDetail/Accordion";
import CustomTable from "../Buy/BidDetail/CustomTable";
import Spinner from "../Spinner";
import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import { fetchMapboxStaticImage } from "@/utils/getMapboxStaticImage";
import AirspaceDetails from "./AirspaceDetails";

interface ModalProps {
  airspace: any;
  onCloseModal: () => void;
  isOffer?: boolean;
  pageNumber?: number;
}


const Modal = ({ airspace, onCloseModal, isOffer, pageNumber = 0 }: ModalProps) => {
  const router = useRouter();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const property = airspace?.auction?.layer?.property;
  const [inputValue, setInputValue] = useState(airspace?.address);
  const { editAirSpaceAddress } = PropertiesService();
  const [isLoading, setIsLoading] = useState(false);
  const { getUnverifiedAirspaces } = AirspaceRentalService();
  const imageUrl = getMapboxStaticImage(property?.latitude, property?.longitude);
  const [imageUrls, setImagaeUrls] = useState("");

  const { user, activePortfolioTab } = useAppSelector((state) => {
    const { user, activePortfolioTab } = state.userReducer;
    return { user, activePortfolioTab };
  });

 

  const handleGenerateAuctionCertificate = async () => {
    const auctionId = airspace?.auction?.id;
    const dateOfTransfer = formatDate(airspace?.auction?.endDate);
    const amount = `${airspace?.auction?.currentPrice}`;
    const longitude = airspace?.auction?.layer?.property?.longitude;
    const latitude = airspace?.auction?.layer?.property?.latitude;
    const address = airspace?.auction?.layer?.property?.address;

    const certificate = (
      <TransferCertificate
        user={user}
        longitude={longitude}
        latitude={latitude}
        auctionId={auctionId}
        dateOfTransfer={dateOfTransfer}
        amount={amount}
        address={address}
      />
    );

    const blob = await pdf(certificate).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };


  useEffect(() => {
    const handelAirspaceImage = async () => {
      const url = await fetchMapboxStaticImage(airspace?.latitude, airspace?.longitude);
      setImagaeUrls(url);
    };
    handelAirspaceImage();
  }, []);

  return (
    <Fragment>
      <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
      {airspace.type === "placedBid" || airspace.type === "receivedBid" ?
        <div className="fixed left-1/2 top-1/2 z-[500] flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-[15px] bg-white px-[29px] py-[30px] md:z-50 md:h-auto md:w-[689px] md:rounded-[30px]">
          <div
            className="relative -mx-[29px] -mt-[30px] flex items-center gap-[20px] px-[29px] py-[20px] md:mx-0 md:my-0 md:p-0 md:shadow-none"
            style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
          >
            <div className="h-[12px] w-[16px] md:hidden" onClick={onCloseModal}>
              <ArrowLeftIcon />
            </div>

            <h2 className="break-words text-center text-xl font-medium text-[#222222]">
              {property?.title > 60 ? property?.title.slice(0, 57) + " ..." : property?.title}
            </h2>

            <div
              onClick={onCloseModal}
              className="absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block"
            >
              <IoCloseSharp className="h-4 w-4 text-black" />
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-[10px] rounded-lg px-[22px] py-4"
            style={{ border: "1px solid #4285F4" }}
          >
            <div className="flex items-end gap-3">
              <div className="h-6 w-6">
                <LocationPointIcon />
              </div>
              <p className="flex-1 break-words text-[14px] font-normal text-[#222222]">
                {airspace?.auction?.layer?.property?.address}
              </p>
            </div>

            {calculateTimeLeft(airspace?.auction?.endDate).toLowerCase() === "ended" &&
              airspace?.auction?.currentBidder === user?.blockchainAddress && (
                <button onClick={handleGenerateAuctionCertificate} className="rounded bg-blue-500 px-2 py-1 text-white">
                  Generate Certificate
                </button>
              )}
          </div>

          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-[#222222]">ID:</p>
            <p className="break-all text-[14px] font-normal text-[#87878D]">{airspace?.auction?.assetId}</p>
          </div>

          {airspace?.placedBid?.price && (
            <div className="flex gap-[15px]">
              <p className="text-[14px] font-normal text-[#222222]">Your Bid:</p>
              <p className="break-all text-[14px] font-normal text-[#87878D]">${airspace?.placedBid?.price}</p>
            </div>
          )}

          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-[#222222]">Highest Bid:</p>
            <p className="break-all text-[14px] font-normal text-[#87878D]">${airspace?.auction?.currentPrice}</p>
          </div>

          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-[#222222]">Highest Bidder:</p>
            <p className="break-all text-[14px] font-normal text-[#87878D]">{airspace?.auction?.currentBidder}</p>
          </div>

          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-[#222222]">Time Left:</p>
            <p className="break-all text-[14px] font-normal text-[#87878D]">
              {calculateTimeLeft(airspace?.auction?.endDate)}
            </p>
          </div>

          <div className="relative h-32 w-full">
            <Image
              src={imageUrl}
              alt={`Map at ${property?.latitude}, ${property?.longitude}`}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <hr />
          <div className="opacity-60">
            <Accordion
              title={`Previous Bids (${bids.length})`}
              content={<CustomTable header={["Price($)", "From"]} auctionBids={bids} />}
            />

            {loading && (
              <div className="my-4">
                <Spinner />
              </div>
            )}
          </div>
          <hr />

          <div className="-mx-[30px] -mb-[30px] mt-auto flex gap-[20px] px-[14px] py-[16px] md:mx-0 md:mb-0 md:mt-[15px] md:px-0 md:py-0">
            <div
              onClick={onCloseModal}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-white px-[20px] py-[10px] text-center text-[#0653EA]"
              style={{ border: "1px solid #0653EA" }}
            >
              Cancel
            </div>
            <button
              onClick={() =>
                router.push(
                  calculateTimeLeft(airspace?.auction?.endDate).toLowerCase() === "ended" ?
                    "/funds"
                  : `/buy?auctionId=${airspace?.auction?.id}&bid=true`
                )
              }
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] border border-[#0653EA] bg-white px-[20px] py-[10px] text-center text-[#0653EA]"
            >
              {calculateTimeLeft(airspace?.auction?.endDate).toLowerCase() === "ended" ?
                "View Transaction"
              : airspace.type === "placedBid" ?
                "Place Higher Bid"
              : "View Auction"}{" "}
            </button>
          </div>
        </div>
      : <AirspaceDetails airspace={airspace} onCloseModal={ onCloseModal}/>
      }
    </Fragment>
  );
};

export default Modal;
