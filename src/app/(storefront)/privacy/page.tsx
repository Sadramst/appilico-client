import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Privacy Policy" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly, such as your name, email,
          shipping address, and payment information when you make a purchase.
        </p>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Improve our products and services</li>
          <li>Communicate promotional offers (with your consent)</li>
        </ul>
        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your
          personal information. All data is encrypted in transit and at rest.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy-related inquiries, email us at{" "}
          <strong>privacy@appilico.com</strong>.
        </p>
      </div>
    </div>
  );
}
