import React, { useEffect, useState } from 'react';
import Stepper, { Step } from '../components/Stepper';
import styled, { css } from 'styled-components';
import { useCreateCat, useMap } from '../hooks';
import Box from '@material-ui/core/Box';
import Button from '../components/Button';
import Close from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { NewMarker } from '../components/MarkerTypes';
import PhotoPicker from '../components/PhotoPicker';
import Typography from '@material-ui/core/Typography';
import exif2css from 'exif2css';

const ActionContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    margin-top: ${({ theme }) => theme.spacing(1)}px;

    ${Button} {
      margin-right: ${theme.spacing(1)}px;
    }
  `}
`;

const Preview = styled.div.attrs({
  children: <div />
})`
  ${({ theme, orientation, image }) => css`
    width: 100%;
    height: ${theme.spacing(26)}px;
    position: relative;
    overflow: hidden;
    margin: ${theme.spacing(1)}px 0;

    > div {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-image: url(${image});
      background-position: center center;
      background-size: cover;
      ${exif2css(orientation)}
    }
  `}
`;

export default function Upload({ history }) {
  const map = useMap();

  const [isOpen, toggleOpen] = useState(false);

  // create state for
  const [{ objectUrl, orientation }, setImage] = useState({
    objectUrl: null,
    orientation: null
  });

  const [{ lat, lng }, setCoordinates] = useState({ lat: null, lng: null });
  const [{ fetching: isFetching, data, error }, createCat] = useCreateCat();

  useEffect(() => {
    toggleOpen(true);
  }, []);

  useEffect(() => {
    if (data) {
      history.push(`/cats/${data.catId}`);
    }
  }, [data, history]);

  const onClose = () => toggleOpen(false);
  const onExited = () => history.push('/');

  return (
    <Drawer
      open={isOpen}
      anchor="bottom"
      hideBackdrop
      onClose={onClose}
      SlideProps={{ onExited }}
      style={{ pointerEvents: 'none' }}>
      <Box pt={1} pr={2} pl={2} pb={2} style={{ pointerEvents: 'auto' }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Add a cat</Typography>
          <IconButton size="small" onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Stepper>
          {(activeStep, stepForward, stepBackward, resetStepper) => (
            <React.Fragment>
              {/* Adds a marker to the map that is draggable when the user is on the first step */}
              {map && (
                <NewMarker
                  map={map}
                  latlng={map.getCenter()}
                  draggable={activeStep === 0}
                  onChange={({ target }) => {
                    const latlng = target.getLatLng();
                    setCoordinates(latlng);
                  }}
                />
              )}

              {/* Step 1: User drags the marker on the map to the desired location */}
              <Step isActive={activeStep === 0}>
                <Typography>
                  Drag the marker to the location of your bodega cat on the map
                </Typography>
              </Step>

              {/* Step 2: User selects a photo they'd like to upload with the new record */}
              <Step isActive={activeStep === 1}>
                <Typography>Take a photo or select one from your library</Typography>
                <PhotoPicker
                  onChange={exif => {
                    setImage({
                      objectUrl: exif.src,
                      orientation: exif.Orientation
                    });
                    stepForward();
                  }}
                />
              </Step>

              {/* Step 3: User confirms their selections and submits */}
              <Step isActive={activeStep === 2}>
                <Preview orientation={orientation} image={objectUrl} />
                {error && (
                  <Typography variant="body1" color="error">
                    {error}
                  </Typography>
                )}
                <Button
                  color="primary"
                  disabled={isFetching}
                  onClick={() => createCat(lat, lng, objectUrl)}>
                  Looks good!
                </Button>
              </Step>

              {/* Navigation controls to step through the form */}
              <ActionContainer>
                <Button onClick={stepBackward} disabled={activeStep === 0}>
                  Back
                </Button>
                {activeStep === 2 ? (
                  <Button
                    onClick={() => {
                      resetStepper();
                      setImage({ src: null, orientation: null });
                      setCoordinates({ lat: null, lng: null });
                    }}>
                    Reset
                  </Button>
                ) : (
                  <Button onClick={stepForward} disabled={activeStep === 1 && !objectUrl}>
                    Next
                  </Button>
                )}
              </ActionContainer>
            </React.Fragment>
          )}
        </Stepper>
      </Box>
    </Drawer>
  );
}
