export interface ICustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  loyaltyPoints: number;
  loyaltyTier: string;
  totalOrders: number;
  totalSpent: number;
  addresses: ICustomerAddress[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface ICustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: AddressType;
  createdAt: string;
}

export type AddressType = "Shipping" | "Billing" | "Both";

export interface ICreateAddressRequest {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: AddressType;
}

export type IUpdateAddressRequest = ICreateAddressRequest;
