import { useState } from "react";
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
    <div className="relative w-full mx-auto h-full">   
      <div className="relative w-full h-full overflow-hidden rounded-lg">
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
      <div className="hidden sm:flex items-center absolute inset-0 w-full">
        {(
            <div className="flex justify-start w-full pl-[15px]">
                <button
                    onClick={prevSlide}
                    className={`flex justify-center items-center h-[17px] w-[17px] bg-white rounded-full hover:bg-white/70 ${currentIndex > 0 ? 'flex' : 'hidden' }`}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="black"
                    className="w-3 h-3"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                    </svg>
                </button>
            </div>
        )}

        {(
            <div className="flex justify-end w-full pr-[15px]">
                <button
                    onClick={nextSlide}
                    className={`flex justify-center items-center bg-white w-[17px] h-[17px] rounded-full hover:bg-white/70 ${currentIndex < images.length - 1  ? 'flex' : 'hidden'}`}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="black"
                    className="w-3 h-3"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                    />
                    </svg>
                </button>
            </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 py-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-[#717171]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;