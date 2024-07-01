import { AuctionPropertyI } from "@/types";
import { useState } from "react";
import AuctionCard from "./AuctionCard";
import CreateAuctionModal from "./CreateAuctionModal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";

interface AuctionExplorerMobileProps {
  data: AuctionPropertyI[];
  handleShowBidDetail:(index:string) => void;
}

const AuctionExplorerMobile: React.FC<AuctionExplorerMobileProps> = ({
  data,handleShowBidDetail
}) => {
  const [toggleTray, setToggleTray] = useState(false);
  const handleTrayToggle = (index) =>{
    setToggleTray(false)
    handleShowBidDetail(index);
  }

  const dispatch = useAppDispatch();
  let filteredAuctions = data;

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
          <h4>{data?.length} Airspaces available</h4>
        </div>

        {toggleTray && (
          <div className="h-[450px] overflow-y-auto flex flex-col items-center gap-4 mt-6">
            {data?.length > 0 ? (
              data.map((item, index) => (
                <div className="mx-auto" key={index} onClick={()=>handleTrayToggle(index)}>
                  <AuctionCard data={item} />
                </div>
              ))
            ) : (
              <div className="text-center mt-16 text-light-grey">
                No auctions found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AuctionExplorerMobile;
