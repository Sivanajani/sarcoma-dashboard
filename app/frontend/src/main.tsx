/**
 * main.tsx – App-Einstieg + Keycloak-Bootstrap
 *
 * Zweck:
 * - Initialisiert Keycloak **vor** dem Rendern der React-App.
 * - Erzwingt Login (`onLoad: 'login-required'`) und bindet die Auth-Session via `AuthProvider` ein.
 * - Richtet ein periodisches Token-Refresh (PKCE, 60s Vorlauf) ein.
 *
 * Ablauf:
 * 1) `keycloak.init({...})`
 *    - onLoad: 'login-required' → Weiterleitung zum Login, falls nicht authentifiziert
 *    - checkLoginIframe: false → reduziert IFrame-Checks (nützlich in Docker/localhost)
 *    - pkceMethod: 'S256' → aktiviert PKCE für OIDC (empfohlen)
 *
 * 2) Bei Erfolg (`authenticated === true`)
 *    - Startet Intervall: `keycloak.updateToken(60)` alle 60s, um das Access Token rechtzeitig zu erneuern.
 *    - Rendert die React-App (StrictMode) und umhüllt sie mit `AuthProvider`.
 *
 * 3) Fehlerfälle
 *    - Init-Fehler → Log in der Konsole.
 *    - Refresh-Fehler → erzwungenes Re-Login (`keycloak.login()`).
 *
 * Sicherheit/Operational Notes:
 * - Das Loggen des Access Tokens in der Konsole ist **nur für Entwicklung** sinnvoll.
 *   In Produktion entfernen/unterbinden.
 * - Das Refresh-Intervall sollte bei Unmount/Hot-Reloads aufgeräumt werden (siehe Hinweise unten).
 *
 * Abhängigkeiten:
 * - `keycloak` (keycloak-js), `AuthProvider` (React Context), i18n-Setup (`./i18n`), React 18 Root API.
 */


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
