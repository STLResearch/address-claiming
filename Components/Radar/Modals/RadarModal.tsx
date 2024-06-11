import React from "react";
import Spinner from "@/Components/Spinner";
import RadarModalHeader from "../RadarModal/RadarModalHeaders";
import DroneIdDetail from "../RadarModal/DroneIdDetail";
import ConnectionDetails from "../RadarModal/ConnectionDetails";
import BasicIDDetails from "../RadarModal/BasicIdDetails";
import LocationDetails from "../RadarModal/LocationDetails";
import SelfIDDetails from "../RadarModal/SelfIdDetails";
import SystemOperatorDetails from "../RadarModal/SystemOperatorDetails";
import { JsonObject } from "@/types";
import OperatorIDDetails from "../RadarModal/OperatorIdDetails";
interface RadarModalProps {
  onClose: () => void;
  DroneDataDetailSelected: JsonObject | null; 
  isLoading: boolean;
}
const RadarModal : React.FC<RadarModalProps> = ({ onClose, DroneDataDetailSelected, isLoading }) => {
  return (
    <div className="z-50  mt-4 md:ml-12  bg-white  md:bg-semi-transparent-white no-scrollbar rounded-[30px] w-full h-full md:max-w-sm  md:max-h-[600px] max-w-[600px] px-[25px] md:py-3 fixed md:rounded-[30px]  mx-auto overflow-x-auto overflow-y-auto flex flex-col gap-md pb-24 md:pb-0 ">
      {isLoading && <Spinner />}
      <RadarModalHeader onClose={onClose} />
      <DroneIdDetail DroneDataDetailSelected={DroneDataDetailSelected} />
      <ConnectionDetails DroneDataDetailSelected={DroneDataDetailSelected} />
      <BasicIDDetails DroneDataDetailSelected={DroneDataDetailSelected} />
      <LocationDetails DroneDataDetailSelected={DroneDataDetailSelected} /> 
      <SelfIDDetails DroneDataDetailSelected={DroneDataDetailSelected} />
      <SystemOperatorDetails
        DroneDataDetailSelected={DroneDataDetailSelected}
      />
      <OperatorIDDetails DroneDataDetailSelected={DroneDataDetailSelected} />
    </div>
  );
};
export default RadarModal;