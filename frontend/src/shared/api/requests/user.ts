import { userApi } from "../../config/api/userApi";

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  errors?: Array<{ description: string }>;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const { data } = await userApi.put<ApiResponse<boolean>>("/password", {
    oldPassword,
    newPassword,
  });

  if (!data.isSuccess) {
    throw new Error(data.errors?.[0]?.description || "Ошибка смены пароля");
  }
  return true;
}
