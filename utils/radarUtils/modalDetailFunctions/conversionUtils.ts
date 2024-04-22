export function convertToTimestampDate(epochTime?: number): string {
  if (epochTime === undefined) return "";
  const milliseconds = epochTime * 1000;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return formattedMinutes + ":" + formattedSeconds;
}

export function convertToHex(inputArray?: number[]): string {
  if (!inputArray) return "";
  let hexString = "";
  for (let i = 0; i < inputArray.length; i++) {
      const char = String.fromCharCode(inputArray[i]);
      hexString += char;
  }
  return hexString;
}
