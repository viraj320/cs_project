import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend port
});

// Send credentials to backend
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
