"use client";

import { use, useEffect } from "react";
import { useMap } from "@/contexts/map";
import type { LatLngLiteral } from "leaflet";
import Cat from "@/db/types/public/Cats";

type Props = { markers: Promise<Cat[]> };

export function Markers({ markers: markersPromise }: Props) {
  const markers = use(markersPromise);
  const { map } = useMap();

  useEffect(() => {
    async function initMarkers() {
      const Marker = await import("leaflet").then((module) => module.Marker);
      console.log({ markers });
      if (map) {
        markers.forEach((marker) => {
          const m = new Marker({ lat: marker.lat, lng: marker.lng });
          m.addTo(map);
        });
      }
    }

    initMarkers();
  }, [map, markers]);

  return null;
}
