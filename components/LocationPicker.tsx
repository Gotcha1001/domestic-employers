// components/LocationPicker.tsx
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import loader from "@/lib/googleMapsLoader";
import { toast } from "sonner";

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(value || "");
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: null,
    lng: null,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    loader
      .load()
      .then(() => {
        const mapElement = document.getElementById("map");
        if (!mapElement) {
          console.error("Map element not found");
          toast.error("Failed to load map. Please try again.");
          setOpen(false);
          return;
        }
        const map = new window.google.maps.Map(mapElement, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
        mapRef.current = map;
        if (inputRef.current) {
          const searchBox = new window.google.maps.places.SearchBox(
            inputRef.current
          );
          searchBoxRef.current = searchBox;
          map.addListener("bounds_changed", () => {
            const bounds = map.getBounds();
            if (bounds) {
              searchBox.setBounds(bounds);
            }
          });
          searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            if (!places || places.length === 0) return;
            const place = places[0];
            if (place.geometry?.location) {
              handleLocationSelect(place);
              map.setCenter(place.geometry.location);
              map.setZoom(15);
              new window.google.maps.Marker({
                map,
                position: place.geometry.location,
                title: place.name,
              });
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error loading Google Maps API:", err);
        toast.error("Failed to load map. Please try again.");
        setOpen(false);
      });
    return () => {
      mapRef.current = null;
      searchBoxRef.current = null;
    };
  }, [open]);

  const handleSearch = () => {
    if (searchBoxRef.current && searchValue.trim()) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchValue }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          mapRef.current?.setCenter(location);
          mapRef.current?.setZoom(15);
          new window.google.maps.Marker({
            map: mapRef.current,
            position: location,
          });
          if (inputRef.current) {
            inputRef.current.value = results[0].formatted_address;
            setSearchValue(results[0].formatted_address);
          }
          handleLocationSelect(results[0]);
        } else {
          toast.error("Location not found. Please try a different search.");
        }
      });
    }
  };

  const handleLocationSelect = (
    place: google.maps.places.PlaceResult | google.maps.GeocoderResult
  ) => {
    let address: string;
    if ("name" in place) {
      address = `${place.name}, ${place.formatted_address}`;
    } else {
      address = place.formatted_address || "";
    }
    const lat = place.geometry?.location?.lat() || 0;
    const lng = place.geometry?.location?.lng() || 0;
    setSelectedLocation(address);
    setCoordinates({ lat, lng });
    onChange(
      JSON.stringify({
        address, // Changed from location to address
        coordinates: { lat, lng },
      })
    );
  };

  return (
    <div className="w-full space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="relative w-full">
            <Input
              value={selectedLocation}
              placeholder="Click to select location"
              className="w-full cursor-pointer"
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">Select Location</DialogTitle>
            <p className="text-xs text-center">
              Type a location, select it in the dropdown, and hit the search
              button to grab it, then close, and the coordinates will show in
              the form
            </p>
          </DialogHeader>
          <div className="flex flex-col h-full space-y-4">
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for a location..."
                className="w-full pr-24"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                className="absolute right-0 top-0 h-full"
                type="button"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
            <div className="flex-1 w-full bg-gray-100 rounded-lg">
              <div id="map" className="w-full h-full rounded-lg"></div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpen(false)} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {coordinates.lat !== null && coordinates.lng !== null && (
        <div className="mt-4 text-gray-600">
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
