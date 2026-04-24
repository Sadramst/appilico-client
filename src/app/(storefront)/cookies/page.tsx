import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Cookie Policy" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit our
          website. They help us provide a better browsing experience.
        </p>
        <h2>Cookies We Use</h2>
        <ul>
          <li><strong>Essential cookies:</strong> Required for site functionality (login, cart)</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
          <li><strong>Preference cookies:</strong> Remember your settings (theme, language)</li>
        </ul>
        <h2>Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings. Disabling
          essential cookies may affect site functionality.
        </p>
      </div>
    </div>
  );
}
