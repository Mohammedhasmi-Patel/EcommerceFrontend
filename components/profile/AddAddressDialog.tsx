"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "@/validators/addressSchema.validation";
import { AddressRequest, DropdownItem, DropdownResponse } from "@/types/address.type";
import { CustomInput } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { MapPin, Home, Tag, Phone, User, Landmark, Loader2, ChevronDown } from "lucide-react";
import { axiosInstance } from "@/config/axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { showSuccess, showError } from "@/lib/toast";

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddAddressDialog = ({ open, onOpenChange, onSuccess }: AddAddressDialogProps) => {
  const [countries, setCountries] = useState<DropdownItem[]>([]);
  const [states, setStates] = useState<DropdownItem[]>([]);
  const [cities, setCities] = useState<DropdownItem[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressRequest>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressType: "",
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      countryId: "",
      stateId: "",
      cityId: "",
      postalCode: "",
      isDefault: false,
    },
  });

  const selectedCountryId = watch("countryId");
  const selectedStateId = watch("stateId");
  const isDefaultChecked = watch("isDefault");

  // Fetch countries
  useEffect(() => {
    if (!open) return;
    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get<DropdownResponse>(ENDPOINTS.COUNTRIES);
        setCountries(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, [open]);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountryId) {
      setStates([]);
      return;
    }
    const fetchStates = async () => {
      try {
        const res = await axiosInstance.get<DropdownResponse>(ENDPOINTS.STATES, {
          params: { countryId: selectedCountryId },
        });
        setStates(res.data?.data || []);
        setValue("stateId", "");
        setValue("cityId", "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, [selectedCountryId, setValue]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get<DropdownResponse>(ENDPOINTS.CITIES, {
          params: { stateId: selectedStateId },
        });
        setCities(res.data?.data || []);
        setValue("cityId", "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchCities();
  }, [selectedStateId, setValue]);

  const onSubmit = async (data: AddressRequest) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.USER_ADDRESSES, data);
      showSuccess("Address Saved", response.data.message || "Your address has been added successfully.");
      onOpenChange(false);
      reset();
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Failed to save address.");
      showError("Add address failed", errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Add New Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Row 1: Type + Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              id="addr-type"
              label="Address Type"
              icon={Tag}
              placeholder="e.g. Home, Work"
              error={errors.addressType}
              {...register("addressType")}
            />
            <CustomInput
              id="addr-name"
              label="Full Name"
              icon={User}
              placeholder="Aadil M Patel"
              error={errors.fullName}
              {...register("fullName")}
            />
          </div>

          {/* Row 2: Phone + Postal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              id="addr-phone"
              label="Phone Number"
              icon={Phone}
              placeholder="9106624120"
              error={errors.phoneNumber}
              {...register("phoneNumber")}
            />
            <CustomInput
              id="addr-zip"
              label="Zip / Postal Code"
              icon={MapPin}
              placeholder="90210"
              error={errors.postalCode}
              {...register("postalCode")}
            />
          </div>

          {/* Row 3: Address lines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              id="addr-line1"
              label="Address Line 1"
              icon={Home}
              placeholder="742 Evergreen Terrace"
              error={errors.addressLine1}
              {...register("addressLine1")}
            />
            <CustomInput
              id="addr-line2"
              label="Address Line 2 (Optional)"
              icon={Home}
              placeholder="Apt 4B"
              error={errors.addressLine2}
              {...register("addressLine2")}
            />
          </div>

          {/* Row 4: Country / State / City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Country */}
            <div className="space-y-2 group/field">
              <Label htmlFor="addr-country" className="text-sm font-medium">Country</Label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-brand transition-colors duration-200" />
                <select
                  id="addr-country"
                  className="pl-10 pr-10 h-10 w-full rounded-xl bg-background/50 border border-border/80 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30 focus-visible:outline-none transition-all duration-200 outline-none appearance-none cursor-pointer text-foreground"
                  {...register("countryId")}
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.countryId && (
                <p className="text-destructive text-xs font-medium pl-1">{errors.countryId.message}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2 group/field">
              <Label htmlFor="addr-state" className="text-sm font-medium">State</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-brand transition-colors duration-200" />
                <select
                  id="addr-state"
                  disabled={!selectedCountryId}
                  className="pl-10 pr-10 h-10 w-full rounded-xl bg-background/50 border border-border/80 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30 focus-visible:outline-none transition-all duration-200 outline-none appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  {...register("stateId")}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.stateId && (
                <p className="text-destructive text-xs font-medium pl-1">{errors.stateId.message}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2 group/field">
              <Label htmlFor="addr-city" className="text-sm font-medium">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-brand transition-colors duration-200" />
                <select
                  id="addr-city"
                  disabled={!selectedStateId}
                  className="pl-10 pr-10 h-10 w-full rounded-xl bg-background/50 border border-border/80 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30 focus-visible:outline-none transition-all duration-200 outline-none appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  {...register("cityId")}
                >
                  <option value="">Select City</option>
                  {cities.map((ci) => (
                    <option key={ci.id} value={ci.id}>{ci.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.cityId && (
                <p className="text-destructive text-xs font-medium pl-1">{errors.cityId.message}</p>
              )}
            </div>
          </div>

          {/* Default checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="addr-default"
              checked={isDefaultChecked}
              onCheckedChange={(checked) => setValue("isDefault", checked === true)}
            />
            <Label htmlFor="addr-default" className="text-sm font-medium text-foreground cursor-pointer select-none">
              Set as default shipping address
            </Label>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-3 border-t border-border/40">
            <DialogClose className="cursor-pointer" />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand hover:bg-brand-hover text-white font-semibold cursor-pointer px-6 rounded-lg"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
