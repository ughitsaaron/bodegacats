import styled, { createGlobalStyle } from 'styled-components';
import L from 'leaflet';
import Marker from '../components/Marker';
import React from 'react';
import blue from '@material-ui/core/colors/blue';

const iconFactory = className =>
  L.divIcon({
    html: `<svg viewBox="0 0 1000 1000"><use xlink:href="#marker" /></svg>`,
    iconSize: [42, 42],
    className
  });

const DefaultMarkerProxy = styled.div``;
const ActiveMarkerProxy = styled.div``;
const NewMarkerProxy = styled.div``;

export const markerClassNames = {
  default: DefaultMarkerProxy.componentStyle.componentId,
  active: ActiveMarkerProxy.componentStyle.componentId,
  new: NewMarkerProxy.componentStyle.componentId
};

export const MarkerStyles = createGlobalStyle`
  ${DefaultMarkerProxy} {
    fill: ${blue[400]};
    stroke-width: 0;
    filter: drop-shadow(1px -2px 2px rgba(0, 0, 0, 0.35))
  }

  ${ActiveMarkerProxy} {
    fill: ${blue[800]};
  }

  ${NewMarkerProxy} {
    fill: ${blue[400]};
    fill-opacity: 0.55;
    stroke: ${blue[800]};
    stroke-width: 30;
    stroke-dasharray: 50;
  }
`;

const defaultMarkerIcon = iconFactory(markerClassNames.default);
export function DefaultMarker(props) {
  return <Marker icon={defaultMarkerIcon} {...props} />;
}

const newMarkerIcon = iconFactory(markerClassNames.new);
export function NewMarker(props) {
  return <Marker icon={newMarkerIcon} {...props} />;
}
