
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', //  Change this in production
  withCredentials: true, //  Use this only if backend sends cookies (e.g., session-based auth)
  
});

export default API;
