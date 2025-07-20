// lib/locationUtils.ts
interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const parseLocation = (
  locationString: string | undefined | null
): { lat: number; lng: number } | null => {
  if (!locationString) return null;
  try {
    const locationData: LocationData = JSON.parse(locationString);
    const { coordinates } = locationData;
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lng !== "number" ||
      isNaN(coordinates.lat) ||
      isNaN(coordinates.lng)
    ) {
      console.error("Invalid coordinates in location data:", locationData);
      return null;
    }
    return {
      lat: coordinates.lat,
      lng: coordinates.lng,
    };
  } catch (error) {
    console.error("Error parsing location JSON:", error);
    return null;
  }
};

export const parseLocationName = (
  locationString: string | undefined | null
): string => {
  if (!locationString) return "Address not available";
  try {
    const locationData: LocationData = JSON.parse(locationString);
    return locationData.address.split(",")[0].trim() || "Address not available";
  } catch (error) {
    console.error("Error parsing location JSON:", error);
    return locationString || "Address not available";
  }
};
