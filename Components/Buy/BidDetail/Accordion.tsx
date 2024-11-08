"use client";
import React, { useState } from "react";
import { chevronDownIcon, chevronUpIcon } from "@/Components/Icons";
interface AccordionProps {
  content: React.ReactNode;
  title: string;
}

const Accordion: React.FC<AccordionProps> = ({ content, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="flex items-center justify-between" onClick={toggleAccordion}>
        {<div className="font-500 text-[15px] leading-[22.5px] text-light-black">{title}</div>}

        <div className="transform text-[#868686] transition-transform duration-300">
          {isOpen ? chevronDownIcon() : chevronUpIcon()}
        </div>
      </button>
      {isOpen && <div>{content}</div>}
    </div>
  );
};

export default Accordion;
