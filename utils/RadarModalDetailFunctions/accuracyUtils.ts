export function formatAccuracy(accuracyString?: string): string {
    const numericValue = parseFloat(accuracyString?.split("_")?.pop() || "0");
    if (accuracyString?.startsWith("meters_")) {
      return "< " + numericValue + " m";
    } else if (accuracyString?.startsWith("meter_per_second_")) {
      return "< " + numericValue + " m/s";
    } else {
      return accuracyString || "";
    }
  }