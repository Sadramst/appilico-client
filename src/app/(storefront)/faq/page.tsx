import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Click the 'Sign Up' button in the top right corner and fill in your details. You'll receive a confirmation email to verify your account.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Orders can only be modified while they are in 'Pending' status. Please contact support as soon as possible if you need to make changes.",
  },
  {
    question: "Do you offer gift vouchers?",
    answer:
      "Yes! We offer gift vouchers that can be purchased and redeemed at checkout. Check our offers page for available vouchers.",
  },
  {
    question: "How do loyalty points work?",
    answer:
      "You earn loyalty points with every purchase. Points can be accumulated to unlock higher membership tiers (Bronze, Silver, Gold, Platinum) with exclusive benefits.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. All transactions are encrypted and we never store your full payment details on our servers.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Frequently Asked Questions" className="mt-4" />
      <div className="max-w-3xl mx-auto">
        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
