import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, TLogin } from "@/schema/auth";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { loginFunc } from "@/lib/axios";
import { useToken } from "./use-context";

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { toast } = useToast();
  const router = useRouter();

  const { setToken } = useToken();

  const onSubmitFunc = async (val: TLogin) => {
    try {
      const res = await loginFunc(val);
      if (res && +res.status !== 200)
        return toast({
          title: "Sign Up Failed",
          variant: "destructive",
          // @ts-expect-error
          description: res.data.detail ?? "Something went wrong",
          duration: 4000,
        });

      // @ts-expect-error
      const { access_token } = res.data;
      setToken(access_token);

      toast({
        title: "Sign Up Successfull",
        variant: "default",
        duration: 4000,
      });

      return router.replace("/");
    } catch (err) {
      return toast({
        title: "Sign Up Failed",
        variant: "destructive",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        duration: 4000,
      });
    }
  };

  return {
    handleSubmit: handleSubmit(onSubmitFunc),
    register,
    isSubmitting,
    errors,
  };
};
