import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: false // cookies nahane nam false. JWT use nam below interceptor use karala header attach karanna.
});

// OPTIONAL: auth token attach karanna one nam uncomment karanna
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;