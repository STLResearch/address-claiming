import React, { useState } from 'react';
import Image from 'next/image';
import { AccordionProps, PaymentMethod } from "../../types";
import { chevronDownIcon,chevronUpIcon } from '../Icons';

const Accordion = ({ selectedMethod, setSelectedMethod }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleSelection = (method: PaymentMethod) => {
      setSelectedMethod(method);
      setIsOpen(false);
    };
  
    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };
  
    const supportedMethods = [
      {
        icon: "/images/Stripe.svg",
        name: "Stripe",
      },
      {
        icon: "/images/bank-note-arrow.svg",
        name: "Native",
      },
    ];
    return (
      <div className="border rounded-lg ">
        <div
          className="flex justify-between items-center p-2 cursor-pointer"
          onClick={toggleAccordion}
        >
          {selectedMethod.name != "" ? (
            <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2">
              <Image
                src={selectedMethod.icon}
                alt="Placeholder"
                className="w-8 h-8 mr-2"
                width={12}
                height={12}
              />
              <p>{selectedMethod.name}</p>
            </div>
          ) : (
            <div className="font-medium  text-[#838187] text-[12px]">Select</div>
          )}

          <div className="transform transition-transform duration-300">
            {isOpen ? chevronDownIcon() : chevronUpIcon()}
          </div>
        </div>
        {isOpen && (
          <div className=" p-4">
            <ul>
              {supportedMethods.map((method, index) => (
                <li
                  key={index}
                  onClick={() => handleSelection(method)}
                  className="flex items-center cursor-pointer hover:bg-gray-100 p-2"
                >
                  <Image
                    src={method.icon}
                    alt="Placeholder"
                    className="w-8 h-8 mr-2"
                    width={12}
                    height={12}
                  />
                  <p>{method.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

export default Accordion ;

