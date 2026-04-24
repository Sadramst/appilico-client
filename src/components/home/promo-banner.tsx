"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { useActiveOffers } from "@/hooks/use-offers";

export function PromoBanner() {
  const { data, isLoading } = useActiveOffers();
  const offers = data?.data?.slice(0, 2) ?? [];

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </section>
    );
  }

  if (offers.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-6">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-950 text-white">
              <CardContent className="p-8 flex flex-col justify-between min-h-[250px]">
                <div>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Limited Time
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-white/80 text-sm">{offer.description}</p>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <CountdownTimer
                    endDate={offer.endDate}
                    className="text-white"
                  />
                  <Button
                    asChild
                    variant="secondary"
                    className="shrink-0"
                  >
                    <Link href={`/offers/${offer.id}`}>
                      Shop Now <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
