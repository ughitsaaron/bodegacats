import React, { useState } from 'react';
import { size, some } from 'lodash';
import Chip from '@material-ui/core/Chip';
import { useMutation } from 'urql';
import { useParams } from 'react-router-dom';
import { useUser } from '../hooks';

const addReactionMutation = `
  mutation ($type: String!, $catId: ID!, $userId: ID!) {
    addReaction(type: $type, catId: $catId, userId: $userId) {
      id
      userId
      cat {
        reactions {
          id
        }
      }
    }
  }
`;

const removeReactionMutation = `
  mutation ($type: String!, $catId: ID!, $userId: ID!) {
    removeReaction(type: $type, catId: $catId, userId: $userId) {
      id
      userId
      cat {
        reactions {
          id
        }
      }
    }
  }
`;

export default function Reaction({ icon, reactions, type }) {
  const userId = useUser();
  const { catId } = useParams();

  const [count, setCount] = useState(size(reactions));
  const [hasClicked, toggleClicked] = useState(some(reactions, { userId }));
  const [, /*addReactionState*/ addReaction] = useMutation(addReactionMutation);
  const [, /*removeReactionState*/ removeReaction] = useMutation(removeReactionMutation);

  const clickHandler = () => {
    if (hasClicked) {
      setCount(count - 1);
      removeReaction({ type, userId, catId });
    } else {
      setCount(count + 1);
      addReaction({ type, userId, catId });
    }

    toggleClicked(!hasClicked);
  };

  return (
    <Chip
      color={hasClicked ? 'primary' : 'default'}
      icon={icon}
      label={count}
      onClick={clickHandler}
    />
  );
}
