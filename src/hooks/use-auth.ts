"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import type { ILoginRequest, IRegisterRequest, IUpdateProfileRequest } from "@/types/auth.types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout, updateUser } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: ILoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const { user: userData, accessToken, refreshToken } = response.data;
      storeLogin(userData, accessToken, refreshToken);
      toast.success(`Welcome back, ${userData.firstName}!`);
      if (userData.roles?.includes("Admin") || userData.roles?.includes("SuperAdmin")) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: IRegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      const { user: userData, accessToken, refreshToken } = response.data;
      storeLogin(userData, accessToken, refreshToken);
      toast.success("Account created successfully!");
      router.push("/");
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: IUpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const logout = () => {
    storeLogout();
    queryClient.clear();
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return {
    user,
    isAuthenticated,
    profile: profileQuery.data?.data,
    isLoadingProfile: profileQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    logout,
  };
}
