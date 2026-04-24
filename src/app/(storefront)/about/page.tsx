import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="About Us" className="mt-4" />
      <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <p className="text-lg text-muted-foreground">
          Appilico is your premium destination for quality products. We are
          dedicated to providing exceptional shopping experiences with curated
          selections and outstanding customer service.
        </p>
        <h2>Our Mission</h2>
        <p>
          To deliver the finest products directly to your door with unmatched
          quality and convenience. We work closely with trusted suppliers to
          ensure every item meets our high standards.
        </p>
        <h2>Why Choose Appilico?</h2>
        <ul>
          <li>Carefully curated product selection</li>
          <li>Competitive pricing with regular offers</li>
          <li>Fast and reliable delivery</li>
          <li>Dedicated customer support</li>
          <li>Easy returns and refund policy</li>
        </ul>
      </div>
    </div>
  );
}
