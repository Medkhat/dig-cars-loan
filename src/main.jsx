import '@/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import TagManager from 'react-gtm-module';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import App from '@/App';
import { persistor, store } from '@/app/store';
import { DeviceInfoProvider } from '@/contexts/device-info-context';
import ScrollContext from '@/contexts/scroll-context';
import { ThemeProvider } from '@/contexts/theme-context';
import GlobalStyles from '@/GlobalStyles';
import Page503 from '@/pages/503';

if (import.meta.env.PROD) {
  console.log = () => {};
}

const tagManagerArgs = {
  gtmId: 'GTM-5THKFTW',
  dataLayer: {
    userId: '001',
    userProject: 'project'
  }
};

TagManager.initialize(tagManagerArgs);

ReactDOM.render(
  <>
    <ThemeProvider initialTheme='dark'>
      <GlobalStyles />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DeviceInfoProvider>
            <BrowserRouter>
              <ScrollContext>
                <ErrorBoundary
                  FallbackComponent={Page503}
                  onReset={() => {
                    console.log('Reset Error');
                  }}
                >
                  {/*accessToken: 'e035877578967bb40a14e5f0cc2e0e07efcdbc47'*/}
                  <App />
                </ErrorBoundary>
              </ScrollContext>
            </BrowserRouter>
          </DeviceInfoProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </>,
  document.getElementById('root')
);
