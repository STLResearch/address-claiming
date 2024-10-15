import React, { useState } from "react";
import Image from "next/image";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative mx-auto h-full w-full">
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentIndex ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 hidden w-full items-center sm:flex">
        {
          <div className="flex w-full justify-start pl-[15px]">
            <button
              onClick={prevSlide}
              className={`flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white hover:bg-white/70 ${currentIndex > 0 ? "flex" : "hidden"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="black"
                className="h-3 w-3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        }

        {
          <div className="flex w-full justify-end pr-[15px]">
            <button
              onClick={nextSlide}
              className={`flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white hover:bg-white/70 ${currentIndex < images.length - 1 ? "flex" : "hidden"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="black"
                className="h-3 w-3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        }
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 py-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-white" : "bg-[#717171]"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
