import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { API_ENDPOINT } from './client';
import { MapContext } from './components/Map';
import { useMutation } from 'urql';

export const useMap = () => useContext(MapContext);

export const useToggle = (initialState = false) => {
  const [isToggled, setToggle] = useState(initialState);
  const toggle = () => setToggle(!isToggled);

  return { isToggled, toggle };
};

export const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const defaultStepActionTypes = {
  next: 'next',
  back: 'back',
  reset: 'reset'
};

export const useStepper = (actionTypes = defaultStepActionTypes, initialStep = 0) => {
  const [activeStep, dispatch] = useReducer((state, { type }) => {
    switch (type) {
      case actionTypes.next:
        return state + 1;
      case actionTypes.back:
        return state - 1;
      case actionTypes.reset:
        return initialStep;
      default:
        throw Error('Unexpected action type');
    }
  }, initialStep);

  const stepForward = () => dispatch({ type: actionTypes.next });
  const stepBackward = () => dispatch({ type: actionTypes.back });
  const resetStepper = () => dispatch({ type: actionTypes.reset });

  return [activeStep, stepForward, stepBackward, resetStepper];
};

const addCat = `
  mutation ($lat: Float!, $lng: Float!) {
    createCat(lat: $lat, lng: $lng) {
      id
    }
  }
`;

const addPhoto = `
  mutation ($catId: ID!, $photoUpload: Upload!) {
    createPhoto(catId: $catId, photoUpload: $photoUpload) {
      id,
      cat {
        id
      }
    }
  }
`;

// async function that performs a multipart fetch upload
// i use fetch here rather than urql in order to avoid doing
// complicated bullshit like writing a bunch of middleware or
// whatever it is they recommend
const createNewPhoto = async (photoSrc, catId) => {
  if (!photoSrc || !catId) {
    throw Error('missing one of required arguments: photoSrc, catId');
  }

  const blob = await fetch(photoSrc).then(res => res.blob());
  const body = new FormData();

  body.append('query', addPhoto);
  body.append('variables', JSON.stringify({ catId, photoUpload: 'photo' }));
  body.append('photo', blob);

  return fetch(API_ENDPOINT, { method: 'post', body })
    .then(res => res.json())
    .then(res => res.data.createPhoto);
};

// create cat hook joins both requests to add a new photo and new cat record
export const useCreateCat = () => {
  const [addCatState, addCatMutation] = useMutation(addCat);
  const [results, setResults] = useState();

  const createCatMutation = useCallback(
    async (lat, lng, src) => {
      try {
        const cat = await addCatMutation({ lat, lng });
        const photo = await createNewPhoto(src, cat.data.createCat.id);

        setResults({
          photoId: photo.id,
          catId: cat.data.createCat.id
        });
      } catch {}
    },
    [addCatMutation]
  );

  return [{ ...addCatState, data: results }, createCatMutation];
};

export const useLocation = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (coords) {
        setPosition([coords.latitude, coords.longitude]);
      }
    });
  }, []);

  return position;
};

export const useUser = () => {
  const [userId, setUserId] = useState(() => {
    try {
      const idFromLocalStorage = localStorage.getItem('userId');

      return idFromLocalStorage;
    } catch (e) {
      return undefined;
    }
  });

  useEffect(() => {
    if (!userId) {
      const newUserId = Math.random()
        .toString(36)
        .slice(2);
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, [userId]);

  return userId;
};
