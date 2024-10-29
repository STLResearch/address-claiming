import React, { useState } from "react";
import { AuctionDataI, AuctionPropertyI } from "@/types";
import AuctionCard from "./AuctionCard";
import CreateAuctionModal from "./CreateAuctionModal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";
import useFetchAuctions from "@/hooks/useFetchAuctions";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Spinner";

interface AuctionExplorerMobileProps {
  auctions: AuctionDataI[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMorePage: boolean;
  loading: boolean;
  setShowBidDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setAuctionDetailData: React.Dispatch<React.SetStateAction<AuctionDataI>>;
}

const AuctionExplorerMobile: React.FC<AuctionExplorerMobileProps> = ({
  auctions,
  setPage,
  hasMorePage,
  loading,
  setShowBidDetail,
  setAuctionDetailData,
}) => {
  const [toggleTray, setToggleTray] = useState(false);
  const handleTrayToggle = (item) => {
    setToggleTray(false);
    setShowBidDetail(true);
    setAuctionDetailData(item);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className="fixed bottom-[74px] left-0 z-20 w-full rounded-t-[30px] bg-white p-4 text-center">
        <div onClick={() => setToggleTray(!toggleTray)} className="flex flex-col items-center justify-center gap-4">
          <div className="h-2 w-16 animate-pulse rounded-3xl bg-light-grey"></div>
          <h4>
            {auctions?.length > 0 ? auctions.length : "No"} Auction{auctions.length > 1 ? "s" : ""} available
          </h4>
        </div>

        {toggleTray && (
          <div className="mx-auto w-full overflow-y-auto">
            <div
              id="scrollableDiv"
              className="mx-auto mt-6 grid h-[450px] w-full grid-cols-1 justify-items-center gap-4 sm:justify-items-stretch md:w-9/12 md:gap-6"
            >
              {" "}
              {loading && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col gap-4">
                    <Spinner />
                    <div className="animate-pulse">Fetching Auctions...</div>
                  </div>
                </div>
              )}
              {!loading && auctions && auctions?.length > 0 && (
                <InfiniteScroll
                  dataLength={auctions.length}
                  next={handleLoadMore}
                  hasMore={hasMorePage}
                  loader={undefined}
                  scrollableTarget="scrollableDiv"
                >
                  {auctions.length > 0 ?
                    auctions.map((item, index) => (
                      <div className="mx-auto mb-[15px]" key={index}>
                        <AuctionCard data={item} handleShowBidDetail={handleTrayToggle} />
                      </div>
                    ))
                  : <div className="col-span-2 text-center text-light-grey">No auctions found</div>}
                </InfiniteScroll>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuctionExplorerMobile;
