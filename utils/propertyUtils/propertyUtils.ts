import { PropertyData, Coordinates, User } from "@/types";
import { toast } from "react-toastify";
import { removePubLicUserDetailsFromLocalStorage } from "../../helpers/localStorage";
export const claimAirspaceProperty = async (claimProperty: ( postData:any ) => Promise<any>, data: PropertyData, coordinates: Coordinates | null, user: User, setShowFailurePopUp: (value: boolean) => void, setShowSuccessPopUp: (value: boolean) => void, setShowClaimModal: (value: boolean) => void, setIsLoading: (value: boolean) => void, setData: (data: PropertyData) => void, setClaimButtonLoading: (value: boolean) => void, defaultData: PropertyData,redirectIfUnauthenticated:()=>boolean,setErrorMessages:React.Dispatch<React.SetStateAction<string[]>>) => {
    try {
        const isRedirecting = redirectIfUnauthenticated();
      if (isRedirecting) return;
      
      setClaimButtonLoading(true);
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
        let errors:Array<string> = [];

        if (!title) {
          errors.push('Please enter a name for the Airspace');
        }
  

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

        if (!isRentableAirspace) {
            errors.push('Please ensure to check the rental checkbox before claiming airspace.');
          }
          if (!weekDayRanges.some(item => item.isAvailable)) {
            errors.push('Kindly ensure that at least one day is made available.');
          }
          if (errors.length > 0) {
            setErrorMessages(errors);
            setShowFailurePopUp(true);
            return;
          }

        const responseData = await claimProperty({ postData });

        if (!responseData) setShowFailurePopUp(true);
        else{
            setShowSuccessPopUp(true)
            setShowClaimModal(false);
            setData({ ...defaultData });
        };
       
    } catch (error) {
        console.error(error);
        toast.error("Error when creating property.")
    } finally {
        setIsLoading(false);
        setClaimButtonLoading(false);
    }
    removePubLicUserDetailsFromLocalStorage('airSpaceData', user)
};
