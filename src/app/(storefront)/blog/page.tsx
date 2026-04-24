import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Blog" className="mt-4" />
      <div className="max-w-3xl mx-auto">
        <p className="text-muted-foreground">
          Stay tuned — our blog is coming soon! We&apos;ll be sharing recipes,
          tips, product spotlights, and more.
        </p>
      </div>
    </div>
  );
}
