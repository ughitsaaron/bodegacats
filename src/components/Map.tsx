"use client";
import { useState, useCallback } from "react";
import { PropsWithChildren, RefCallback } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapProvider } from "@/contexts/map";
import { useGeolocation } from "@/hooks/useGeolocation";

export function Map(props: PropsWithChildren) {
  const [map, setMap] = useState<LeafletMap>();
  const coords = useGeolocation({ lat: 40.776676, lng: -73.971321 });

  const initMapCallback = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      async function init() {
        try {
          if (node && !map) {
            const L = await import("leaflet");
            const leaflet = new L.Map(node).setView(coords, 12);
            L.tileLayer(
              "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            ).addTo(leaflet);
            setMap(leaflet);
          }
        } catch {
          // hmm…
        }
      }

      init();
    },
    [map, coords]
  );

  return (
    <MapProvider value={{ map }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <div ref={initMapCallback} style={{ width: "100%", height: "100%" }} />
      </div>
      {props.children}
    </MapProvider>
  );
}
