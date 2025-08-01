import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './i18n';
import keycloak from './keycloak';
import { AuthProvider } from './AuthProvider';

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256',
}).then((authenticated) => {
  if (authenticated) {
    console.log('Keycloak authentication successful');
    console.log('Access Token:', keycloak.token);
    
    setInterval(() => {
      keycloak.updateToken(60).then((refreshed) => {
        if (refreshed) {
          console.log('Token refreshed!');
        }
      }).catch(() => {
        console.error('Token refresh failed – force re-login');
        keycloak.login();
      });
    }, 60000);

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>,
    );
  } else {
    console.warn('Keycloak authentication failed');
  }
}).catch((error) => {
  console.error('Keycloak initialization failed:', error);
});
