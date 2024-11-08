export interface RestrictedAreaResponseI {
  type: string;
  message: string;
  address?: string; 
  region: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][] | number[][][];
  };
}
