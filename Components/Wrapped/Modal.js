import { formatDate } from "@/utils";

const { Fragment } = require("react");
const { ArrowLeftIcon, CloseIcon, LocationPointIcon } = require("../Shared/Icons");

const Modal = ({ airspace, onCloseModal, isOffer }) => {
  return (
    <Fragment>
      <div className="fixed left-1/2 top-1/2 z-50 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-[15px] bg-white px-[29px] py-[30px] md:h-auto md:w-[689px] md:rounded-[30px]">
        <div
          className="relative -mx-[29px] -mt-[30px] flex items-center gap-[20px] px-[29px] py-[20px] md:mx-0 md:my-0 md:p-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="h-[12px] w-[16px] md:hidden" onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <h2 className="text-center text-xl font-medium text-[#222222]">{airspace?.address}</h2>
          <div
            onClick={onCloseModal}
            className="absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block"
          >
            <CloseIcon />
          </div>
        </div>
        <div className="flex items-center gap-[10px] rounded-lg px-[22px] py-4" style={{ border: "1px solid #4285F4" }}>
          <div className="h-6 w-6">
            <LocationPointIcon />
          </div>
          <p className="flex-1 text-[14px] font-normal text-[#222222]">{airspace?.address}</p>
        </div>

        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-[#222222]">ID:</p>
          <p className="text-[14px] font-normal text-[#87878D]">{airspace?.id}</p>
        </div>

        {airspace?.metadata?.endTime && (
          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-[#222222]">Expiration Date:</p>
            <p className="text-[14px] font-normal text-[#87878D]">{formatDate(airspace?.metadata?.endTime)}</p>
          </div>
        )}

        {isOffer ?
          <div
            className="-mx-[30px] -mb-[30px] mt-auto flex gap-[20px] px-[14px] py-[16px] md:mx-0 md:mb-0 md:mt-[15px] md:px-0 md:py-0 md:shadow-none"
            style={{ boxShadow: "0px 0px 4.199999809265137px 0px #00000040" }}
          >
            <div className="flex flex-col">
              <p className="text-[12px] font-normal text-[#838187]">Offer received</p>
              <p className="text-2xl font-bold text-[#222222]">{/* {USDollar.format(99.87)} */}</p>
            </div>
            <div
              onClick={onCloseModal}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-white px-[20px] py-[10px] text-center text-[#0653EA]"
              style={{ border: "1px solid #0653EA" }}
            >
              Decline
            </div>
            <div
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-[#0653EA] px-[20px] py-[10px] text-center text-white"
              style={{ border: "1px solid #0653EA" }}
            >
              Approve
            </div>
          </div>
        : <div className="-mx-[30px] -mb-[30px] mt-auto flex gap-[20px] px-[14px] py-[16px] md:mx-0 md:mb-0 md:mt-[15px] md:px-0 md:py-0">
            <div
              onClick={onCloseModal}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-white px-[20px] py-[10px] text-center text-[#0653EA]"
              style={{ border: "1px solid #0653EA" }}
            >
              Cancel
            </div>
            <button
              disabled
              className="disabled flex flex-1 cursor-not-allowed items-center justify-center rounded-[5px] bg-gray-300 px-[20px] py-[10px] text-center text-white"
            >
              Edit
            </button>
          </div>
        }
      </div>
    </Fragment>
  );
};

export default Modal;
