import { z } from "zod";

export const addressSchema = z.object({
  addressType: z.string().min(2, "Address type (e.g. Home, Work) is required"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits"),
  addressLine1: z.string().min(5, "Address Line 1 must be at least 5 characters"),
  addressLine2: z.string().optional().or(z.literal("")),
  countryId: z.uuid("Please select a valid country"),
  stateId: z.uuid("Please select a valid state"),
  cityId: z.uuid("Please select a valid city"),
  postalCode: z.string().min(2, "Postal code must be at least 2 characters"),
  isDefault: z.boolean(),
});
