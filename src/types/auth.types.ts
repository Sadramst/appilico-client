export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  roles: string[];
}

export type UserRole = "Customer" | "Admin" | "Manager";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: IUser;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
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
  dateOfBirth?: string;
}

export interface IRevokeTokenRequest {
  token: string;
}
