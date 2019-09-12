import React, { createContext, useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export const MapContext = createContext();

export default function Map({
  base,
  center,
  zoom,
  controlPosition = 'topleft',
  children,
  onClick,
  className
}) {
  const container = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (!map) {
      const mapInstance = L.map(container.current).setView(center, zoom);
      L.tileLayer(base).addTo(mapInstance);

      mapInstance.zoomControl.setPosition(controlPosition);

      setMap(mapInstance);
    }
  }, [base, center, controlPosition, map, onClick, zoom]);

  return (
    <>
      <div ref={container} className={className} data-testid="container" />
      <MapContext.Provider value={map} data-testid="map-provider">
        {children}
      </MapContext.Provider>
    </>
  );
}
