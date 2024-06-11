export function formatTimeAgoFromMilliseconds(timestamp?: number): string {
    if (timestamp === undefined) return ""; 
    const currentTime = Date.now();
    const elapsedTime = currentTime - timestamp;
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes} ago`;
    return formattedTime;
  }