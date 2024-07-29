export const fetchDataForTiles = async (tiles) => {
  const tilesToFetch = tiles.filter(tile => !tileCache.has(tile));

  if (tilesToFetch.length > 0) {
    // const data = await api.fetchData(tilesToFetch); // Fetch data from API
    // tilesToFetch.forEach((tile, index) => tileCache.set(tile, data[index]));
    console.log('api fetch!')
  }

  return tiles.map(tile => tileCache.get(tile));
};

export const removeDataForTiles = (tiles) => {
  tiles.forEach(tile => tileCache.delete(tile));
};

const tileCache = new Map();

export const getTileBounds = (lat, lng, tileSize) => {
  const latTile = Math.floor(lat / tileSize);
  const lngTile = Math.floor(lng / tileSize);
  return `${latTile}-${lngTile}`;
};

export const getTilesInBounds = (bounds, tileSize) => {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const tiles = new Set();

  for (let lng = minLng; lng <= maxLng; lng += tileSize) {
    for (let lat = minLat; lat <= maxLat; lat += tileSize) {
      tiles.add(getTileBounds(lat, lng, tileSize));
    }
  }

  return Array.from(tiles);
};
