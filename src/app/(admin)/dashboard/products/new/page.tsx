"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  basePrice: z.number().min(0, "Price must be positive"),
  costPrice: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0, "Stock must be non-negative"),
  minStockLevel: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  isFeatured: z.boolean(),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

export default function AdminNewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: catData } = useCategories();
  const { data: brandData } = useBrands();
  const categories = catData?.data ?? [];
  const brands = brandData?.data ?? [];

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      barcode: "",
      categoryId: "",
      brandId: "",
      basePrice: 0,
      costPrice: 0,
      stockQuantity: 0,
      minStockLevel: 5,
      weight: 0,
      dimensions: "",
      isFeatured: false,
    },
  });

  const onSubmit = (values: CreateProductFormData) => {
    createProduct.mutate(values, {
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

      <PageHeader title="New Product" description="Add a new product to your catalog" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
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
                          <Input placeholder="Product name" {...field} />
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
                          <Textarea rows={4} placeholder="Product description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. PRD-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional" {...field} />
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
                  <div className="grid grid-cols-2 gap-4">
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
            </div>

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
                  <CardTitle>Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <Label>Featured Product</Label>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-6">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
