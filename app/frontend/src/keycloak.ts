/**
 * Keycloak-Instanz-Konfiguration
 *
 * Zweck:
 * - Initialisiert die Keycloak-JavaScript-Adapter-Instanz, um Benutzeranmeldung,
 *   Token-Handling und Rollenverwaltung in der React-App zu ermöglichen.
 *
 * Konfigurationsparameter:
 * - `url`: Basis-URL des Keycloak-Servers (aus Sicht des Docker-Hosts oder lokal).
 * - `realm`: Name des Keycloak-Realms, in dem Benutzer und Clients verwaltet werden.
 * - `clientId`: Client-ID des Frontends (muss in Keycloak als Public Client registriert sein).
 *
 * Verwendung:
 * - Diese Instanz wird im `AuthProvider` als Context bereitgestellt und in der gesamten App genutzt.
 * - Zugriff auf Authentifizierungsstatus und Token über `useAuth()` (siehe AuthProvider.tsx).
 *
 * Beispiel:
 * ```ts
 * import keycloak from './keycloak';
 *
 * keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
 *   console.log(authenticated ? 'Eingeloggt' : 'Nicht eingeloggt');
 * });
 * ```
 *
 * Hinweis:
 * - Die URL muss von der Client-Anwendung aus erreichbar sein (CORS beachten).
 * - Der `clientId` muss in Keycloak so konfiguriert sein, dass Redirect-URIs der App zugelassen sind.
 */


import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080", // URL aus Docker-Host-Sicht
  realm: "sarcoma-dashboard",    // Dein Keycloak-Realm
  clientId: "frontend",     // Dein Keycloak-Client (Public)
});

export default keycloak;
