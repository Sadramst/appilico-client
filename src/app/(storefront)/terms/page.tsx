import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Terms of Service" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using Appilico, you agree to be bound by these terms
          of service. If you do not agree, please do not use our service.
        </p>
        <h2>User Accounts</h2>
        <p>
          You are responsible for maintaining the security of your account
          credentials. You must provide accurate information during registration.
        </p>
        <h2>Orders & Payments</h2>
        <p>
          All prices are displayed in the local currency. We reserve the right to
          cancel orders in case of pricing errors or stock unavailability.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          Appilico is not liable for indirect, incidental, or consequential
          damages arising from the use of our services.
        </p>
      </div>
    </div>
  );
}
