export interface ICustomer {
  id: string;
  userId: string;
  customerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  loyaltyPoints: number;
  membershipTier: number;
  totalPurchases: number;
  joinDate: string;
  addresses: ICustomerAddress[];
}

export const MembershipTierLabels: Record<number, string> = {
  0: "Bronze",
  1: "Silver",
  2: "Gold",
  3: "Platinum",
};

export interface ICustomerAddress {
  id: string;
  title: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: number;
}

export const AddressTypeLabels: Record<number, string> = {
  0: "Shipping",
  1: "Billing",
  2: "Both",
};

export interface IUpdateCustomerRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  membershipTier?: number;
}

export interface ICustomerLoyalty {
  customerId: string;
  loyaltyPoints: number;
  membershipTier: number;
  totalPurchases: number;
}
