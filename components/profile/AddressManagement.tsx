"use client";

import { useState, useEffect } from "react";
import { AddressResponseData, AddressResponse } from "@/types/address.type";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddAddressDialog } from "./AddAddressDialog";
import { EditAddressDialog } from "./EditAddressDialog";
import { MapPin, Plus, Trash2, Home, Star, Loader2, Pencil } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import { axiosInstance } from "@/config/axios";
import { ENDPOINTS } from "@/constants/endpoints";

export const AddressManagement = () => {
  const [addresses, setAddresses] = useState<AddressResponseData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<AddressResponse>(ENDPOINTS.USER_ADDRESSES);
      setAddresses(response.data?.data || []);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Failed to load addresses.");
      showError("Load failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAddresses();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSetDefault = async (addr: AddressResponseData) => {
    try {
      await axiosInstance.put(`${ENDPOINTS.USER_ADDRESSES}/${addr.id}`, {
        addressType: addr.addressType,
        fullName: addr.fullName,
        phoneNumber: addr.phoneNumber,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || "",
        countryId: addr.countryId,
        stateId: addr.stateId,
        cityId: addr.cityId,
        postalCode: addr.postalCode,
        isDefault: true,
      });
      showSuccess("Success", "Default address updated.");
      fetchAddresses();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Failed to set default address.");
      showError("Update failed", errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`${ENDPOINTS.USER_ADDRESSES}/${id}`);
      showSuccess("Removed", "Address has been removed successfully.");
      fetchAddresses();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Failed to delete address.");
      showError("Delete failed", errorMessage);
    }
  };

  return (
    <div className="flex-1 bg-card border border-border/60 rounded-xl p-6 shadow-xs flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Address Book</h2>
          <p className="text-sm text-muted-foreground">Manage your shipping and billing addresses.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg py-2 px-4 text-sm font-semibold flex items-center gap-2 cursor-pointer bg-brand hover:bg-brand-hover text-white"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/60 rounded-xl bg-muted/20 text-center gap-2">
          <MapPin className="w-8 h-8 text-muted-foreground/60" />
          <p className="text-sm font-medium text-foreground">No saved addresses</p>
          <p className="text-xs text-muted-foreground">Please add a shipping address for faster checkouts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className={`relative overflow-hidden border transition-all ${
              addr.isDefault ? "border-brand bg-brand/5 shadow-xs" : "border-border/60"
            }`}>
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                <div className="flex flex-col gap-1 pr-8">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-brand shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{addr.addressType} ({addr.fullName})</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-brand text-brand-foreground px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 font-medium leading-relaxed pt-2">
                    {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{addr.cityName}, {addr.stateName} {addr.postalCode}</p>
                  <p className="text-xs text-muted-foreground">{addr.countryName}</p>
                  <p className="text-xs text-muted-foreground pt-1">Phone: {addr.phoneNumber}</p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/40">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-xs font-semibold text-brand hover:underline cursor-pointer"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">Default Address</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingAddress(addr)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(addr.id)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Address Dialog Modal */}
      <AddAddressDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchAddresses}
      />

      {/* Edit Address Dialog Modal */}
      {editingAddress && (
        <EditAddressDialog
          open={!!editingAddress}
          onOpenChange={(open) => { if (!open) setEditingAddress(null); }}
          onSuccess={fetchAddresses}
          address={editingAddress}
        />
      )}
    </div>
  );
};
