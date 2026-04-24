import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const helpTopics = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, add items to your cart, then proceed to checkout. You will need to create an account or sign in to complete your purchase.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Credit Card, Debit Card, PayPal, Bank Transfer, and Cash on Delivery.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing your order, you can track its status from your Orders page in your account.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery. Items must be unused and in their original packaging. Contact our support team to initiate a return.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us via email at hello@appilico.com or call us at +1 (555) 123-4567 during business hours.",
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Help Center" className="mt-4" />
      <div className="max-w-3xl mx-auto">
        <Accordion className="w-full">
          {helpTopics.map((topic, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{topic.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {topic.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
