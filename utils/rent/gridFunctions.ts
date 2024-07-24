export const createGrid = (latRange, lngRange, cellSize) => {
    const grid = [];
    for (let lat = latRange[0]; lat <= latRange[1]; lat += cellSize) {
      for (let lng = lngRange[0]; lng <= lngRange[1]; lng += cellSize) {
        grid.push({
          minLat: lat,
          maxLat: lat + cellSize,
          minLng: lng,
          maxLng: lng + cellSize
        });
      }
    }
    return grid;
  };
  
  export const getGridCellsInBounds = (bounds, grid) => {
    const [minLng, minLat, maxLng, maxLat] = bounds;
    return grid.filter(cell =>
      minLng < cell.maxLng &&
      maxLng > cell.minLng &&
      minLat < cell.maxLat &&
      maxLat > cell.minLat
    );
  };
  