import { formatDate } from "@/utils";

const { Fragment } = require("react");
const { ArrowLeftIcon, CloseIcon, LocationPointIcon } = require("../Icons");

const Modal = ({ airspace, onCloseModal, isOffer }) => {
  console.log({ airspace });
  return (
    <Fragment>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full h-full md:h-auto md:w-[689px] z-50 flex flex-col gap-[15px]">
        <div
          className="relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <h2 className="text-[#222222] text-center font-medium text-xl">
            {airspace?.address}
          </h2>
          <div
            onClick={onCloseModal}
            className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
          >
            <CloseIcon />
          </div>
        </div>
        <div
          className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg"
          style={{ border: "1px solid #4285F4" }}
        >
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <p className="font-normal text-[#222222] text-[14px] flex-1">
            {airspace?.address}
          </p>
        </div>

        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-[#222222]">ID:</p>
          <p className="text-[14px] font-normal text-[#87878D]">
            {airspace?.id}
          </p>
        </div>

        {airspace?.metadata?.endTime && (
          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-[#222222]">
              Expiration Date:
            </p>
            <p className="text-[14px] font-normal text-[#87878D]">
              {formatDate(airspace?.metadata?.endTime)}
            </p>
          </div>
        )}

        {isOffer ? (
          <div
            className="flex gap-[20px] md:mt-[15px] mt-auto py-[16px] md:py-0 -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 md:shadow-none"
            style={{ boxShadow: "0px 0px 4.199999809265137px 0px #00000040" }}
          >
            <div className="flex flex-col">
              <p className="font-normal text-[12px] text-[#838187]">
                Offer received
              </p>
              <p className="font-bold text-2xl text-[#222222]">
                {USDollar.format(99.87)}
              </p>
            </div>
            <div
              onClick={onCloseModal}
              className="flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
              style={{ border: "1px solid #0653EA" }}
            >
              Decline
            </div>
            <div
              className="flex-1 text-white rounded-[5px] bg-[#0653EA] text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
              style={{ border: "1px solid #0653EA" }}
            >
              Approve
            </div>
          </div>
        ) : (
          <div className="flex gap-[20px] md:mt-[15px] mt-auto -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 py-[16px] md:py-0">
            <div
              onClick={onCloseModal}
              className="flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
              style={{ border: "1px solid #0653EA" }}
            >
              Cancel
            </div>
            <button
              disabled
              className="disabled flex-1 text-white rounded-[5px] bg-gray-300 cursor-not-allowed text-center py-[10px] px-[20px] flex items-center justify-center"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Modal;
