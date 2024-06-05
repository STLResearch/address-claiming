import React from "react";
import { Map, Marker } from "mapbox-gl";
import { PropertyData } from "@/types";
import { changeRentMarkerColor } from "@/utils/maputils";

interface RentableAirspaceProps {
  item: PropertyData;
  map: Map | null;
  marker: Marker;
  setSelectedAddress: React.Dispatch<React.SetStateAction<number>>;
  selectedAddress: number | null |undefined;
  setMarker: React.Dispatch<React.SetStateAction<Marker>>;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RentableAirspace: React.FC<RentableAirspaceProps> = ({
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
  return (
    <div>
      <div
        key={item.id}
        data-value={item.address}
        onClick={() =>
          changeRentMarkerColor(
            map,
            setSelectedAddress,
            marker,
            setMarker,
            item
          )
        }
        className={
          item.id !== selectedAddress
            ? ` p-5 text-left text-[#913636] w-full flex justify-between items-center text-[12px]`
            : `bg-[#0653EA] p-5 text-left text-white w-full flex items-center justify-between text-[12px]`
        }
        style={{
          borderTop: "5px solid #FFFFFFCC",
        }}
      >
        <h3
          className={`w-[65%] ${item.id != selectedAddress ? `text-black ` : ` text-white `}`}
        >
          {item.address}
        </h3>
        <h1
          className={
            item.id != selectedAddress
              ? " text-black font-black text-center text-[15px]  cursor-pointer py-2 px-2"
              : " text-white font-black text-center text-[15px]  cursor-pointer py-2 px-2"
          }
        >
          ${item.price}
        </h1>
        <span
          onClick={onClickRent}
          className={
            item.id != selectedAddress
              ? "bg-[#0653EA] text-white rounded-lg  text-center text-[15px] font-normal cursor-pointer py-2 px-2 flex flex-col item-center justify-center"
              : "bg-[#e8e9eb] text-[#0653EA] rounded-lg  text-center text-[15px] font-normal cursor-pointer py-2 px-2 flex flex-col item-center justify-center"
          }
        >
          RENT
        </span>
      </div>
    </div>
  );
};

export default RentableAirspace;
