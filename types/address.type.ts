import { z } from "zod";
import { addressSchema } from "../validators/addressSchema.validation";

export type AddressRequest = z.infer<typeof addressSchema>;

export interface AddressResponseData {
  id: string;
  userId: string;
  addressType: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  countryId: string;
  countryName: string;
  stateId: string;
  stateName: string;
  cityId: string;
  cityName: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AddressResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AddressResponseData[];
}

export interface SingleAddressResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AddressResponseData;
}

export interface DropdownItem {
  id: string;
  name: string;
}

export interface DropdownResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: DropdownItem[];
}
