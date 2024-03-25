import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ArrowLeftIcon, CloseIcon, LocationPointIcon } from "../Icons";
import Image from "next/image";
import RentalCertificate from "../MyAirspaces/RentalCertificate";

const RentalAirspaceModal = ({
  airspace: { title, address, id, expirationDate, currentPrice },
  onCloseModal,
  isOffer,
}) => {
  console.log({ expirationDate });
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const generatePDF = () => {
    setPdfGenerated(true);
  };

  return (
    <>
      {pdfGenerated && <RentalCertificate />}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full h-full md:h-auto md:w-[689px] z-50 flex flex-col gap-[15px]">
        <Image
          id="certificate"
          className=""
          width={200}
          height={200}
          src={"/images/cert.png"}
          alt="image"
        />
        <div
          className="relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <h2 className="text-[#222222] text-center font-medium text-xl">
            {title || address}
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
            {address}
          </p>
        </div>
        {Object.entries({
          ID: id,
          "Expiration Date": expirationDate,
          "Current Price": currentPrice,
        }).map(([key, value]) => {
          if (!value) return;
          return (
            <div className="flex gap-[15px]">
              <p className="text-[14px] font-normal text-[#222222]">{key}:</p>
              <p className="text-[14px] font-normal text-[#87878D]">{value}</p>
            </div>
          );
        })}

        <div className="flex gap-[20px] md:mt-[15px] mt-auto -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 py-[16px] md:py-0">
          <button
            onClick={onCloseModal}
            className="flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
            style={{ border: "1px solid #0653EA" }}
          >
            Cancel
          </button>
          <button
            onClick={generatePDF}
            className="flex-1 text-white rounded-[5px] bg-[#0653EA] text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
            style={{ border: "1px solid #0653EA" }}
          >
            Generate Certificate
          </button>
        </div>
      </div>
    </>
  );
};

export default RentalAirspaceModal;
