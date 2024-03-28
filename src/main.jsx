import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProviderWrapper } from './context/auth.context.jsx';
import { CurrencyProviderWrapper } from './context/currency.context.jsx';
import { StyleProviderWrapper } from './context/style.context.jsx';

import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';

import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <StyleProviderWrapper>
        <CurrencyProviderWrapper>
          <PrimeReactProvider>
            <AuthProviderWrapper>
              <App />
            </AuthProviderWrapper>
          </PrimeReactProvider>
        </CurrencyProviderWrapper>
      </StyleProviderWrapper>
    </Router>
  </React.StrictMode>
);
