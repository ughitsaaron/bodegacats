'use client';
import { createContext, useContext } from 'react';
import type { Map as LeafletMap } from 'leaflet';

type MapContext = { map?: LeafletMap; }

const MapContext = createContext<MapContext>({ map: undefined });

export const MapProvider = MapContext.Provider;

export function useMap() {
  return useContext(MapContext)
}
