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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      reset();
      navigate("/app");
    },
  });
}

export default useRegistration;
