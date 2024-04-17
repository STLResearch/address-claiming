import mapboxgl, { Map, Marker } from "mapbox-gl";

export const toggleMapView = (map: Map | null): void => {
  if (map) {
    const currentStyleName = map?.getStyle().name;
    const newStyle =
      currentStyleName === "Mapbox Streets"
        ? "mapbox://styles/mapbox/satellite-v9"
        : "mapbox://styles/mapbox/streets-v12";
    map?.setStyle(newStyle);
  }
};

const adjustZoom = (delta: number, map: Map | null): void => {
  if (map) {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + delta);
  }
};

export const handleZoomIn = (map: Map | null): void => {
  adjustZoom(1, map);
};

export const handleZoomOut = (map: Map | null): void => {
  adjustZoom(-1, map);
};
