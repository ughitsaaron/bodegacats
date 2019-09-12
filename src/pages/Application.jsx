import { DefaultMarker, MarkerStyles, markerClassNames } from '../components/MarkerTypes';
import { HashRouter, Route } from 'react-router-dom';
import Cat from '../pages/Cat';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Location from '../components/Location';
import Map from '../components/Map';
import Menu from '../components/Menu';
import React from 'react';
import Upload from './Upload';
import styled from 'styled-components';
import { useQuery } from 'urql';

const StyledMap = styled(Map).attrs({
  base: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  center: [40.7128, -74.006],
  controlPosition: 'bottomright',
  zoom: 13
})`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
`;

const Navigation = styled(List)`
  && {
    min-width: ${p => p.theme.spacing(20)}px;
  }
`;

const NavItem = ({ children, ...props }) => (
  <ListItem button component={Link} {...props}>
    {children}
  </ListItem>
);

export default function Application() {
  const [result] = useQuery({
    query: `{ cats { id, lat, lng } }`
  });

  return (
    <HashRouter basename={process.env.NODE_ENV === 'production' ? '/bodegacats' : '/'}>
      <>
        <Route>
          {({ history, location }) => (
            <StyledMap>
              <MarkerStyles />
              <Location />
              {result.data &&
                result.data.cats.map(marker => (
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
              <Route path="/cats/:id" component={Cat} />
              <Route path="/upload" component={Upload} />
            </StyledMap>
          )}
        </Route>
        <Menu>
          {(isOpen, toggle) => (
            <Navigation>
              <NavItem onClick={() => toggle(false)} to="/">
                Home
              </NavItem>
              <NavItem onClick={() => toggle(false)} to="/upload">
                Add a cat
              </NavItem>
            </Navigation>
          )}
        </Menu>
      </>
    </HashRouter>
  );
}
