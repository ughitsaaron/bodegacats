import Calendar from '@material-ui/icons/CalendarToday';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Location from '@material-ui/icons/LocationOn';
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import styled from 'styled-components';
import { useQuery } from 'urql';

const LATLNG_PRECISION = 6;

const fallback =
  'https://www.nydailynews.com/resizer/wplZhfxcnWBj_QiKfxf5xMl7-Rc=/1200x0/top/arc-anglerfish-arc2-prod-tronc.s3.amazonaws.com/public/LWTDMJZF5FBNPFUT7I2ORVWUNM.jpg';

const Wrapper = styled(Card).attrs({
  elevation: 0,
  square: true
})`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const MetaIcon = styled(SvgIcon).attrs({
  fontSize: 'small'
})`
  vertical-align: text-bottom;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
`;

const Meta = ({ icon, children }) => (
  <Typography gutterBottom variant="body2">
    <MetaIcon>{icon}</MetaIcon>
    {children}
  </Typography>
);

const Close = styled(Fab).attrs({
  component: Link,
  children: <CloseIcon fontSize="small" />
})`
  && {
    position: absolute;
    top: ${p => p.theme.spacing(2)}px;
    right: ${p => p.theme.spacing(2)}px;
    background-color: ${p => p.theme.palette.background.default};
  }
`;

const MetaContainer = styled.div`
  padding: ${p => p.theme.spacing(1)}px;
`;

const Photo = styled(CardMedia)`
  width: 100%;
  height: 40vh;
`;

const getCatById = `
  query ($id: ID!) {
    cat(id: $id) {
      id
      lat
      lng
      insertedAt
      photos {
        id
      }
    }
  }
`;

function Cat({
  history,
  match: {
    params: { id }
  }
}) {
  const [{ data }] = useQuery({
    query: getCatById,
    variables: { id }
  });

  const url = `https://s3.amazonaws.com/staging.bodegacatmap.com`;

  let insertedAt;

  if (data) {
    insertedAt = parseISO(`${data.cat.insertedAt} UTC`);
    console.log({ insertedAt });
  }

  return (
    <Wrapper>
      <Close size="small" component={Link} to="/" />
      {data && (
        <Photo
          image={data.cat.photos[0] ? `${url}/${data.cat.photos[0].id}-thumb.jpg` : fallback}
        />
      )}
      <MetaContainer>
        <Grid container>
          <Grid item xs={6}>
            {data && (
              <Meta icon={<Location />}>
                {Number.parseFloat(data.cat.lat).toPrecision(LATLNG_PRECISION)}
                {', '}
                {Number.parseFloat(data.cat.lng).toPrecision(LATLNG_PRECISION)}
              </Meta>
            )}
          </Grid>
          {insertedAt && (
            <Grid item xs={12}>
              <Meta icon={<Calendar />}>
                Added {formatDistance(insertedAt, new Date(), { addSuffix: true })}
              </Meta>
            </Grid>
          )}
        </Grid>
      </MetaContainer>
    </Wrapper>
  );
}

export default Cat;
