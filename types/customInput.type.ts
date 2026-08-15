import { LucideIcon } from "lucide-react";
import { FieldError } from "react-hook-form";

export interface CustomInputProps {
  id: string;
  label: string;
  icon: LucideIcon;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: FieldError;
  endAdornment?: React.ReactNode;
}
