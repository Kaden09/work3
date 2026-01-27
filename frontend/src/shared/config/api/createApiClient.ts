import axios, { type AxiosInstance } from "axios";
import { setupAuthInterceptor } from "./interceptor";

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

interface ApiClientInstance {
  client: AxiosInstance;
  initInterceptor: (onAuthFailure: () => void) => void;
}

export function createApiClient(config: ApiClientConfig): ApiClientInstance {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 5000,
    withCredentials: true,
  });

  let initialized = false;

  const initInterceptor = (onAuthFailure: () => void): void => {
    if (initialized) return;
    setupAuthInterceptor(client, onAuthFailure);
    initialized = true;
  };

  return { client, initInterceptor };
}
