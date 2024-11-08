"use client";

import React, { useState, useEffect } from "react";
import { AuctionPropertyI, PropertyData } from "@/types";
import { IoClose } from "react-icons/io5";
import AuctionItem from "./AuctionItem";
import Button from "../Shared/Button";
import useAuction, { TransactionStatusEnum } from "@/hooks/useAuction";
import Spinner from "../Spinner";
import SuccessFailPopup from "./SuccessFailPopup";
import { HiMiniPlusSmall, HiMiniMinusSmall } from "react-icons/hi2";
import Link from "next/link";

interface CreateAuctionModalProps {
  onClose: any;
  data: AuctionPropertyI[];
}

const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({ onClose, data }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [airspaces, setAirspaces] = useState<PropertyData[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    loading,
    airspaceList,
    handleNextPage,
    handlePrevPage,
    hasMore,
    handleSelectItem,
    handleAddProperties,
    handleUpdateItem,
    txHash,
    pageNumber,
    isProcessing,
    setIsProcessing,
    transactionStatus,
    responseStatus,
    selectedItemId,
    selectedItems,
    airspaceAddress,
  } = useAuction();

  useEffect(() => {
    setAirspaces(airspaceList);
  }, [airspaceList]);

  if (isMobile) {
    return (
      <>
        {isProcessing ?
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#294B63] bg-opacity-50 pt-32 backdrop-blur-[2px]">
            {transactionStatus === TransactionStatusEnum.PENDING ?
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <Spinner />
                <span className="animate-pulse font-semibold text-white">Processing...</span>
              </div>
            : <SuccessFailPopup
                responseStatus={responseStatus}
                setShowSuccessAndErrorPopup={setIsProcessing}
                data={{
                  address: airspaceAddress,
                }}
                popupType={"CREATE"}
                txHash={txHash || ""}
                setShowDetail={onClose}
              />
            }
          </div>
        : <div className="fixed bottom-0 left-0 z-50 flex h-full w-full items-end bg-black bg-opacity-50">
            <div className="relative flex h-[685px] w-full flex-col justify-between overflow-y-scroll rounded-t-[30px] bg-white p-8">
              <div onClick={onClose} className="absolute right-[1rem] top-[1rem] cursor-pointer">
                <IoClose className="h-4 w-4" />
              </div>

              <div className="text-center">Create Auction</div>
              <div className="flex justify-between">
                {" "}
                <div className="py-2">Select Air Right to auction</div>
                {airspaces.length > 0 && (
                  <div className="flex items-center gap-1 text-black">
                    <button
                      disabled={pageNumber === 1}
                      onClick={handlePrevPage}
                      className={` ${pageNumber === 1 ? "text-slate-300" : "cursor-pointer hover:bg-light-grey hover:text-white"} rounded border transition duration-200 ease-in-out`}
                    >
                      <HiMiniMinusSmall />
                    </button>
                    {pageNumber}
                    <button
                      disabled={!hasMore}
                      onClick={handleNextPage}
                      className={` ${!hasMore ? "text-slate-300" : "cursor-pointer hover:bg-light-grey hover:text-white"} rounded border transition duration-200 ease-in-out`}
                    >
                      <HiMiniPlusSmall />
                    </button>
                  </div>
                )}
              </div>

              {loading ?
                <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                  <Spinner />
                  <span className="animate-pulse">Fetching Verified Airspaces...</span>
                </div>
              : <div className="max-h-4/5 thin-scrollbar mb-24 overflow-y-scroll">
                  {airspaces && airspaces.length > 0 ?
                    <div className="thin-scrollbar flex flex-col gap-3">
                      {airspaces?.length > 0 &&
                        airspaces?.map((item, index) => (
                          <AuctionItem
                            data={item}
                            key={index}
                            onSelectItem={handleSelectItem}
                            onUpdateItem={handleUpdateItem}
                            selected={!!selectedItems.find((selectedItem) => selectedItem.propertyId === item.id)}
                            //@ts-ignore
                            disabled={selectedItemId !== null && selectedItemId !== item.id}
                          />
                        ))}
                    </div>
                  : <div className="col-span-2 text-center text-light-grey">
                      You must have at least one verified airspace to create an auction
                    </div>
                  }
                </div>
              }

              <div className="absolute bottom-[80px] mx-auto w-10/12">
                <Button label="Add Properties to Auction" onClick={handleAddProperties} />
              </div>
            </div>
          </div>
        }
      </>
    );
  }

  return (
    <>
      {isProcessing ?
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#294B63] bg-opacity-50 py-32 backdrop-blur-[2px]">
          {transactionStatus === TransactionStatusEnum.PENDING ?
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <span className="animate-pulse font-semibold text-white">Processing...</span>
            </div>
          : <SuccessFailPopup
              responseStatus={responseStatus}
              setShowSuccessAndErrorPopup={setIsProcessing}
              data={{
                address: airspaceAddress,
              }}
              popupType={"CREATE"}
              txHash={txHash || ""}
              setShowDetail={onClose}
            />
          }
        </div>
      : <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="dark:text-darkText relative flex h-[685px] w-full flex-col gap-8 rounded-[30px] bg-white px-8 py-6 md:w-[689px]">
            <div onClick={onClose} className="absolute right-[1rem] top-[1rem] cursor-pointer">
              <IoClose className="h-4 w-4" />
            </div>

            <div className="text-center">Create Auction</div>
            <div className="flex w-full justify-between">
              {" "}
              <div>{airspaces && airspaces.length > 0 && "Select the properties you want to auctions"}</div>
              {airspaces.length > 0 && (
                <div className="flex items-center gap-2 text-black">
                  <button
                    disabled={pageNumber === 1}
                    onClick={handlePrevPage}
                    className={` ${pageNumber === 1 ? "text-slate-300" : "cursor-pointer hover:bg-light-grey hover:text-white"} rounded border transition duration-200 ease-in-out`}
                  >
                    <HiMiniMinusSmall />
                  </button>
                  <span className="font-sm font-thin">{pageNumber}</span>
                  <button
                    disabled={!hasMore}
                    onClick={handleNextPage}
                    className={` ${!hasMore ? "text-slate-300" : "cursor-pointer hover:bg-light-grey hover:text-white"} rounded border transition duration-200 ease-in-out`}
                  >
                    <HiMiniPlusSmall />
                  </button>
                </div>
              )}
            </div>

            {loading ?
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <Spinner />
                <span className="animate-pulse">
                  {pageNumber === 1 ? "Fetching Verified Airspaces..." : "Fetching some more..."}
                </span>
              </div>
            : <div className="thin-scrollbar flex h-[450px] flex-col gap-3 overflow-auto">
                {airspaces?.length > 0 ?
                  airspaces?.map((item, index) => (
                    <AuctionItem
                      data={item}
                      key={index}
                      onSelectItem={handleSelectItem}
                      onUpdateItem={handleUpdateItem}
                      selected={!!selectedItems.find((selectedItem) => selectedItem.propertyId === item.id)}
                      //@ts-ignore
                      disabled={selectedItemId !== null && selectedItemId !== item.id}
                    />
                  ))
                : <div className="col-span-2 px-8 text-center text-light-grey">
                    No Airspace(s) available to auction,{" "}
                    <Link className="text-dark-blue" href={"/airspaces"}>
                      claim and verify
                    </Link>{" "}
                    an airpace to continue
                  </div>
                }
              </div>
            }

            <div className="flex justify-between gap-4">
              <Button secondary label="Cancel" onClick={onClose} />
              <Button
                disabled={!airspaces || airspaces.length === 0}
                label="Add Properties to Auction"
                onClick={handleAddProperties}
              />
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default CreateAuctionModal;
