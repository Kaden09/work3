import axios from "axios";
import { setupAuthInterceptor } from "./interceptor";

export const authApi = axios.create({
  baseURL: "/api/Auth",
  timeout: 5000,
  withCredentials: true,
});

let interceptorInitialized = false;

export function initAuthApiInterceptor(onAuthFailure: () => void): void {
  if (interceptorInitialized) return;
  setupAuthInterceptor(authApi, onAuthFailure);
  interceptorInitialized = true;
}
