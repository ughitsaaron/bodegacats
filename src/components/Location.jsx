import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useLocation, useMap } from '../hooks';
import L from 'leaflet';
import Marker from '../components/Marker';
import blue from '@material-ui/core/colors/blue';

const CurrentPositionMarker = styled(Marker)``;

const circleIcon = L.divIcon({
  className: CurrentPositionMarker.componentStyle.componentId,
  iconSize: [14, 14]
});

const CurrentPositionMarkerStyles = createGlobalStyle`
  ${CurrentPositionMarker} {
    border-radius: 50%;
    background-image: linear-gradient(${blue[300]}, ${blue[600]});
    box-shadow: 2px 1px 4px 0 rgba(0, 0, 0, 0.65);
  }
`;

export default function Location() {
  const currentPosition = useLocation();
  const map = useMap();

  useEffect(() => {
    if (map && currentPosition) {
      map.flyTo(currentPosition);
    }
  }, [currentPosition, map]);

  return (
    <>
      <CurrentPositionMarkerStyles />
      {currentPosition && <CurrentPositionMarker latlng={currentPosition} icon={circleIcon} />}
    </>
  );
}
