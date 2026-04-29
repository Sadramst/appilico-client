"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { formatPrice, formatDate, canDelete } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  basePrice: z.number().min(0, "Price must be positive"),
  costPrice: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0, "Stock must be non-negative"),
  minStockLevel: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useProduct(id);
  const product = data?.data;
  const { data: catData } = useCategories();
  const { data: brandData } = useBrands();
  const categories = catData?.data ?? [];
  const brands = brandData?.data ?? [];
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { user } = useAuthStore();
  const showDelete = canDelete(user?.roles);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    values: product
      ? {
          name: product.name,
          description: product.description,
          barcode: product.barcode ?? "",
          categoryId: product.categoryId,
          brandId: product.brandId,
          basePrice: product.basePrice,
          costPrice: 0,
          stockQuantity: product.stockQuantity,
          minStockLevel: 0,
          weight: 0,
          dimensions: "",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const onSubmit = (values: ProductFormData) => {
    updateProduct.mutate(
      { id, data: values },
      { onSuccess: () => router.push("/dashboard/products") }
    );
  };

  const handleDelete = () => {
    deleteProduct.mutate(id, {
      onSuccess: () => router.push("/dashboard/products"),
    });
  };

  return (
    <div>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <PageHeader title={product.name} description={`SKU: ${product.sku}`}>
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Active" : "Draft"}
        </Badge>
      </PageHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dimensions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10x5x3 cm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" value={field.value} onChange={e => field.onChange(+e.target.value || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" value={field.value} onChange={e => field.onChange(+e.target.value || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stockQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" value={field.value} onChange={e => field.onChange(+e.target.value || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minStockLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Stock Level</FormLabel>
                          <FormControl>
                            <Input type="number" value={field.value} onChange={e => field.onChange(+e.target.value || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" value={field.value} onChange={e => field.onChange(+e.target.value || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="">Select brand</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <Label>Active</Label>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <Label>Featured</Label>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span>{product.averageRating.toFixed(1)} ({product.totalReviews} reviews)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                  {product.images.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Images</span>
                      <span>{product.images.length}</span>
                    </div>
                  )}
                  {product.variants.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Variants</span>
                      <span>{product.variants.length}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Variants */}
              {product.variants.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Variants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{variant.variantName}</p>
                            <p className="text-xs text-muted-foreground">SKU: {variant.sku}</p>
                          </div>
                          <div className="text-right">
                            <p>{formatPrice(variant.price)}</p>
                            <p className="text-xs text-muted-foreground">Stock: {variant.stockQuantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-6">
            {showDelete ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
            ) : <div />}
            <div className="flex gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={updateProduct.isPending}>
                {updateProduct.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
