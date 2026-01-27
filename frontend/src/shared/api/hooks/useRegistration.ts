import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import fetchRegister from "../requests/register";
import type { UseFormReset } from "react-hook-form";
import type { ISignupForm } from "../../../widgets/Forms/SignupForm/types";

function useRegistration(reset: UseFormReset<ISignupForm>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchRegister,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] });
      reset();
      navigate("/app", { replace: true });
    },
  });
}

export default useRegistration;
