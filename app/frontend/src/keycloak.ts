import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080", // URL aus Docker-Host-Sicht
  realm: "sarcoma-dashboard",    // Dein Keycloak-Realm
  clientId: "frontend",     // Dein Keycloak-Client (Public)
});

export default keycloak;
