export type PaymentPlanKey = "upfront" | "instalments";

export type PaymentPlan = {
  key: PaymentPlanKey;
  badge: string;
  title: string;
  description: string;
  label: string;
  price: string;
  wasPrice: string;
  total: string;
  amountKobo: number;
};

export type CoursePrice = {
  slug: string;
  name: string;
  duration: string;
  priceNgn: number;
};

export const coursePrices: CoursePrice[] = [
  { slug: "software-engineering", name: "Software Engineering", duration: "6 months", priceNgn: 350000 },
  { slug: "cybersecurity", name: "Cybersecurity", duration: "6 months", priceNgn: 350000 },
];

export function coursePriceBySlug(slug: string): CoursePrice | undefined {
  return coursePrices.find((c) => c.slug === slug);
}

export const paymentPlans: PaymentPlan[] = [
  {
    key: "upfront",
    badge: "The best deal",
    title: "Pay Upfront",
    description:
      "Get the best value when you pay your tuition in one payment. Secure your spot instantly and begin your journey with no further instalments.",
    label: "Upfront payment of",
    price: "₦350,000",
    wasPrice: "₦450,000",
    total: "₦350,000 in total",
    amountKobo: 35_000_000,
  },
  {
    key: "instalments",
    badge: "Pay over time",
    title: "Innovatio Installments",
    description:
      "₦212,500 deposit to confirm your enrollment and pay ₦212,500 at the end of month 2 of the program",
    label: "First installment",
    price: "₦212,500",
    wasPrice: "₦260,000",
    total: "₦425,000 in total",
    amountKobo: 21_250_000,
  },
];

export function formatNaira(amountNgn: number): string {
  return `₦${amountNgn.toLocaleString("en-NG")}`;
}

export function formatNairaKobo(kobo: number): string {
  return formatNaira(kobo / 100);
}
