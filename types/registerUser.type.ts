import { z } from "zod";
import { registerUserSchema } from "../validators/registerUserSchema.validation";
import { UserData } from "./loginUser.type";

export type RegisterUserRequest = z.infer<typeof registerUserSchema>;

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserData;
}
