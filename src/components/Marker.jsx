import { useEffect, useRef } from 'react';
import { useMap, usePrevious } from '../hooks';
import L from 'leaflet';
import { noop } from 'lodash';

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
        icon
      });

      // set event handlers
      markerLayer.on('dragend', onChange);
      markerLayer.on('add', onChange);
      markerLayer.on('click', onClick);

      map.addLayer(markerLayer);
      marker.current = markerLayer;
    }
  });

  useEffect(() => {
    return () => {
      map.removeLayer(marker.current);
    };
  }, [map]);

  // handle active and non-active state
  const cleanup = useRef();
  const wasActive = usePrevious(isActive);
  useEffect(() => {
    if (isActive) {
      // when a marker is made active, store the fn returned by
      // on active as the "cleanup" function to be called later
      cleanup.current = onActive(marker.current);
    } else if (wasActive) {
      // call the assigned cleanup function when a marker is no
      // longer marked active
      cleanup.current(marker.current);
    }
  }, [isActive, wasActive, onActive]);

  // enable and disable marker dragging
  const wasDraggable = usePrevious(draggable);

  useEffect(() => {
    if (marker.current && draggable) {
      marker.current.dragging.enable();
    } else if (wasDraggable) {
      marker.current.dragging.disable();
    }
  }, [draggable, wasDraggable]);

  return null;
}
