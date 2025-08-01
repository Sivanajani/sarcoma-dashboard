import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './i18n';
import keycloak from './keycloak';

keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
  if (authenticated) {
    console.log('Keycloak authentication successful');
    console.log('Access Token:', keycloak.token);

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } else {
    console.warn('Keycloak authentication failed');
  }
}).catch((error) => {
  console.error('Keycloak initialization failed:', error);
});
