import { z } from "zod";

export const registerUserSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters." })
      .max(50, { message: "First name cannot exceed 50 characters." }),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters." })
      .max(50, { message: "Last name cannot exceed 50 characters." }),
    email: z

      .email({ message: "Please enter a valid email address." })
      .max(100, { message: "Email cannot exceed 100 characters." }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    ,
    confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
    avatar: z
      .any()
      .refine(
        (files) => files && files.length > 0,
        { message: "Profile avatar is required." }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
