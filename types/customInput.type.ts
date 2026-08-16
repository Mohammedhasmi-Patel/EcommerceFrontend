import { LucideIcon } from "lucide-react";

export interface CustomInputProps {
  id: string;
  label: string;
  icon: LucideIcon;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  endAdornment?: React.ReactNode;
}
