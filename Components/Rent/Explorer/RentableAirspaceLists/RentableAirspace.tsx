import React from "react";
import { PropertyData } from "@/types";
import RentCard from "../RentCard";

interface RentableAirspaceProps {
  item: PropertyData;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RentableAirspace: React.FC<RentableAirspaceProps> =  ({
  item,
  setRentData,
  setShowClaimModal,
}) => {
  const onClickRent = () => {
    setRentData(item);
    setShowClaimModal(true);
  };

  return (
    <div>
      <RentCard  onClickRent={onClickRent} price={item.price} title={item.title} item={item}/>
    </div>
  );
};

export default RentableAirspace;
