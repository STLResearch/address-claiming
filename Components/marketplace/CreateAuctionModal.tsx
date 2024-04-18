export default function CreateAuctionModal({
    assetButton,
    setToggleCreateAuctionModal,
  }:{
    assetButton:React.ReactNode,
    setToggleCreateAuctionModal:React.Dispatch<React.SetStateAction<boolean>>
  }) {
    return (
      <div className=" fixed right-20 top-20  h-[80%] w-[50%] overflow-y-scroll bg-white border-4 border-gray-300 animate__animated animate__zoomInDown">
        <button
          className="bg-blue-400 rounded-xl text-white"
          onClick={() => {
            setToggleCreateAuctionModal(false);
          }}
        >
          Close
        </button>
        <div className="flex flex-wrap justify-start items-start mt-20 overflow-y-scroll ">
          {assetButton}
        </div>
      </div>
    );
  }