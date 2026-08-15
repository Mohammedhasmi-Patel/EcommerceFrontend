"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@/validators/registerUserSchema.validation";
import { RegisterUserRequest } from "@/types/registerUser.type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { RegisterFormHeader } from "./RegisterFormHeader";
import { RegisterFormFooter } from "./RegisterFormFooter";
import { RegisterFormFields } from "./RegisterFormFields";
import { showSuccess, showError } from "@/lib/toast";

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserRequest>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterUserRequest) => {
    const result = await dispatch(registerUser(data));

    if (registerUser.rejected.match(result)) {
      showError(result.payload as string || "Registration failed");
    } else if (registerUser.fulfilled.match(result)) {
      showSuccess("Account created successfully!", "Welcome to LuxeRetail.");
      router.push("/dashboard");
    }
  };

  return (
    <Card className="w-full border-border/40 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/5 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-brand/5" size="sm">
      <RegisterFormHeader />

      <CardContent className="px-6 sm:px-8 pb-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RegisterFormFields register={register} errors={errors} />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer h-10 text-sm font-semibold rounded-xl bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign up
                <ArrowRight className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <RegisterFormFooter />
    </Card>
  );
};
