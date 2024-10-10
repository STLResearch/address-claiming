import React, { useEffect } from "react";
import { filterPropertiesByBounds } from "@/utils/propertyUtils/propertyUitls";
import mapboxgl, { Map } from "mapbox-gl";
import { createRentMarkerWithPopup } from "@/utils/maputils";
import PropertiesService from "@/services/PropertiesService";
import { Bounds, PropertyData } from "@/types";
import { toast } from "react-toastify";

interface UseRentableAirspacesProps {
  map: Map | null;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingRegAddresses: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisteredAddress: React.Dispatch<React.SetStateAction<PropertyData[]>>;
}

export const useRentableAirspaces = ({
  map,
  setRentData,
  setShowClaimModal,
  setLoadingRegAddresses,
  setRegisteredAddress,
}: UseRentableAirspacesProps) => {
  const { findPropertiesByCoordinates } = PropertiesService();
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line no-undef
    let timeoutId: NodeJS.Timeout;

    const getRentableProperties = async (bounds: Bounds) => {
      setLoadingRegAddresses(true);
      const responseData: PropertyData[] = await findPropertiesByCoordinates({
        postData: {
          minLongitude: bounds._sw.lng,
          minLatitude: bounds._sw.lat,
          maxLongitude: bounds._ne.lng,
          maxLatitude: bounds._ne.lat,
        },
      });
      let formattedProperties: PropertyData[] = [];
      if (responseData && Array.isArray(responseData)) {
        formattedProperties = filterPropertiesByBounds(responseData, bounds);
      } else {
        toast.error("something went wrong please try again");
      }
      setRegisteredAddress(formattedProperties);
      setLoadingRegAddresses(false);

      if (formattedProperties.length > 0) {
        formattedProperties.forEach((property) => {
          const el = document.createElement("div");
          el.id = "markerWithExternalCss";
          const rentMarker = createRentMarkerWithPopup(map, property, el);
          rentMarker?.getElement().addEventListener("click", function () {
            setRentData(property);
            setShowClaimModal(true);
          });
        });
      }
    };

    const handleMove = async (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      setLoadingRegAddresses(true);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        const bounds: Bounds = e.target.getBounds();
        getRentableProperties(bounds);
      }, 3000);
    };
    const initialBounds = map.getBounds();
    getRentableProperties(initialBounds);
    map.on("move", handleMove);

    return () => {
      map.off("move", handleMove);
    };
  }, [map, setLoadingRegAddresses, setRegisteredAddress]);
};
