import { AuctionPropertyI } from "@/types";
import { useState } from "react";
import AuctionCard from "./AuctionCard";
import CreateAuctionModal from "./CreateAuctionModal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";
import useFetchAuctions from "@/hooks/useFetchAuctions";
import InfiniteScroll from "react-infinite-scroll-component";

interface AuctionExplorerMobileProps {
  // data: AuctionPropertyI[];
  setShowBidDetail: any;
  setAuctionDetailData: any;
}

const AuctionExplorerMobile: React.FC<AuctionExplorerMobileProps> = ({
  setShowBidDetail,
  setAuctionDetailData,
}) => {
  const [toggleTray, setToggleTray] = useState(false);
  const handleTrayToggle = (index) => {
    setToggleTray(false);
    setShowBidDetail(true);
    setAuctionDetailData(auctions[index]);
  };

  const dispatch = useAppDispatch();
  const { auctions, loading, page, hasMore, loadMore } = useFetchAuctions();

  let filteredAuctions = auctions;

  // const { isCreateAuctionModalOpen } = useAppSelector((state) => {
  //   const { isCreateAuctionModalOpen } = state.userReducer;
  //   return { isCreateAuctionModalOpen };
  // });

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 w-full z-20 bg-white p-4 shadow-md text-center rounded-t-[30px]">
        <div
          onClick={() => setToggleTray(!toggleTray)}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 animate-pulse h-2 rounded-3xl bg-light-grey"></div>
          <h4>{auctions?.length} Airspaces available</h4>
        </div>

        {/* {toggleTray && (
          <div className="h-[450px] overflow-y-auto flex flex-col items-center gap-4 mt-6">
            {auctions?.length > 0 ? (
              auctions.map((item, index) => (
                <div
                  className="mx-auto"
                  key={index}
                  onClick={() => handleTrayToggle(index)}
                >
                  <AuctionCard data={item} />
                </div>
              ))
            ) : (
              <div className="text-center mt-16 text-light-grey">
                No auctions found
              </div>
            )}
          </div>
        )} */}
        {toggleTray && (
          <div className="h-[450px] overflow-y-auto flex flex-col items-center gap-4 mt-6">
            {auctions && auctions?.length > 0 && (
              <InfiniteScroll
                dataLength={auctions.length}
                next={loadMore}
                hasMore={hasMore}
                loader={undefined}
                scrollableTarget="scrollableDiv"
              >
                {auctions.length > 0 ? (
                  auctions.map((item, index) => (
                    <div
                  className="mx-auto"
                  key={index}
                  onClick={() => handleTrayToggle(index)}
                >
                  <AuctionCard data={item} />
                </div>
                  ))
                ) : (
                  <div className="text-center col-span-2 text-light-grey">
                    No auctions found
                  </div>
                )}
              </InfiniteScroll>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AuctionExplorerMobile;
