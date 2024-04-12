import { showPopup } from "../maputils";
export const handleMouseEnter = (
  marker,
  popupName,
  index,
  setIsDroneHoverSVGColor,
  map
) => {
  showPopup(marker, popupName, "popup-hovered-class", map);
  setIsDroneHoverSVGColor({ [index]: true });
};

export const handleMouseLeave = (index, setIsDroneHoverSVGColor) => {
  const elementToRemove = document.querySelector(".popup-hovered-class");
  if (elementToRemove) elementToRemove.remove();
  setIsDroneHoverSVGColor({ [index]: false });
};

export const handleClick = (
  marker,
  data,
  popupName,
  index,
  setIsDroneSVGColor,
  setIsAllPopupClosed,
  setDroneId,
  setShowDroneDetail,
  map,
  showDroneDetail,
  setIsLoading
) => {
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
  marker,
  data,
  popupName,
  index,
  map,
  setIsAllPopupClosed,
  setIsDroneSVGColor,
  setDroneId,
  setMobileBottomDroneDetailVisible
) => {
  setIsDroneSVGColor({ [index]: true });
  setIsAllPopupClosed(false);
  showPopup(marker, popupName, "popup-clicked-class", map);
  setDroneId(data?.remoteData?.macAddress);
  setMobileBottomDroneDetailVisible(true);
};
