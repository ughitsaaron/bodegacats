import * as serviceWorker from './serviceWorker';
import Application from './pages/Application';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider as GraphQLProvider } from 'urql';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import client from './client';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: 'light'
  }
});

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <GraphQLProvider value={client}>
        <Application />
      </GraphQLProvider>
    </ThemeProvider>
  </React.Fragment>,
  document.getElementById('root')
);

// Don't prevent the browser from hanging when loading Google fonts
const font = document.createElement('style');
font.innerText = "@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap')";
document.body.appendChild(font);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
