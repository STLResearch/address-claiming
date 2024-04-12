export function formatAccuracy(accuracyString) {
    const numericValue = parseFloat(accuracyString?.split("_")?.pop());
    if (accuracyString?.startsWith("meters_")) {
      return "< " + numericValue + " m";
    } else if (accuracyString?.startsWith("meter_per_second_")) {
      return "< " + numericValue + " m/s";
    } else {
      return accuracyString;
    }
  }