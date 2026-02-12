import axios from "axios";
console.log("API FILE LOADED 🔥");
const API = axios.create({
  baseURL: "https://collabsphere-saas.onrender.com"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN FROM API:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;