export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  emailConfirmed: boolean;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "Customer" | "Admin" | "SuperAdmin";

export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface ILoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}
