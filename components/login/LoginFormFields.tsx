import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginUserRequest } from "@/types/loginUser.type";
import { CustomInput } from "@/components/ui/custom-input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginUserRequest>;
  errors: FieldErrors<LoginUserRequest>;
}

export const LoginFormFields = ({ register, errors }: LoginFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <CustomInput
        id="login-email"
        label="Email"
        icon={Mail}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email}
        {...register("email")}
      />

      <CustomInput
        id="login-password"
        label="Password"
        icon={Lock}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 cursor-pointer" />
            ) : (
              <Eye className="w-4 h-4 cursor-pointer" />
            )}
          </button>
        }
        {...register("password")}
      />
    </div>
  );
};

