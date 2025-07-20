// components/MapDisplay.tsx
import { useEffect, useRef } from "react";
import loader from "@/lib/googleMapsLoader";
import { toast } from "sonner";

interface MapDisplayProps {
  location: string; // JSON string with address and coordinates
  name: string;
}

const MapDisplay = ({ location, name }: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const parseLocation = (
    locationString: string | undefined | null
  ): { lat: number; lng: number } | null => {
    if (!locationString) return null;
    try {
      const locationData = JSON.parse(locationString);
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

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const coordinates = parseLocation(location);
    if (!coordinates) {
      console.error("Could not parse coordinates from location:", location);
      return;
    }

    const initMap = async () => {
      try {
        await loader.load();
        if (!mapRef.current) return;
        const mapOptions = {
          center: coordinates,
          zoom: 14,
        };
        mapInstanceRef.current = new google.maps.Map(
          mapRef.current,
          mapOptions
        );
        markerRef.current = new google.maps.Marker({
          position: coordinates,
          map: mapInstanceRef.current,
          title: name,
          animation: google.maps.Animation.DROP,
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Failed to load map. Please try again.");
      }
    };

    initMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, [location, name]);

  if (!parseLocation(location)) {
    return (
      <div className="w-full h-96 rounded-lg shadow-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Map unavailable: Invalid location</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg shadow-lg"
      style={{ minHeight: "24rem" }}
    />
  );
};

export default MapDisplay;
