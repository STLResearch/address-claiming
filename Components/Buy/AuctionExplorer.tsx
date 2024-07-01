import { useState } from "react";
import { MagnifyingGlassIcon } from "../Shared/Icons";
import AuctionCard from "./AuctionCard";
import { AuctionPropertyI } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";
import CreateAuctionModa from "./CreateAuctionModal";
import CreateAuctionModal from "./CreateAuctionModal";
import useFetchAuctions from "@/hooks/useFetchAuctions";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "../Icons";
interface AuctionExplorerProps {
  data: AuctionPropertyI[];
  handleShowBidDetail: (index: number) => void;
}

const AuctionExplorer: React.FC<AuctionExplorerProps> = ({
  data,
  handleShowBidDetail,
}) => {
  const { isCreateAuctionModalOpen } = useAppSelector((state) => {
    const { isCreateAuctionModalOpen } = state.userReducer;
    return { isCreateAuctionModalOpen };
  });

  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  console.log(data, "the list nft");
  let filteredAuctions = data;
  // if(data?.length>0){
  //   const filteredAuctions = data.filter((auction) =>
  //     auction?.properties[0]?.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }
  const { loading, hasMore, loadMore } = useFetchAuctions();

  return (
    <>
      <div className="hidden md:block w-[518px] h-[668px] z-20 bg-white m-8 rounded-[30px] p-6 shadow-md overflow-hidden ">
        <div>
          <div className="text-[18px] font-semibold text-center py-4">
            SkyMarket Hub
          </div>
          <div className="text-[14px]">
            Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial
            Freedom.
          </div>
        </div>
        <div className="flex flex-col gap-4 py-4">
          <div>
            <button
              onClick={() => dispatch(setIsCreateAuctionModalOpen(true))}
              className="text-base bg-dark-blue py-2 w-full text-white rounded-lg"
            >
              Create Auction
            </button>
          </div>
          <div className="flex justify-between items-center w-full border rounded-lg overflow-hidden p-2">
            <input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:outline-none w-10/12 text-[14px]"
            />

            <div className="w-4 h-4">
              <MagnifyingGlassIcon />
            </div>
          </div>
          <div className="h-[410px] overflow-y-auto thin-scrollbar">
            {" "}
            {loading && (
              <div className="w-full h-full flex justify-center items-center">
                <LoadingSpinner color={"#0653EA"} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {/* {filteredAuctions?.length > 0 ? (
                filteredAuctions.map((item, index) => (
                  <div key={index} onClick={()=>handleShowBidDetail(index)}>
                    <AuctionCard data={item} />
                  </div>
                ))
              ) : (
                <div className="text-center col-span-2 text-light-grey">
                  No auctions found
                </div>
              )} */}

              <InfiniteScroll
                dataLength={data.length}
                next={loadMore}
                hasMore={hasMore}
                loader={undefined}
              >
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <div key={index} onClick={() => handleShowBidDetail(index)}>
                      <AuctionCard data={item} />
                    </div>
                  ))
                ) : (
                  <div className="text-center col-span-2 text-light-grey">
                    No auctions found
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionExplorer;
