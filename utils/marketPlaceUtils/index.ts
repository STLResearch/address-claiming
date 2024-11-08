export function getTimeLeft(endDate: Date): string {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
  
    if (timeDiff <= 0) {
      return "Time's up!";
    }
  
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${seconds % 60}s`;
    }
  }
  export const getMapboxStaticImage = (lat, lng) => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},14/600x600?access_token=${accessToken}`;
  };