"use client";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Track Your Order" className="mt-4" />
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your order number to check its current status.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. ORD-20260424-001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <Button asChild disabled={!orderNumber.trim()}>
              <Link href={orderNumber.trim() ? `/orders` : "#"}>
                <Search className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            You can also view all your orders from your{" "}
            <Link href="/orders" className="text-primary hover:underline">
              Orders page
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
