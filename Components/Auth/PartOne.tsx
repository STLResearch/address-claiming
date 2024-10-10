import React, { Fragment } from "react";

interface PartOneProps {
  setPart: (part: number) => void;
}

const PartOne: React.FC<PartOneProps> = ({ setPart }) => {
  return (
    <Fragment>
      <p className="text-xl font-medium text-light-black md:mt-[25px]">Unlock Passive Rental Income</p>
      <div className="text-[15px] font-normal text-light-grey md:mt-6 md:leading-8">
        <p>
          💰 <span className="font-bold">Monetize Your Air Rights Easily:</span> Elevate earnings without changing
          property ownership.
        </p>
        <p>
          🌐 <span className="font-bold">User-Friendly Air Rights Management:</span> Define and control with ease on our
          secure platform.
        </p>
        <p>
          🚀 <span className="font-bold">Hassle-Free Passive Income:</span> Gain full control and minimal effort for a
          steady income.
        </p>
        <p>
          🔐 <span className="font-bold">Secure Access with SkyTrade:</span> Register to control land and airspace,
          ensuring permissions and receive direct fees into your account.
        </p>
      </div>
      <p className="text-center text-base text-[#222222] md:mt-6">
        Join SkyTrade today and turn your <br /> air rights into a lucrative opportunity! 🚀✨
      </p>
      <button
        onClick={() => setPart(1)}
        className="w-full rounded-md bg-dark-blue px-24 py-4 text-[15px] text-white transition-all duration-500 ease-in-out hover:bg-blue-600 md:mt-2"
      >
        Get started
      </button>
    </Fragment>
  );
};

export default PartOne;
