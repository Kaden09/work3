import { AxiosError } from "axios";
import { authApi } from "../../config/api/authApi";

interface LoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrorResponse {
  message: string;
  errors?: string[];
}

interface ApiErrorResponse {
  isSuccess: false;
  errors: Array<{ description: string }>;
}

async function fetchLogin({ email, password, rememberMe }: LoginParams) {
  try {
    const { data } = await authApi.post("/login", {
      email,
      password,
      rememberMe,
    });

    if (!data.isSuccess) {
      const errorMessage = data.errors?.[0]?.description || "Ошибка авторизации";
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const responseData = error.response.data as ValidationErrorResponse | ApiErrorResponse;

      if ("errors" in responseData && Array.isArray(responseData.errors)) {
        if (typeof responseData.errors[0] === "string") {
          throw new Error((responseData as ValidationErrorResponse).errors!.join(". "));
        }
        throw new Error((responseData as ApiErrorResponse).errors[0]?.description || "Ошибка авторизации");
      }

      if ("message" in responseData) {
        throw new Error(responseData.message);
      }
    }
    throw error;
  }
}

export default fetchLogin;
