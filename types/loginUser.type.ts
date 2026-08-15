import { z } from "zod";
import { loginUserSchema } from "../validators/loginUserSchema.validation";

export type LoginUserRequest = z.infer<typeof loginUserSchema>;

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  token: string;
}

export interface LoginUserResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserData;
}
