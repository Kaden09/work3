import axios from "axios";

export const userApi = axios.create({
  baseURL: "/api/User",
  timeout: 5000,
  withCredentials: true,
});
