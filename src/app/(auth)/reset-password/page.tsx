"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, KeyRound } from "lucide-react";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPasswordSchema } from "@/lib/validators";
import { authService } from "@/services/auth-service";

type ResetFormData = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!email || !token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        token,
        newPassword: data.newPassword,
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mx-auto">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Password Reset!</h2>
            <p className="text-sm text-slate-400">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 mx-auto mb-3">
            <KeyRound className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-sm text-slate-400 mt-1">Enter your new password below</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="bg-slate-800/50 border-slate-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="bg-slate-800/50 border-slate-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-slate-400 mt-4">
            Remember your password?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
