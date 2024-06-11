import { JsonObject } from "@/types";
import { showPopup } from "../maputils/markerUtils";
import mapboxgl, { Map, Marker } from "mapbox-gl";


interface MarkerData {
  remoteData?: {
    macAddress?: string;
  };
}

export const handleMouseEnter = (
  marker: Marker,
  popupName: string,
  index: number,
  setIsDroneHoverSVGColor: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
  map: Map
): void => {
  showPopup(marker, popupName, "popup-hovered-class", map);
  setIsDroneHoverSVGColor({ [index]: true });
};

export const handleMouseLeave = (
  index: number,
  setIsDroneHoverSVGColor: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>
): void => {
  const elementToRemove = document.querySelector(".popup-hovered-class");
  if (elementToRemove) elementToRemove.remove();
  setIsDroneHoverSVGColor({ [index]: false });
};

export const handleClick = (
  marker: Marker,
  data: JsonObject,
  popupName: string,
  index: number,
  setIsDroneSVGColor: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
  setIsAllPopupClosed: React.Dispatch<React.SetStateAction<boolean>>,
  setDroneId: React.Dispatch<React.SetStateAction<string | undefined>>,
  setShowDroneDetail: React.Dispatch<React.SetStateAction<boolean>>,
  map: Map,
  showDroneDetail: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (!showDroneDetail) {
    setIsLoading(true);
  }
  setIsDroneSVGColor({ [index]: true });
  setIsAllPopupClosed(false);
  showPopup(marker, popupName, "popup-clicked-class", map);
  setDroneId(data?.remoteData?.macAddress);
  setShowDroneDetail(true);
};

export const handleMobileTouchEnd = (
  marker: Marker,
  data: MarkerData,
  popupName: string,
  index: number,
  map: Map,
  setIsAllPopupClosed: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDroneSVGColor: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
  setDroneId: React.Dispatch<React.SetStateAction<string | undefined>>,
  setMobileBottomDroneDetailVisible: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setIsDroneSVGColor({ [index]: true });
  setIsAllPopupClosed(false);
  showPopup(marker, popupName, "popup-clicked-class", map);
  setDroneId(data?.remoteData?.macAddress);
  setMobileBottomDroneDetailVisible(true);
};