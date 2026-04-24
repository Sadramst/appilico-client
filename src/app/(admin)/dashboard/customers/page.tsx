"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCustomers } from "@/hooks/use-customers";
import { formatDate, getInitials } from "@/lib/utils";

export default function AdminCustomersPage() {
  const { data, isLoading } = useCustomers({ pageNumber: 1, pageSize: 20 });
  const customers = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Customers" description="Manage your customer base" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Customers will appear here once they register." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-3 font-medium">Customer</th>
                <th className="text-left py-3 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left py-3 font-medium hidden md:table-cell">Orders</th>
                <th className="text-left py-3 font-medium hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-muted/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(`${customer.firstName} ${customer.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.firstName} {customer.lastName}</span>
                    </div>
                  </td>
                  <td className="py-3 hidden sm:table-cell text-muted-foreground">{customer.email}</td>
                  <td className="py-3 hidden md:table-cell">{customer.totalPurchases}</td>
                  <td className="py-3 hidden md:table-cell text-muted-foreground">{formatDate(customer.joinDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
