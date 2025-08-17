/**
 * Zentrale Axios-Instanz für API-Requests.
 * 
 * Zweck:
 * - Vermeidet wiederholte Angabe der Base-URL in jeder Anfrage
 * - Ermöglicht später einfache Erweiterungen (z. B. Auth-Header, Interceptor)
 * 
 * Standard:
 * - baseURL: 'http://localhost:8000' (lokales FastAPI-Backend)
 * 
 * Nutzung:
 * import api from '../api/axios';
 * api.get('/patients').then(res => console.log(res.data));
 */



import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8000',
});
