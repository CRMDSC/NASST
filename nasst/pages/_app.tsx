// pages/_app.js
import React, { useEffect } from 'react';
import { Provider } from 'mobx-react';
import store from '../src/store/rootStore';
import { ThemeProvider as MaterialUIProvider } from '@mui/material/styles';
import { muiTheme } from '../src/theme';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    (window as any).root = store; // Make store available globally for debugging
  }, []);

  return (
    <Provider root={store} user={store.user} token={store.token}>
      <MaterialUIProvider theme={muiTheme}>
        <Component {...pageProps} />
      </MaterialUIProvider>
    </Provider>
  );
}

export default MyApp;
