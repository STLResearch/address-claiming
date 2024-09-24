import React from "react";
import axios from "axios";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import { Coordinates } from "@/types/index";

export const flyToUserIpAddress = async (map: Map | null): Promise<void> => {
  if (!map) return;
  try {
    const ipResponse = await axios.get<{ ip: string }>(
      "https://api.ipify.org/?format=json",
    );
    const ipAddress: string = ipResponse.data.ip;
    const ipGeolocationApiUrl = await axios.get<{
      latitude: string;
      longitude: string;
    }>(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION}&ip=${ipAddress}`,
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
  setAddressData: React.Dispatch<
    React.SetStateAction<AddressData | null | undefined>
  >,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setMarker: React.Dispatch<
    React.SetStateAction<mapboxgl.Marker | null | undefined>
  >,
  map: Map | mapboxgl.Map | null,
  marker: Marker | mapboxgl.Marker | null | undefined,
): Promise<void> => {
  try {
    setIsLoading(true);

    const mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${flyToAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

    const response = await fetch(mapBoxGeocodingUrl);

    if (!response.ok) {
      throw new Error("Error while getting new address location");
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      throw new Error("Address not found");
    }

    const { coordinates } = data.features[0].geometry;
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

    const el = document.createElement("div");
    el.id = "markerWithExternalCss";

    const newMarker = new mapboxgl.Marker(el)
      .setLngLat(endPoint)
      .addTo(map as Map);
    newMarker.addTo(map as Map);
    setMarker(newMarker);
  } catch (error) {
    setIsLoading(false);
    console.error(error);
  }
};

export const getTokenBalance = (user, setTokenBalance) => {
  const data = {
    jsonrpc: "2.0",
    id: 1,
    method: "getTokenAccountsByOwner",
    params: [
      user?.blockchainAddress,
      {
        mint: process.env.NEXT_PUBLIC_MINT_ADDRESS,
      },
      {
        encoding: "jsonParsed",
      },
    ],
  };
  if (process.env.NEXT_PUBLIC_RPC_TARGET) {
    fetch(process.env.NEXT_PUBLIC_RPC_TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error);
          });
        }

        return response.json();
      })
      .then((result) => {
        if (result.result.value.length < 1) {
          setTokenBalance("0");

          return;
        }

        setTokenBalance(
          result.result.value[0].account.data.parsed.info.tokenAmount
            .uiAmountString,
        );
      });
  }
};
