"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "@/validators/addressSchema.validation";
import { AddressRequest, AddressResponseData, DropdownItem, DropdownResponse } from "@/types/address.type";
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
} from "@/components/ui/dialog";
import { MapPin, Home, Tag, Phone, User, Landmark, Loader2, ChevronDown, X } from "lucide-react";
import { axiosInstance } from "@/config/axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { showSuccess, showError } from "@/lib/toast";

interface EditAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  address: AddressResponseData;
}

export const EditAddressDialog = ({ open, onOpenChange, onSuccess, address }: EditAddressDialogProps) => {
  const [countries, setCountries] = useState<DropdownItem[]>([]);
  const [states, setStates] = useState<DropdownItem[]>([]);
  const [cities, setCities] = useState<DropdownItem[]>([]);
  const [dropdownsReady, setDropdownsReady] = useState(false);
  const loadingRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressRequest>({
    resolver: zodResolver(addressSchema),
  });

  const isDefaultChecked = watch("isDefault");

  // Load all dropdown data and set form on open
  useEffect(() => {
    if (!open || loadingRef.current) return;
    loadingRef.current = true;
    setDropdownsReady(false);

    // Reset text fields immediately
    reset({
      addressType: address.addressType,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      countryId: "",
      stateId: "",
      cityId: "",
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });

    const loadDropdowns = async () => {
      try {
        const [countriesRes, statesRes, citiesRes] = await Promise.all([
          axiosInstance.get<DropdownResponse>(ENDPOINTS.COUNTRIES),
          axiosInstance.get<DropdownResponse>(ENDPOINTS.STATES, { params: { countryId: address.countryId } }),
          axiosInstance.get<DropdownResponse>(ENDPOINTS.CITIES, { params: { stateId: address.stateId } }),
        ]);
        setCountries(countriesRes.data?.data || []);
        setStates(statesRes.data?.data || []);
        setCities(citiesRes.data?.data || []);
        setDropdownsReady(true);
      } catch (err) {
        console.error(err);
      } finally {
        loadingRef.current = false;
      }
    };
    loadDropdowns();
  }, [open, address, reset]);

  // Set dropdown values AFTER options have rendered
  useEffect(() => {
    if (!dropdownsReady) return;
    setValue("countryId", address.countryId);
    setValue("stateId", address.stateId);
    setValue("cityId", address.cityId);
  }, [dropdownsReady, address, setValue]);

  // Reset loading state when dialog closes
  useEffect(() => {
    if (!open) {
      loadingRef.current = false;
      setDropdownsReady(false);
    }
  }, [open]);

  // Manual cascade handlers (no useEffect-based cascade)
  const handleCountryChange = async (countryId: string) => {
    setValue("countryId", countryId);
    setValue("stateId", "");
    setValue("cityId", "");
    setCities([]);
    if (!countryId) { setStates([]); return; }
    try {
      const res = await axiosInstance.get<DropdownResponse>(ENDPOINTS.STATES, { params: { countryId } });
      setStates(res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  const handleStateChange = async (stateId: string) => {
    setValue("stateId", stateId);
    setValue("cityId", "");
    if (!stateId) { setCities([]); return; }
    try {
      const res = await axiosInstance.get<DropdownResponse>(ENDPOINTS.CITIES, { params: { stateId } });
      setCities(res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  const onSubmit = async (data: AddressRequest) => {
    try {
      const response = await axiosInstance.put(`${ENDPOINTS.USER_ADDRESSES}/${address.id}`, data);
      showSuccess("Address Updated", response.data.message || "Address updated successfully.");
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to update address.";
      showError("Update failed", msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Address</DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput id="edit-type" label="Address Type" icon={Tag} placeholder="e.g. Home, Work" error={errors.addressType} {...register("addressType")} />
            <CustomInput id="edit-name" label="Full Name" icon={User} placeholder="Aadil M Patel" error={errors.fullName} {...register("fullName")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput id="edit-phone" label="Phone Number" icon={Phone} placeholder="9106624120" error={errors.phoneNumber} {...register("phoneNumber")} />
            <CustomInput id="edit-zip" label="Zip / Postal Code" icon={MapPin} placeholder="90210" error={errors.postalCode} {...register("postalCode")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput id="edit-line1" label="Address Line 1" icon={Home} placeholder="742 Evergreen Terrace" error={errors.addressLine1} {...register("addressLine1")} />
            <CustomInput id="edit-line2" label="Address Line 2 (Optional)" icon={Home} placeholder="Apt 4B" error={errors.addressLine2} {...register("addressLine2")} />
          </div>

          {/* Country / State / City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 group/field">
              <Label htmlFor="edit-country" className="text-sm font-medium">Country</Label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-brand transition-colors duration-200" />
                <select
                  id="edit-country"
                  className="pl-10 pr-10 h-10 w-full rounded-xl bg-background/50 border border-border/80 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30 focus-visible:outline-none transition-all duration-200 outline-none appearance-none cursor-pointer text-foreground"
                  {...register("countryId", { onChange: (e) => handleCountryChange(e.target.value) })}
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.countryId && <p className="text-destructive text-xs font-medium pl-1">{errors.countryId.message}</p>}
            </div>
            <div className="space-y-2 group/field">
              <Label htmlFor="edit-state" className="text-sm font-medium">State</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-brand transition-colors duration-200" />
                <select
                  id="edit-state"
                  className="pl-10 pr-10 h-10 w-full rounded-xl bg-background/50 border border-border/80 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30 focus-visible:outline-none transition-all duration-200 outline-none appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={states.length === 0}
                  {...register("stateId", { onChange: (e) => handleStateChange(e.target.value) })}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.stateId && <p className="text-destructive text-xs font-medium pl-1">{errors.stateId.message}</p>}
            </div>
            <div className="space-y-2 group/field">
              <Label htmlFor="edit-city" className="text-sm font-medium">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-brand transition-colors duration-200" />
                <select
                  id="edit-city"
                  className="pl-10 pr-10 h-10 w-full rounded-xl bg-background/50 border border-border/80 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30 focus-visible:outline-none transition-all duration-200 outline-none appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={cities.length === 0}
                  {...register("cityId")}
                >
                  <option value="">Select City</option>
                  {cities.map((ci) => (<option key={ci.id} value={ci.id}>{ci.name}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.cityId && <p className="text-destructive text-xs font-medium pl-1">{errors.cityId.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="edit-default" checked={isDefaultChecked} onCheckedChange={(checked) => setValue("isDefault", checked === true)} />
            <Label htmlFor="edit-default" className="text-sm font-medium text-foreground cursor-pointer select-none">Set as default shipping address</Label>
          </div>

          <DialogFooter className="pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand hover:bg-brand-hover text-white font-semibold cursor-pointer px-6 rounded-lg">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
