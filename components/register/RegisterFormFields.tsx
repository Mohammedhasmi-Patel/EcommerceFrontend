import { FieldErrors, UseFormRegister } from "react-hook-form";
import { RegisterUserRequest } from "@/types/registerUser.type";
import { CustomInput } from "@/components/ui/custom-input";
import { Mail, Lock, User, Image, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface RegisterFormFieldsProps {
  register: UseFormRegister<RegisterUserRequest>;
  errors: FieldErrors<RegisterUserRequest>;
}

export const RegisterFormFields = ({ register, errors }: RegisterFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          id="register-firstname"
          label="First Name"
          icon={User}
          placeholder="John"
          error={errors.firstName}
          {...register("firstName")}
        />

        <CustomInput
          id="register-lastname"
          label="Last Name"
          icon={User}
          placeholder="Doe"
          error={errors.lastName}
          {...register("lastName")}
        />
      </div>

      <CustomInput
        id="register-email"
        label="Email"
        icon={Mail}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email}
        {...register("email")}
      />

      <CustomInput
        id="register-avatar"
        label="Avatar Profile Image"
        icon={Image}
        type="file"
        accept="image/*"
        error={errors.avatar}
        className="file:text-brand file:font-semibold file:cursor-pointer hover:file:text-brand-hover cursor-pointer"
        {...register("avatar")}
      />

      <CustomInput
        id="register-password"
        label="Password"
        icon={Lock}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
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

      <CustomInput
        id="register-confirm-password"
        label="Confirm Password"
        icon={Lock}
        type={showConfirmPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4 cursor-pointer" />
            ) : (
              <Eye className="w-4 h-4 cursor-pointer" />
            )}
          </button>
        }
        {...register("confirmPassword")}
      />
    </div>
  );
};
