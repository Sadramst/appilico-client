import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Size Guide" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <p className="text-muted-foreground">
          Product sizes and weight measurements are listed on each product page.
          If you need help choosing the right size, please contact our support
          team.
        </p>
      </div>
    </div>
  );
}
