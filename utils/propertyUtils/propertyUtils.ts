import { PropertyData, Coordinates, User } from "@/types";
import { toast } from "react-toastify";

export const claimAirspaceProperty = async (
  claimProperty: (postData: any) => Promise<any>,
  data: PropertyData,
  coordinates: Coordinates | null,
  user: User,
  setShowFailurePopUp: (value: boolean) => void,
  setShowSuccessPopUp: (value: boolean) => void,
  setShowClaimModal: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  setData: (data: PropertyData) => void,
  setClaimButtonLoading: (value: boolean) => void,
  defaultData: PropertyData,
) => {
  try {
    const {
      address,
      title,
      isActive,
      hasChargingStation,
      hasLandingDeck,
      hasStorageHub,
      isRentableAirspace,
      timezone,
      transitFee,
      noFlyZone,
      isFixedTransitFee,
      weekDayRanges,
    } = data;
    if (!title || !coordinates) return;
    let { latitude, longitude } = coordinates;
    latitude = Number(latitude);
    longitude = Number(longitude);

    const postData = {
      address,
      ownerId: user.id,
      propertyStatusId: 0,
      hasChargingStation,
      hasLandingDeck,
      hasStorageHub,
      isRentableAirspace,
      title,
      transitFee,
      noFlyZone,
      isFixedTransitFee,
      latitude,
      longitude,
      timezone,
      isActive,
      vertexes: [
        { latitude: latitude + 0.0001, longitude: longitude + 0.0001 },
        { latitude: latitude + 0.0001, longitude: longitude - 0.0001 },
        { latitude: latitude - 0.0001, longitude: longitude + 0.0001 },
        { latitude: latitude - 0.0001, longitude: longitude - 0.0001 },
      ],
      weekDayRanges,
    };

    const responseData = await claimProperty({ postData });

    if (!responseData) setShowFailurePopUp(true);
    else {
      setShowSuccessPopUp(true);
    }
    setShowClaimModal(false);
    setIsLoading(false);
    setData({ ...defaultData });
    setClaimButtonLoading(false);
  } catch (error) {
    toast.error("Error when creating property.");
  } finally {
    setClaimButtonLoading(false);
  }
};
