import React, { useEffect, useState } from 'react';
import { filter, get, partialRight, round } from 'lodash';
import { useMutation, useQuery } from 'urql';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Calendar from '@material-ui/icons/CalendarToday';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import Location from '@material-ui/icons/LocationOn';
import Reaction from '../components/Reaction';
import Typography from '@material-ui/core/Typography';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import styled from 'styled-components';
import { typography } from '@material-ui/system';
import { useLocation } from 'react-router-dom';

const LAT_LNG_PRECISION = 4;
const baseUrl = `https://s3.amazonaws.com/staging.bodegacatmap.com`;
const fallback =
  'https://www.nydailynews.com/resizer/wplZhfxcnWBj_QiKfxf5xMl7-Rc=/1200x0/top/arc-anglerfish-arc2-prod-tronc.s3.amazonaws.com/public/LWTDMJZF5FBNPFUT7I2ORVWUNM.jpg';

const Emoji = styled.span`
  ${typography}

  text-indent: 3px;
`;

const getCatById = `
  query ($id: ID!) {
    cat(id: $id) {
      id
      lat
      lng
      insertedAt
      reactions {
        id
        type
        userId
      }
      photos {
        id
      }
    }
  }
`;

const deleteCatById = `
  mutation ($id: ID!, $key: String!) {
    deleteCat(id: $id, key: $key) {
      id
    }
  }
`;

const reactionTypes = {
  like: 'like',
  laugh: 'laugh',
  scream: 'scream'
};

function Cat({
  match: {
    params: { catId }
  },
  history
}) {
  const [isOpen, toggleOpen] = useState(false);
  const [isDeleteDialogOpen, toggleDeleteDialog] = useState(false);
  const [{ data: deleteSuccess, error: deleteFailure }, deleteCat] = useMutation(deleteCatById);
  const [{ data, fetching }] = useQuery({
    query: getCatById,
    variables: { id: catId }
  });

  const { search } = useLocation();
  const query = new URLSearchParams(search);

  useEffect(() => {
    if (deleteSuccess) {
      toggleDeleteDialog(false);
      history.push('/');
    }
  }, [deleteSuccess, history]);

  useEffect(() => {
    if (data) {
      toggleOpen(true);
    } else if (fetching) {
      setTimeout(() => {
        toggleOpen(true);
      }, 150);
    }
  }, [data, fetching]);

  const roundLatlng = partialRight(round, LAT_LNG_PRECISION);
  const filterReactionsByType = type => filter(get(data, 'cat.reactions'), { type });

  const onClose = () => toggleOpen(false);
  const onExited = () => history.push('/');

  const insertedAt = parseISO(`${get(data, 'cat.insertedAt')} UTC`);
  const photo = get(data, 'cat.photos.0.id');

  return (
    <div>
      <Drawer
        open={isOpen}
        anchor="bottom"
        BackdropProps={{ invisible: true }}
        onClose={onClose}
        SlideProps={{ onExited }}>
        {fetching && (
          <Box display="flex" minHeight="300px" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        {data && (
          <CardMedia image={photo ? `${baseUrl}/${photo}-full.jpg` : fallback}>
            <Box
              height="304px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              p={1}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                  <Box mb={1}>
                    <Chip
                      size="small"
                      icon={<Calendar />}
                      label={
                        <React.Fragment>
                          Added {formatDistance(insertedAt, new Date(), { addSuffix: true })}
                        </React.Fragment>
                      }
                    />
                  </Box>
                  <Chip
                    icon={<Location />}
                    size="small"
                    label={[roundLatlng(data.cat.lat), roundLatlng(data.cat.lng)].join(', ')}
                  />
                </Box>
                <Fab size="small" onClick={onClose}>
                  <CloseIcon fontSize="small" />
                </Fab>
              </Box>
              <Box display="flex" justifyContent="center">
                {/* eslint-disable jsx-a11y/accessible-emoji */}
                <Box mr={1}>
                  <Reaction
                    icon={<Emoji fontSize={20}>😻</Emoji>}
                    type={reactionTypes.like}
                    reactions={filterReactionsByType(reactionTypes.like)}
                  />
                </Box>
                <Box mr={1}>
                  <Reaction
                    icon={<Emoji fontSize={20}>😹</Emoji>}
                    type={reactionTypes.laugh}
                    reactions={filterReactionsByType(reactionTypes.laugh)}
                  />
                </Box>
                <Reaction
                  icon={<Emoji fontSize={20}>🙀</Emoji>}
                  type={reactionTypes.scream}
                  reactions={filterReactionsByType(reactionTypes.scream)}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" pb={1}>
              {query.has('admin') && (
                <React.Fragment>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => toggleDeleteDialog(true)}
                    startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                  <Dialog open={isDeleteDialogOpen} onClose={() => toggleDeleteDialog(false)}>
                    <DialogTitle>Delete this cat?</DialogTitle>
                    <DialogContent>
                      <Typography gutterBottom>
                        Are you sure you want to delete this cat?
                      </Typography>
                      {deleteFailure && (
                        <Typography color="error">
                          There was a problem with your request.
                        </Typography>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button variant="outlined" onClick={() => toggleDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          const key = query.get('admin');
                          deleteCat({ id: catId, key });
                        }}>
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              )}
            </Box>
          </CardMedia>
        )}
      </Drawer>
    </div>
  );
}

export default Cat;
