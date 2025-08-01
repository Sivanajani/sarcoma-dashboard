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