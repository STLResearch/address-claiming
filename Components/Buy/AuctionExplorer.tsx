import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "../Shared/Icons";
import AuctionCard from "./AuctionCard";
import { AuctionDataI } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Spinner";

interface AuctionExplorerProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  auctions: AuctionDataI[] | null;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMorePage: boolean;
  loading: boolean;
  setShowBidDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setAuctionDetailData: React.Dispatch<React.SetStateAction<AuctionDataI>>;
}

const AuctionExplorer: React.FC<AuctionExplorerProps> = ({
  setSearchTerm,
  auctions,
  setPage,
  hasMorePage,
  loading,
  setShowBidDetail,
  setAuctionDetailData,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { isCreateAuctionModalOpen } = useAppSelector((state) => {
    const { isCreateAuctionModalOpen } = state.userReducer;
    return { isCreateAuctionModalOpen };
  });

  const dispatch = useAppDispatch();

  const handleShowBidDetail = (item: AuctionDataI) => {
    setShowBidDetail(true);
    setAuctionDetailData(item);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(searchValue);
    }, 2000);

    // Cleanup the timeout if searchValue changes before the delay is over
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, setSearchTerm]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const auctionId = query.get("auctionId");
    const bid = query.get("bid");

    if (auctionId && bid && auctions?.length) {
      const selectedAuction = auctions.find((auction) => auction.id === Number(auctionId));
      if (selectedAuction) {
        setAuctionDetailData(selectedAuction);
        setShowBidDetail(bid === "true");
      }
    }
  }, [auctions, setAuctionDetailData, setShowBidDetail]);

  return (
    <div className="z-20 m-8 hidden h-[668px] w-[518px] overflow-hidden rounded-[30px] bg-white p-6 shadow-md md:block">
      <div>
        <div className="py-4 text-center text-[18px] font-semibold">SkyMarket Hub</div>
        <div className="text-[14px]">Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial Freedom.</div>
      </div>
      <div className="flex flex-col gap-4 py-4">
        <button
          onClick={() => dispatch(setIsCreateAuctionModalOpen(true))}
          className="w-full rounded-lg bg-dark-blue py-2 text-base text-white"
        >
          Create Auction
        </button>
        <div className="flex w-full items-center justify-between overflow-hidden rounded-lg border p-2">
          <input
            placeholder="Search auctions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-10/12 text-[14px] focus:outline-none"
          />
          <div className="h-4 w-4">
            <button onClick={() => setSearchTerm(searchValue)}>
              <MagnifyingGlassIcon />
            </button>
          </div>
        </div>
        <div id="scrollableDiv" className="thin-scrollbar h-[410px] overflow-y-auto">
          {loading ?
            <div className="flex h-2/3 w-full items-center justify-center">
              <div className="flex flex-col gap-4">
                <Spinner />
                <div className="animate-pulse">Fetching Auctions...</div>
              </div>
            </div>
          : auctions && auctions.length > 0 ?
            <InfiniteScroll
              dataLength={auctions.length}
              next={handleLoadMore}
              hasMore={hasMorePage}
              loader={undefined}
              scrollableTarget="scrollableDiv"
              className={`grid w-full ${auctions.length > 5 ? "grid-cols-2" : "grid-cols-1"} mb-4 gap-4`}
            >
              {auctions.map((item, index) => (
                <div key={index}>
                  <AuctionCard data={item} handleShowBidDetail={handleShowBidDetail} />
                </div>
              ))}
            </InfiniteScroll>
          : <div className="col-span-2 text-center text-light-grey">No auctions found</div>}
        </div>
      </div>
    </div>
  );
};

export default AuctionExplorer;
