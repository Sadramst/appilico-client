import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phoneNumber: z.string().optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  phone: z.string().min(1, "Phone is required").max(20),
  addressLine1: z.string().min(1, "Address is required").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(100),
  isDefault: z.boolean(),
  type: z.enum(["Shipping", "Billing", "Both"]),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  title: z.string().min(1, "Title is required").max(100),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required").max(500),
  sku: z.string().min(1, "SKU is required").max(50),
  price: z.number().min(0.01, "Price must be greater than 0"),
  compareAtPrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  tags: z.array(z.string()),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().optional(),
  iconName: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  description: z.string().max(500).optional(),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
});

export const voucherSchema = z.object({
  code: z.string().min(1, "Code is required").max(50),
  description: z.string().min(1, "Description is required").max(500),
  discountType: z.enum(["Percentage", "FixedAmount"]),
  discountValue: z.number().min(0.01, "Discount value must be greater than 0"),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  usageLimitPerUser: z.number().int().min(1).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean(),
});

export const discountSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  discountType: z.enum(["Percentage", "FixedAmount"]),
  discountValue: z.number().min(0.01),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscountAmount: z.number().min(0).optional(),
  applicableTo: z.enum(["AllProducts", "SpecificProducts", "SpecificCategories", "SpecificBrands"]),
  applicableIds: z.array(z.string()),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean(),
});

export const offerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  discountType: z.enum(["Percentage", "FixedAmount"]),
  discountValue: z.number().min(0.01),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean(),
  productIds: z.array(z.string()).min(1, "Select at least one product"),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  type: z.enum(["StockIn", "StockOut", "Adjustment", "Return", "Damaged"]),
  reason: z.string().optional(),
});

export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1, "Value is required"),
});

export type TLoginFormData = z.infer<typeof loginSchema>;
export type TRegisterFormData = z.infer<typeof registerSchema>;
export type TForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type TResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type TProfileFormData = z.infer<typeof profileSchema>;
export type TAddressFormData = z.infer<typeof addressSchema>;
export type TReviewFormData = z.infer<typeof reviewSchema>;
export type TProductFormData = z.infer<typeof productSchema>;
export type TCategoryFormData = z.infer<typeof categorySchema>;
export type TBrandFormData = z.infer<typeof brandSchema>;
export type TVoucherFormData = z.infer<typeof voucherSchema>;
export type TDiscountFormData = z.infer<typeof discountSchema>;
export type TOfferFormData = z.infer<typeof offerSchema>;
export type TStockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;
export type TSettingFormData = z.infer<typeof settingSchema>;
