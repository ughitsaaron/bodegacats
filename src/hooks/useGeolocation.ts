import { useEffect, useState } from "react";

type LatLng = {
  lat: number;
  lng: number;
};

export function useGeolocation(initValue: LatLng) {
  const [coords, setCoords] = useState(() => {
    if (typeof window !== "undefined" && "localStorage" in window) {
      const coords = localStorage.getItem("geolocation-coords");

      if (coords) {
        const { lat, lng } = JSON.parse(coords);
        return { lat, lng };
      }
    }

    return initValue;
  });

  useEffect(() => {
    if (window && "navigator" in window) {
      window.navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          const latlng = { lat: latitude, lng: longitude };
          localStorage.setItem("geolocation-coords", JSON.stringify(latlng));
          setCoords(latlng);
        }
      );
    }
  }, []);

  return coords;
}
