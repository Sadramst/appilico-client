import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Shipping & Returns" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <h2>Shipping</h2>
        <ul>
          <li>Standard delivery: 3–5 business days</li>
          <li>Express delivery: 1–2 business days</li>
          <li>Free shipping on orders over $100</li>
        </ul>
        <h2>Returns</h2>
        <ul>
          <li>Returns accepted within 30 days of delivery</li>
          <li>Items must be unused and in original packaging</li>
          <li>Refunds processed within 5–7 business days</li>
        </ul>
        <p>
          For return requests, please contact us at{" "}
          <strong>hello@appilico.store</strong>.
        </p>
      </div>
    </div>
  );
}
