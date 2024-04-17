import axios from "axios";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import { Dispatch, SetStateAction } from "react";
import { Coordinates } from "@/types/RemoteIdentifierDrone";
export const flyToUserIpAddress = async (map: Map| null): Promise<void> => {
  if (!map) return;

  try {
    const ipResponse = await axios.get<{ ip: string }>("https://api.ipify.org/?format=json");
    const ipAddress: string = ipResponse.data.ip;
    const ipGeolocationApiUrl = await axios.get<{ latitude: string; longitude: string }>(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION}&ip=${ipAddress}`
    );
    const latitude: number = parseFloat(ipGeolocationApiUrl.data.latitude);
    const longitude: number = parseFloat(ipGeolocationApiUrl.data.longitude);

    if (isNaN(latitude) || isNaN(longitude)) return;

    map.flyTo({
      center: [longitude, latitude],
      zoom: 15,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};


interface AddressData {
  mapbox_id: string;
  short_code: string;
  wikidata: string;
}


export const goToAddress = async (
  flyToAddress: string,
  setCoordinates: React.Dispatch<Coordinates | null>,
  setAddressData: React.Dispatch<React.SetStateAction<AddressData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setMarker: React.Dispatch<React.SetStateAction<Marker | null>>,
  map: Map | null,
  marker: Marker | null
): Promise<void> => {
  try {
    setIsLoading(true);

    const mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${flyToAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

    const response = await fetch(mapBoxGeocodingUrl);

    if (!response.ok)
      throw new Error("Error while getting new address location");

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      throw new Error("Address not found");
    }

    const coordinates: [number, number] = data.features[0].geometry.coordinates;
    const endPoint: [number, number] = [coordinates[0], coordinates[1]];

    setCoordinates({ longitude: coordinates[0], latitude: coordinates[1] });
    setAddressData(data.features[0].properties);
    setIsLoading(false);

    if (map) {
      map.flyTo({
        center: endPoint,
        zoom: 16,
      });
    }

    if (marker) {
      marker.remove();
    }

    let el = document.createElement("div");
    el.id = "markerWithExternalCss";

    const newMarker = new Marker(el).setLngLat(endPoint)
    if(map){
      newMarker.addTo(map);
    }
    
    setMarker(newMarker);
  } catch (error) {
    setIsLoading(false);
    console.error(error);
  }
};



export const getAddresses = async (
  setAddresses: Dispatch<SetStateAction<{ id: string; place_name: string; }[]>>,
  setCoordinates: Dispatch<SetStateAction<Coordinates | null>>,
  timeoutId: NodeJS.Timeout | null,
  address: string
): Promise<void> => {
  setCoordinates(null);

  timeoutId = setTimeout(async () => {
    try {
      const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

      const response = await fetch(mapboxGeocodingUrl);

      if (!response.ok) throw new Error("Error while getting addresses");

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setAddresses(data.features);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, 500);
};