import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Accessibility" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <p>
          At Appilico, we are committed to making our website accessible to
          everyone. We continually work to improve the user experience for all
          visitors.
        </p>
        <h2>Our Commitment</h2>
        <ul>
          <li>Keyboard navigable interface</li>
          <li>Sufficient color contrast ratios</li>
          <li>Descriptive alt text for images</li>
          <li>Screen reader friendly markup</li>
          <li>Responsive design for all devices</li>
        </ul>
        <h2>Feedback</h2>
        <p>
          If you encounter any accessibility issues, please contact us at{" "}
          <strong>accessibility@appilico.com</strong> and we will address them
          promptly.
        </p>
      </div>
    </div>
  );
}
