import mapboxgl, { Map, Marker } from "mapbox-gl";
import { LatLngPair } from "@/types";
interface LineStringGeometry {
  type: "LineString";
  coordinates: LatLngPair[];
}

interface Feature {
  type: "Feature";
  properties: {};
  geometry: LineStringGeometry;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}
export const drawFlightPath = (map: Map, flightPath: LatLngPair[] | undefined) => {
  const swappedCoordinates: LatLngPair[] | undefined = flightPath?.map(coord => [coord[1], coord[0]]);

  if (map.getSource("flightPath")) {
    map.removeLayer("flightPath");
    map.removeSource("flightPath");
  }

  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: swappedCoordinates || [],
          type: "LineString",
        },
      },
    ],
  };

  map.addSource("flightPath", {
    type: "geojson",
    lineMetrics: true,
    data: geojson,
  });

  map.addLayer({
    id: "flightPath",
    type: "line",
    source: "flightPath",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#F43E0D",
      "line-width": 1.5,
      "line-gradient": [
        "interpolate",
        ["linear"],
        ["line-progress"],
        0,
        "#F79663",
        1,
        "#F43E0D",
      ],
    },
  });
};