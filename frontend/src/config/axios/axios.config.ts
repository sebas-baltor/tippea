import axios from "axios";

export const axiosInstance = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_API_URL,
});
