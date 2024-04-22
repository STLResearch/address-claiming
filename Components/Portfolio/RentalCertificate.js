import React from 'react';
import { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";

import Image from "next/image";

export default function RentalCertificate({ rentalData }) {
  const componentRef = useRef(null);

  const printDocument = () => {
    const input = componentRef.current;

    html2pdf()
      .from(input)
      .set({
        margin: 1,
        filename: "rental_certificate.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div
      style={{ zIndex: 500 }}
      className="flex flex-col  min-h-screen w-screen items-center justify-center "
    >
      <div className="w-[50rem] bg-white py-20 min-h-screen">
        <div
          ref={componentRef}
          className="flex flex-col  items-center px-24 gap-8"
        >
          <div>
            <Image
              width={200}
              height={100}
              src={"/images/certLogo.png"}
              alt="logo"
            />
          </div>
          <div className="text-gray-400 text-2xl">Rental Certificate</div>
          <div className="self-start">28th June, 2024</div>
          <div>
            This certifies that James Bond has successfully rented an airspace
            on SkyTrade for the following details:
          </div>
          <div className="w-full">
            <div>Rental ID:</div>
            <div>Date of Rental:</div>
            <div>Time Frame: </div>
            <div>Address:</div>
            <div>Transaction hash:</div>
            <div>Transaction date:</div>
            <div>Amount:</div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              This rental agreement is valid for the specified date and time
              frame mentioned above. This agreement is subject to SkyTrade's
              Rental Agreement and Terms of Service.
            </div>
            <div>
              <div>SkyTrade Team </div>
              <div>www.sky.trade</div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={printDocument}
            className=" mx-auto  text-white rounded-[5px] bg-[#0653EA] text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
            style={{ border: "1px solid #0653EA" }}
          >
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}