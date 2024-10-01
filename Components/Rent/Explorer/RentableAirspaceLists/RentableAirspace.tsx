import React from "react";
import { Map, Marker } from "mapbox-gl";
import { PropertyData } from "@/types";
import { changeRentMarkerColor } from "@/utils/maputils";
import Carousel from "@/Components/Shared/Carousel";
import { fetchMapboxStaticImage } from "@/utils/getMapboxStaticImage";

interface RentableAirspaceProps {
  item: PropertyData;
  map: Map | null;
  marker: Marker | null | undefined;
  setSelectedAddress: React.Dispatch<React.SetStateAction<number>>;
  selectedAddress: number | null | undefined;
  setMarker: React.Dispatch<React.SetStateAction<Marker>>;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RentableAirspace: React.FC<RentableAirspaceProps> =  ({
  item,
  map,
  marker,
  setSelectedAddress,
  selectedAddress,
  setMarker,
  setRentData,
  setShowClaimModal,
}) => {
  const onClickRent = () => {
    setRentData(item);
    setShowClaimModal(true);
  };
  const getMapboxStaticImage = (lat, lng) => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},14/600x600?access_token=${accessToken}`;
  };
  const images = [
    { image_url: "/images/imagetest1.jpg" },
    { image_url: "/images/imagetest2.jpg" },
    { image_url: "/images/imagetest3.jpg" },
  ];
  const imageUrl = getMapboxStaticImage(item.latitude, item.longitude);
  images.unshift({ image_url: imageUrl });

  return (
    <div>
      {/* <div
        key={item.id}
        data-value={item.address}
        onClick={() =>
          changeRentMarkerColor(
            map,
            setSelectedAddress,
            marker,
            setMarker,
            item,
          )
        }
        className={
          item.id !== selectedAddress
            ? ` p-5 text-left text-[#913636] w-full flex justify-between items-center text-[12px]`
            : `bg-[#0653EA] p-5 text-left text-white w-full flex items-center justify-between text-[10px]`
        }
        style={{
          borderTop: "5px solid #FFFFFFCC",
        }}
      >
        <h3
          className={`w-[65%] ${item.id !== selectedAddress ? `text-black ` : ` text-white `}`}
        >
          {item.address}
        </h3>
        <h1
          className={
            item.id !== selectedAddress
              ? " text-black font-black text-center text-[15px]  cursor-pointer py-2 px-2"
              : " text-white font-black text-center text-[15px]  cursor-pointer py-2 px-2"
          }
        >
          ${item.price}
        </h1>
        <span
          onClick={onClickRent}
          className={
            item.id !== selectedAddress
              ? "bg-[#0653EA] text-white rounded-lg  text-center text-[15px] font-normal cursor-pointer py-2 px-2 flex flex-col item-center justify-center"
              : "bg-[#e8e9eb] text-[#0653EA] rounded-lg  text-center text-[15px] font-normal cursor-pointer py-2 px-2 flex flex-col item-center justify-center"
          }
        >
          RENT
        </span>
      </div> */}

    <div
      className="w-[350px] md:w-full rounded-lg shadow-md overflow-hidden"
      style={{ boxShadow: "0px 4px 10px 0px #0000001a" }}
    >
       <div className="relative w-full h-[130px]">
        <Carousel images={images} />
      </div>
      <div className="px-4 py-2 flex justify-between w-full">
        <div className="text-[14px] leading-[20px] truncate w-[60%] text-left text-black font-semibold ">
        {item?.title}
        </div>
        <div >
          <div className="text-xs leading-4 text-[#727272]">Rental Price</div>
          <div className="text-[#050505] text-xs font-bold leading-[26px] text-right">&#36;{item?.price && item?.price.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex justify-center px-[15px] py-[10px] h-[51px]">
        <div className=" bg-[#0653EA] w-full flex items-center rounded-lg h-[31px]">
          <button
            onClick={onClickRent}
            className="w-full text-white text-[14px] leading-[21px]"
          >
            Rent
          </button>
        </div>
      </div>

    </div>
    </div>
  );
};

export default RentableAirspace;
