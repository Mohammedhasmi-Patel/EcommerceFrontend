import { z } from "zod";
import { updateProfileSchema } from "../validators/updateProfileSchema.validation";

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
