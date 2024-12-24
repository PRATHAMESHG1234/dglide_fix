import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import store from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { GoogleOAuthProvider } from '@react-oauth/google';
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
const clientId = process.env.REACT_APP_GOOGLE_SECRET_KEY;

root.render(
  <BrowserRouter>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <GoogleOAuthProvider clientId={clientId}>
            <App />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </BrowserRouter>
);
