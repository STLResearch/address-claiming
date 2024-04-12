export const toggleMapView = (map) => {
  if (map) {
    const currentStyleName = map?.getStyle().name;
    const newStyle =
      currentStyleName === "Mapbox Streets"
        ? "mapbox://styles/mapbox/satellite-v9"
        : "mapbox://styles/mapbox/streets-v12";
    map?.setStyle(newStyle);
  }
};

const adjustZoom = (delta,map) => {
  if (map) {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + delta);
  }
};

export const handleZoomIn = (map) => {
  adjustZoom(1,map);
};

export const handleZoomOut = (map) => {
  adjustZoom(-1,map);
};
