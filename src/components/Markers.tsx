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
      if (map) {
        markers.forEach((marker) => {
          const m = new Marker({
            lat: Number(marker.lat),
            lng: Number(marker.lng),
          });
          m.addTo(map);
        });
      }
    }

    initMarkers();
  }, [map, markers]);

  return null;
}
