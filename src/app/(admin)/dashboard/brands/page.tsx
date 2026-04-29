"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useBrands } from "@/hooks/use-brands";
import { brandService } from "@/services/brand-service";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { canDelete } from "@/lib/utils";
import type { IBrand, ICreateBrandRequest } from "@/types/brand.types";

export default function AdminBrandsPage() {
  const { data, isLoading } = useBrands();
  const brands = data?.data ?? [];
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const showDelete = canDelete(user?.roles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<IBrand | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<ICreateBrandRequest>({
    defaultValues: { name: "", description: "", logoUrl: "" },
  });

  const openCreate = () => {
    setEditingBrand(null);
    form.reset({ name: "", description: "", logoUrl: "" });
    setDialogOpen(true);
  };

  const openEdit = (brand: IBrand) => {
    setEditingBrand(brand);
    form.reset({ name: brand.name, description: brand.description ?? "", logoUrl: brand.logoUrl ?? "" });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ICreateBrandRequest) => {
    setSaving(true);
    try {
      if (editingBrand) {
        await brandService.update(editingBrand.id, { ...values, isActive: editingBrand.isActive });
        toast.success("Brand updated");
      } else {
        await brandService.create(values);
        toast.success("Brand created");
      }
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setDialogOpen(false);
    } catch {
      toast.error(editingBrand ? "Failed to update brand" : "Failed to create brand");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBrand) return;
    setDeleting(true);
    try {
      await brandService.delete(deleteBrand.id);
      toast.success("Brand deleted");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setDeleteBrand(null);
    } catch {
      toast.error("Failed to delete brand");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Brands" description="Manage product brands">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : brands.length === 0 ? (
        <EmptyState title="No brands" description="Add brands to categorize products." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-3 font-medium">Name</th>
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-left py-3 font-medium">Status</th>
                <th className="text-right py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{brand.name}</td>
                  <td className="py-3 text-muted-foreground text-xs max-w-xs truncate">{brand.description ?? "—"}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${brand.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(brand)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {showDelete && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteBrand(brand)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "New Brand"}</DialogTitle>
            <DialogDescription>
              {editingBrand ? "Update brand details." : "Add a new brand."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name", { required: true })} placeholder="Brand name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register("description")} placeholder="Optional description" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input {...form.register("logoUrl")} placeholder="https://..." />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingBrand ? "Save Changes" : "Create Brand"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteBrand}
        onOpenChange={(open) => !open && setDeleteBrand(null)}
        title="Delete Brand"
        description={`Are you sure you want to delete "${deleteBrand?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
