"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { AccountSidebar } from "@/components/layout/sidebar";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useMyAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/use-customers";
import { AddressTypeLabels, type ICustomerAddress } from "@/types/customer.types";

type AddressFormData = Omit<ICustomerAddress, "id">;

const emptyForm: AddressFormData = {
  title: "",
  addressLine1: "",
  addressLine2: null,
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
  addressType: 0,
};

export default function AddressesPage() {
  const { data, isLoading } = useMyAddresses();
  const addresses = data?.data ?? [];
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (addr: ICustomerAddress) => {
    setEditingId(addr.id);
    setForm({
      title: addr.title,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault,
      addressType: addr.addressType,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress.mutate(
        { id: editingId, data: form },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createAddress.mutate(form, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    deleteAddress.mutate(id, { onSuccess: () => setDeleteConfirm(null) });
  };

  const isSaving = createAddress.isPending || updateAddress.isPending;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="My Addresses" className="mt-4">
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />

        <div className="flex-1">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <EmptyState
              variant="default"
              title="No addresses yet"
              description="Add a shipping or billing address to get started."
              actionLabel="Add Address"
              onAction={openAdd}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <Card key={addr.id} className="relative">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{addr.title}</span>
                        {addr.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {AddressTypeLabels[addr.addressType] ?? "Address"}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(addr)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(addr.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {addr.addressLine1}
                      {addr.addressLine2 && <>, {addr.addressLine2}</>}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Home, Office"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  placeholder="Street address"
                  value={form.addressLine1}
                  onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  placeholder="Apartment, suite, etc."
                  value={form.addressLine2 ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, addressLine2: e.target.value || null })
                  }
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="addressType">Type</Label>
                <Select
                  value={String(form.addressType)}
                  onValueChange={(v) => setForm({ ...form, addressType: Number(v) })}
                >
                  <SelectTrigger id="addressType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Shipping</SelectItem>
                    <SelectItem value="1">Billing</SelectItem>
                    <SelectItem value="2">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isDefault"
                  checked={form.isDefault}
                  onCheckedChange={(checked) => setForm({ ...form, isDefault: checked })}
                />
                <Label htmlFor="isDefault">Default address</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Add Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteAddress.isPending}
              className="gap-2"
            >
              {deleteAddress.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
