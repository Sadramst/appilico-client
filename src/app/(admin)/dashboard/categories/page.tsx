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
import { useCategories } from "@/hooks/use-categories";
import { categoryService } from "@/services/category-service";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { canDelete } from "@/lib/utils";
import type { ICategory, ICreateCategoryRequest } from "@/types/category.types";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const categories = data?.data ?? [];
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const showDelete = canDelete(user?.roles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<ICategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<ICreateCategoryRequest>({
    defaultValues: { name: "", description: "", sortOrder: 0 },
  });

  const openCreate = () => {
    setEditingCategory(null);
    form.reset({ name: "", description: "", sortOrder: 0 });
    setDialogOpen(true);
  };

  const openEdit = (cat: ICategory) => {
    setEditingCategory(cat);
    form.reset({ name: cat.name, description: cat.description, sortOrder: cat.sortOrder });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ICreateCategoryRequest) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, values);
        toast.success("Category updated");
      } else {
        await categoryService.create(values);
        toast.success("Category created");
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDialogOpen(false);
    } catch {
      toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    setDeleting(true);
    try {
      await categoryService.delete(deleteCategory.id);
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteCategory(null);
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Categories" description="Organize your product catalog">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories" description="Add categories to organize products." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-3 font-medium">Name</th>
                <th className="text-left py-3 font-medium">Products</th>
                <th className="text-left py-3 font-medium">Status</th>
                <th className="text-right py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{cat.name}</td>
                  <td className="py-3 text-muted-foreground">{cat.productCount ?? 0}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${cat.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {showDelete && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteCategory(cat)}>
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
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category details." : "Add a new category to organize your products."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name", { required: true })} placeholder="Category name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register("description")} placeholder="Optional description" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" {...form.register("sortOrder", { valueAsNumber: true })} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteCategory?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
