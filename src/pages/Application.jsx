import { DefaultMarker, MarkerStyles, markerClassNames } from '../components/MarkerTypes';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { get, map } from 'lodash';
import AddIcon from '@material-ui/icons/AddAPhotoRounded';
import Box from '@material-ui/core/Box';
import Cat from '../pages/Cat';
import Fab from '@material-ui/core/Fab';
import Location from '../components/Location';
import Map from '../components/Map';
import React from 'react';
import Upload from './Upload';
import styled from 'styled-components';
import { useQuery } from 'urql';

const StyledMap = styled(Map).attrs({
  base: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
  center: [40.7128, -74.006],
  zoom: 13
})`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
`;

export default function Application() {
  const [result] = useQuery({
    query: `{ cats { id, lat, lng } }`
  });

  return (
    <HashRouter>
      <Route>
        {({ history, location }) => (
          <Box
            width="100%"
            height="100%"
            display="flex"
            position="absolute"
            justifyContent="center"
            alignItems="flex-end"
            p={1}>
            <StyledMap>
              <MarkerStyles />
              <Location />
              <Fab variant="extended" color="primary" onClick={() => history.push('/upload')}>
                <Box mr={1}>
                  <AddIcon />
                </Box>
                Add a cat
              </Fab>
              <Switch>
                <Route path="/cats/:catId" component={Cat} />
                <Route path="/upload" component={Upload} />
              </Switch>
              {map(get(result, 'data.cats'), marker => (
                <DefaultMarker
                  key={marker.id}
                  latlng={[marker.lat, marker.lng]}
                  isActive={location.pathname === `/cats/${marker.id}`}
                  onActive={marker => {
                    const element = marker.getElement();

                    element.classList.add(markerClassNames.active);

                    return () => {
                      element.classList.remove(markerClassNames.active);
                    };
                  }}
                  onClick={() => {
                    history.push(`/cats/${marker.id}`);
                  }}
                />
              ))}
            </StyledMap>
          </Box>
        )}
      </Route>
    </HashRouter>
  );
}
