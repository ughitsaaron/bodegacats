import React, { useEffect, useState } from 'react';
import Stepper, { Step } from '../components/Stepper';
import styled, { css } from 'styled-components';
import { useCreateCat, useMap } from '../hooks';
import Button from '../components/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import { NewMarker } from '../components/MarkerTypes';
import PhotoPicker from '../components/PhotoPicker';
import Typography from '@material-ui/core/Typography';
import exif2css from 'exif2css';

const Header = styled(CardHeader).attrs({
  titleTypographyProps: { variant: 'h6' }
})`
  && {
    padding: 0;
  }
`;

const Wrapper = styled.div`
  ${({ theme }) => `
    position: absolute;
    bottom: 0;
    width: 100%;
    box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.2);
    background-color: ${theme.palette.background.paper};
    padding: ${theme.spacing(2)}px;
  `}
`;

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

  // create state for
  const [{ objectUrl, orientation }, setImage] = useState({
    objectUrl: null,
    orientation: null
  });

  const [{ lat, lng }, setCoordinates] = useState({ lat: null, lng: null });
  const [isFetching, submitUpload, data, error] = useCreateCat();

  useEffect(() => {
    if (data) {
      history.push(`/cats/${data.catId}`);
    }
  }, [data, history]);

  return (
    <Wrapper>
      <Header
        title={<Typography variant="h6">Add a cat</Typography>}
        action={
          <Link to="/">
            <IconButton>
              <Close fontSize="small" />
            </IconButton>
          </Link>
        }
      />
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
                Drag the map to the location where you would like to add a new cat
              </Typography>
            </Step>

            {/* Step 2: User selects a photo they'd like to upload with the new record */}
            <Step isActive={activeStep === 1}>
              <Typography>Select a photo from your library or take one with your camera</Typography>
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
              <Typography variant="subtitle1">Does everything look okay?</Typography>
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
              <Button
                color="primary"
                disabled={isFetching}
                onClick={() => submitUpload(lat, lng, objectUrl)}>
                Submit
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
    </Wrapper>
  );
}
