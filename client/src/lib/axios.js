import axios from "axios";
const url = import.meta.env.VITE_SERVER_URL;
console.log("url", url);

export const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});
