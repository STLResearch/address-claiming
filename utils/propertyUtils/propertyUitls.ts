import { Bounds, PropertyData } from "@/types";

export const filterPropertiesByBounds = (
    properties: PropertyData[],
    bounds: Bounds
): PropertyData[] => {
    if (!properties) return [];
    return properties.filter(property => {
        if (property?.longitude && property?.latitude) {
            return (
                property?.longitude >= bounds._sw.lng &&
                property?.longitude <= bounds._ne.lng &&
                property?.latitude >= bounds._sw.lat &&
                property?.latitude <= bounds._ne.lat
            );
        }
        else {
            return;
        }
    });
};