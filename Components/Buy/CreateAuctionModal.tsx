"use client";

import { useContext, useState, useEffect } from "react";
import { AuctionPropertyI, PropertyData } from "@/types";
import { IoClose } from "react-icons/io5";
import AuctionItem from "./AuctionItem";
import Button from "../Shared/Button";
import useAuction, { TransactionStatusEnum } from "@/hooks/useAuction";
import Spinner from "../Spinner";
import SuccessFailPopup from "./SuccessFailPopup";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiMiniPlusSmall, HiMiniMinusSmall } from "react-icons/hi2";

interface CreateAuctionModalProps {
  onClose: any;
  data: AuctionPropertyI[];
}

const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({
  onClose,
  data,
}) => {
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
  } = useAuction();

  useEffect(() => {
    if (pageNumber < 3) {
      const valid = airspaceList.filter((item) => item.status === 1);
      setAirspaces(valid);
    } else {
      console.log("================================");
      console.log({ airspaceList });
      console.log("================================");
    }
  }, [airspaceList]);

  console.log({ airspaceList });

  if (isMobile) {
    return (
      <>
        {isProcessing ? (
          <div className="fixed inset-0 z-50 flex items-start pt-32 justify-center bg-[#294B63] bg-opacity-50 backdrop-blur-[2px]">
            {transactionStatus === TransactionStatusEnum.PENDING ? (
              <div className="w-full h-full gap-4 flex flex-col items-center justify-center">
                <Spinner />
                <span className="animate-pulse text-white font-semibold">
                  Processing...
                </span>
              </div>
            ) : (
              <SuccessFailPopup
                responseStatus={responseStatus}
                setShowSuccessAndErrorPopup={setIsProcessing}
                data={{
                  address: selectedItems[0].name,
                }}
                popupType={"CREATE"}
                txHash={txHash || ""}
                setShowDetail={onClose}
              />
            )}
          </div>
        ) : (
          <div className="fixed bottom-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-end">
            <div className="relative flex flex-col justify-between w-full h-[685px] bg-white rounded-t-[30px] p-8">
              <div
                onClick={onClose}
                className="absolute right-[1rem] top-[1rem] cursor-pointer"
              >
                <IoClose className="w-4 h-4" />
              </div>

              <div className="text-center">Create Auction</div>
              <div className="flex justify-between">
                {" "}
                <div>Select the Airspace you would like to auction</div>
                <div className="text-black">
                  <HiMiniPlusSmall />
                  {pageNumber}
                  <HiMiniMinusSmall />
                </div>
              </div>

              {loading ? (
                <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                  <Spinner />
                  <span className="animate-pulse">
                    Fetching Verified Airspaces...
                  </span>
                </div>
              ) : (
                <>
                  {airspaces && airspaces.length > 0 ? (
                    <div className="flex flex-col gap-3 thin-scrollbar">
                      {airspaces?.length > 0 &&
                        airspaces?.map((item, index) => (
                          <AuctionItem
                            data={item}
                            key={index}
                            onSelectItem={handleSelectItem}
                            onUpdateItem={handleUpdateItem}
                            selected={
                              !!selectedItems.find(
                                (selectedItem) =>
                                  selectedItem.propertyId === item.propertyId
                              )
                            }
                            disabled={
                              selectedItemId !== null &&
                              selectedItemId !== item.propertyId
                            } // Disable if another item is selected
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center col-span-2 text-light-grey">
                      You must have at least one verified airspace to create an
                      auction
                    </div>
                  )}
                </>
              )}

              {/* <div className="flex justify-between gap-4"> */}
              <Button
                label="Add Properties to Auction"
                onClick={handleAddProperties}
              />
              {/* </div> */}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {isProcessing ? (
        <div className="fixed inset-0 z-50 flex items-start py-32 justify-center bg-[#294B63] bg-opacity-50 backdrop-blur-[2px]	">
          {transactionStatus === TransactionStatusEnum.PENDING ? (
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
              <Spinner />
              <span className="animate-pulse text-white font-semibold">
                Processing...
              </span>
            </div>
          ) : (
            <SuccessFailPopup
              responseStatus={responseStatus}
              setShowSuccessAndErrorPopup={setIsProcessing}
              data={{
                address: selectedItems.length ? selectedItems[0].name : "",
              }}
              popupType={"CREATE"}
              txHash={txHash || ""}
              setShowDetail={onClose}
            />
          )}
        </div>
      ) : (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="relative flex flex-col gap-8 dark:text-darkText w-full md:w-[689px] h-[685px] bg-white rounded-[30px] px-8 py-6">
            <div
              onClick={onClose}
              className="absolute right-[1rem] top-[1rem] cursor-pointer"
            >
              <IoClose className="w-4 h-4" />
            </div>

            <div className="text-center">Create Auction</div>
            <div className="flex justify-between w-full">
              {" "}
              <div>Select the properties you want to auctions</div>
              <div className="text-black flex items-center gap-2">
                <button
                  disabled={pageNumber === 1}
                  onClick={handlePrevPage}
                  className={` ${pageNumber === 1 ? "text-slate-300" : "cursor-pointer hover:bg-light-grey hover:text-white"} border rounded transition ease-in-out duration-200`}
                >
                  <HiMiniMinusSmall />
                </button>
                <span className="font-sm font-thin">{pageNumber}</span>
                <button
                  disabled={!hasMore}
                  onClick={handleNextPage}
                  className={` ${!hasMore ? "text-slate-300" : "cursor-pointer hover:bg-light-grey hover:text-white"} border rounded transition ease-in-out duration-200`}
                >
                  <HiMiniPlusSmall />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="w-full h-full flex gap-4 flex-col items-center justify-center">
                <Spinner />
                <span className="animate-pulse">
                  {pageNumber === 1
                    ? "Fetching Verified Airspaces..."
                    : "Fetching some more..."}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3 thin-scrollbar overflow-auto h-[450px]">
                {airspaces?.length > 0 &&
                  airspaces?.map((item, index) => (
                    <AuctionItem
                      data={item}
                      key={index}
                      onSelectItem={handleSelectItem}
                      onUpdateItem={handleUpdateItem}
                      selected={
                        !!selectedItems.find(
                          (selectedItem) =>
                            selectedItem.propertyId === item.propertyId
                        )
                      }
                      disabled={
                        selectedItemId !== null &&
                        selectedItemId !== item.propertyId
                      } // Disable if another item is selected
                    />
                  ))}
              </div>
            )}

            <div className="flex justify-between gap-4">
              <Button secondary label="Cancel" onClick={onClose} />
              <Button
                label="Add Properties to Auction"
                onClick={handleAddProperties}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAuctionModal;
