import React from "react";
import FeatureCheckbox from "./FeatureCheckbox";
interface FacilityFeaturesSelectProps {
  hasLandingDeck: boolean;
  hasChargingStation: boolean;
  hasStorageHub: boolean;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const FacilityFeaturesSelect: React.FC<FacilityFeaturesSelectProps> = ({
  setData,
  hasLandingDeck,
  hasChargingStation,
  hasStorageHub,
}) => {
  const handleChange = (feature: string, value: boolean): void => {
    setData((prev) => ({ ...prev, [feature]: value }));
  };

  return (
    <div className="flex flex-col gap-[10px] leading-[2rem] md:flex-row md:items-center">
      <FeatureCheckbox
        label="Landing Deck"
        id="hasLandingDeck"
        checked={hasLandingDeck}
        onChange={(value) => handleChange("hasLandingDeck", value)}
      />
      <FeatureCheckbox
        label="Charging Station"
        id="hasChargingStation"
        checked={hasChargingStation}
        onChange={(value) => handleChange("hasChargingStation", value)}
      />
      <FeatureCheckbox
        label="Storage Hub"
        id="hasStorageHub"
        checked={hasStorageHub}
        onChange={(value) => handleChange("hasStorageHub", value)}
      />
    </div>
  );
};
export default FacilityFeaturesSelect;
