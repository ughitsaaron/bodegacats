import { useEffect, useRef } from 'react';
import { useMap, usePrevious } from '../hooks';
import L from 'leaflet';

const noop = () => {};

export default function Marker({
  latlng = null,
  draggable = false,
  icon,
  onChange = noop,
  isActive = false,
  onActive = noop,
  onClick = noop
}) {
  const map = useMap();
  const marker = useRef();

  // initialize the marker
  useEffect(() => {
    if (!marker.current) {
      const markerLayer = L.marker(latlng, {
        draggable,
        ...(icon ? { icon } : {}) // set the icon option if a value for icon is provided
      });

      // set event handlers
      markerLayer.on('dragend', onChange);
      markerLayer.on('add', onChange);
      markerLayer.on('click', onClick);

      map.addLayer(markerLayer);
      marker.current = markerLayer;
    }
  });

  // handle active and non-active state
  const cleanupFn = useRef();
  const wasActive = usePrevious(isActive);

  useEffect(() => {
    if (isActive) {
      cleanupFn.current = onActive(marker.current);
    } else if (wasActive) {
      cleanupFn.current(marker.current);
    }
  }, [isActive, wasActive, onActive]);

  // enable and disable marker dragging
  const wasDraggable = usePrevious(draggable);

  useEffect(() => {
    if (draggable) {
      marker.current.dragging.enable();
    } else if (wasDraggable) {
      marker.current.dragging.disable();
    }
  }, [draggable, wasDraggable]);

  useEffect(() => {
    if (!latlng) {
      map.removeLayer(marker.current);
    }
  }, [latlng, map]);

  return null;
}
