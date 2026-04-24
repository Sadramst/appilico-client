"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllOffers } from "@/hooks/use-offers";
import { formatDate } from "@/lib/utils";
import { OfferTypeLabels } from "@/types/offer.types";

export default function AdminOffersPage() {
  const { data, isLoading } = useAllOffers({ page: 1, pageSize: 20 });
  const offers = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Offers" description="Manage promotional offers">
        <Button className="gap-2"><Plus className="h-4 w-4" />Create Offer</Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : offers.length === 0 ? (
        <EmptyState title="No offers" description="Create promotional offers to attract customers." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="text-left py-3 font-medium">Title</th><th className="text-left py-3 font-medium hidden sm:table-cell">Type</th><th className="text-left py-3 font-medium hidden md:table-cell">Period</th><th className="text-left py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{offer.name}</td>
                  <td className="py-3 hidden sm:table-cell text-muted-foreground">{OfferTypeLabels[offer.offerType] ?? "Unknown"}</td>
                  <td className="py-3 hidden md:table-cell text-muted-foreground">{formatDate(offer.startDate)} — {formatDate(offer.endDate)}</td>
                  <td className="py-3"><Badge variant={offer.isActive ? "default" : "secondary"}>{offer.isActive ? "Active" : "Inactive"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
