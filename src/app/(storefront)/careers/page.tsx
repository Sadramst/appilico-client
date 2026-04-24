import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Careers" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <p className="text-lg text-muted-foreground">
          Join our growing team at Appilico. We&apos;re always looking for
          passionate individuals who share our commitment to quality and
          customer excellence.
        </p>
        <h2>Current Openings</h2>
        <p className="text-muted-foreground">
          There are no open positions at the moment. Please check back later or
          send your CV to <strong>careers@appilico.com</strong>.
        </p>
      </div>
    </div>
  );
}
