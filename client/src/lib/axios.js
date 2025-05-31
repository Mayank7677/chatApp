import axios from "axios";
const url = import.meta.env.VITE_SERVER_URL;

export const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});
 