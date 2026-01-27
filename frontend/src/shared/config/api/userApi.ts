import axios from "axios";
import { setupAuthInterceptor } from "./interceptor";

export const userApi = axios.create({
  baseURL: "/api/User",
  timeout: 5000,
  withCredentials: true,
});

let interceptorInitialized = false;

export function initUserApiInterceptor(onAuthFailure: () => void): void {
  if (interceptorInitialized) return;
  setupAuthInterceptor(userApi, onAuthFailure);
  interceptorInitialized = true;
}
