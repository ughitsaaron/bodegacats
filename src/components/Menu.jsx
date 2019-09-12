import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import MenuIcon from '@material-ui/icons/Menu';
import styled from 'styled-components';

const MenuToggle = styled(Fab).attrs({
  size: 'small',
  children: <MenuIcon />
})`
  && {
    margin-top: ${p => p.theme.spacing(1)}px;
    margin-left: ${p => p.theme.spacing(1)}px;
  }
`;

export default function Menu({ children }) {
  const [isOpen, toggle] = useState(false);

  return (
    <React.Fragment>
      <MenuToggle onClick={() => toggle(true)} />
      <Drawer open={isOpen} onClose={() => toggle(false)}>
        {children(isOpen, toggle)}
      </Drawer>
    </React.Fragment>
  );
}
