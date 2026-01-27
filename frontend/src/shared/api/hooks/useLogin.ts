import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReset } from "react-hook-form";
import fetchLogin from "../requests/login";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

function useLogin(reset: UseFormReset<LoginFormData>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      reset();
      navigate("/app");
    },
  });
}

export default useLogin;
