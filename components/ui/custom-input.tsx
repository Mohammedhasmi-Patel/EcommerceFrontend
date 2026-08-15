import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CustomInputProps } from "@/types/customInput.type";

/**
 * Reusable input with left icon, label, error display, and optional right adornment.
 * Accepts all native input props via rest spread + react-hook-form register.
 */
const CustomInput = React.forwardRef<
  HTMLInputElement,
  CustomInputProps & Omit<React.ComponentProps<"input">, "type" | "id">
>(
  (
    {
      id,
      label,
      icon: Icon,
      placeholder,
      type = "text",
      autoComplete,
      error,
      endAdornment,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="space-y-2 group/field">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>

        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-brand transition-colors duration-200" />

          <Input
            ref={ref}
            id={id}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={cn(
              "pl-10 h-10 rounded-xl bg-background/50 border-border/80 focus-visible:border-brand focus-visible:ring-brand/30 transition-all duration-200",
              endAdornment && "pr-10",
              className
            )}
            {...rest}
          />

          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {endAdornment}
            </div>
          )}
        </div>

        {error && (
          <p className="text-destructive text-xs font-medium pl-1 animate-in slide-in-from-top-1 duration-200">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput };
