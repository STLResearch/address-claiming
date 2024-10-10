"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AccordionProps, PaymentMethod } from "../../types";
import { chevronDownIcon, chevronUpIcon } from "../Icons";

const supportedMethods = [
  {
    icon: "/images/bank-note-arrow.svg",
    name: "Native",
  },
  {
    icon: "/images/ramp.svg",
    name: "Ramp",
  },
  {
    icon: "/images/Stripe.svg",
    name: "Stripe",
  },
  {
    icon: "/images/LI-FI.svg",
    name: "LI.FI",
  },
  {
    icon: "/images/transak.svg",
    name: "Transak",
  },
];

const Accordion = ({ selectedMethod, setSelectedMethod, activeSection }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsOpen(false);
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="rounded-lg border">
      <div className="flex cursor-pointer items-center justify-between p-2" onClick={toggleAccordion}>
        {selectedMethod.name !== "" ?
          <div className="flex cursor-pointer items-center p-2 hover:bg-gray-100">
            <Image src={selectedMethod.icon} alt="Placeholder" className="mr-2 h-8 w-8" width={12} height={12} />
            <p>{selectedMethod.name}</p>
          </div>
        : <div className="text-[12px] font-medium text-[#838187]">Select</div>}

        <div className="transform transition-transform duration-300">
          {isOpen ? chevronDownIcon() : chevronUpIcon()}
        </div>
      </div>
      {isOpen && (
        <div className="p-4">
          <ul>
            {supportedMethods.map((method, index) => {
              if (
                (activeSection === 1 && method.name === "Ramp") ||
                (activeSection === 1 && method.name === "Transak")
              ) {
                return null;
              }

              return (
                <li
                  key={index}
                  onClick={() => handleSelection(method)}
                  className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
                >
                  <Image src={method.icon} alt="Placeholder" className="mr-2 h-8 w-8" width={12} height={12} />
                  <p>{method.name}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Accordion;
