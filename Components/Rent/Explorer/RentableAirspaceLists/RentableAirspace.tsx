import React from "react";
import { Map, Marker } from "mapbox-gl";
import { PropertyData } from "@/types";
import { changeRentMarkerColor } from "@/utils/maputils";

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
        onClick={() => changeRentMarkerColor(map, setSelectedAddress, marker, setMarker, item)}
        className={
          item.id !== selectedAddress ?
            `flex w-full items-center justify-between p-5 text-left text-[12px] text-[#913636]`
          : `flex w-full items-center justify-between bg-[#0653EA] p-5 text-left text-[10px] text-white`
        }
        style={{
          borderTop: "5px solid #FFFFFFCC",
        }}
      >
        <h3 className={`w-[65%] ${item.id !== selectedAddress ? `text-black` : `text-white`}`}>{item.address}</h3>
        <h1
          className={
            item.id !== selectedAddress ?
              "cursor-pointer px-2 py-2 text-center text-[15px] font-black text-black"
            : "cursor-pointer px-2 py-2 text-center text-[15px] font-black text-white"
          }
        >
          ${item.price}
        </h1>
        <span
          onClick={onClickRent}
          className={
            item.id !== selectedAddress ?
              "item-center flex cursor-pointer flex-col justify-center rounded-lg bg-[#0653EA] px-2 py-2 text-center text-[15px] font-normal text-white"
            : "item-center flex cursor-pointer flex-col justify-center rounded-lg bg-[#e8e9eb] px-2 py-2 text-center text-[15px] font-normal text-[#0653EA]"
          }
        >
          RENT
        </span>
      </div>
    </div>
  );
};

export default RentableAirspace;
