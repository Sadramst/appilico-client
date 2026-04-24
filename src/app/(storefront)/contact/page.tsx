import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Contact Us" className="mt-4" />
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-muted-foreground">
          Have a question or need help? We&apos;d love to hear from you.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <Mail className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">hello@appilico.com</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <Phone className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Address</h3>
              <p className="text-sm text-muted-foreground">123 Commerce St, NY 10001</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
