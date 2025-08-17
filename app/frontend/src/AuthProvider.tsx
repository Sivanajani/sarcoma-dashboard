/**
 * Authentifizierungskontext für Keycloak
 *
 * Zweck:
 * - Stellt eine zentrale React Context API-Integration für die Keycloak-Instanz bereit.
 * - Ermöglicht den Zugriff auf die Keycloak-Session, Benutzerinformationen und Authentifizierungsstatus
 *   von jeder beliebigen Komponente aus.
 *
 * Hauptbestandteile:
 * - `AuthContext`: React Context, der die Keycloak-Instanz speichert.
 * - `useAuth()`: Custom Hook, um den Keycloak-Context bequem in Komponenten zu nutzen.
 * - `AuthProvider`: Context-Provider, der Keycloak an alle Kinder-Komponenten weitergibt.
 *
 * Verwendung:
 * 1. `AuthProvider` muss die oberste Ebene der App (z. B. in App.tsx) umschliessen.
 * 2. Über `useAuth()` können Komponenten auf die Keycloak-Methoden und den Authentifizierungsstatus zugreifen.
 *
 * Beispiel:
 * ```tsx
 * const keycloak = useAuth();
 * if (keycloak.authenticated) {
 *   console.log("Eingeloggt als", keycloak.tokenParsed?.preferred_username);
 * }
 * ```
 *
 * Abhängigkeiten:
 * - `keycloak`: Muss vorher korrekt initialisiert und konfiguriert werden (siehe keycloak.ts).
 */


import React, { createContext, useContext } from 'react';
import keycloak from './keycloak';

const AuthContext = createContext(keycloak);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={keycloak}>
      {children}
    </AuthContext.Provider>
  );
};