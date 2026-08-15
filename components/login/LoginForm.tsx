"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/validators/loginUserSchema.validation";
import { LoginUserRequest } from "@/types/loginUser.type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { LoginFormHeader } from "./LoginFormHeader";
import { LoginFormFooter } from "./LoginFormFooter";
import { LoginFormFields } from "./LoginFormFields";
import { showSuccess, showError } from "@/lib/toast";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserRequest>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginUserRequest) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.rejected.match(result)) {
      showError(result.payload as string || "Failed to login");
    } else if (loginUser.fulfilled.match(result)) {
      showSuccess(result.payload.message || "Welcome back!", "Redirecting to home page...");
      router.push("/");
    }
  };

  return (
    <Card className="w-full border-border/40 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/5 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-brand/5" size="sm">
      <LoginFormHeader />

      <CardContent className="px-6 sm:px-8 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <LoginFormFields register={register} errors={errors} />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer h-10 text-sm font-semibold rounded-xl bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <LoginFormFooter />
    </Card>
  );
};
