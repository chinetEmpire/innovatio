export type PaymentPlan = {
  badge: string;
  title: string;
  description: string;
  label: string;
  price: string;
  wasPrice: string;
  total: string;
};

export const paymentPlans: PaymentPlan[] = [
  {
    badge: "The best deal",
    title: "Pay Upfront",
    description: "Get the best value when you pay your tuition in one payment. Secure your spot instantly and begin your journey with no further instalments.",
    label: "Upfront payment of",
    price: "₦350,000",
    wasPrice: "₦450,000",
    total: "₦350,000 in total",
  },
  {
    badge: "Pay over time",
    title: "Innovatio Installments",
    description: "₦212,500 deposit to confirm your enrollment and pay ₦212,500 at the end of month 2 of the program",
    label: "First installment",
    price: "₦212,500",
    wasPrice: "₦260,000",
    total: "₦425,000 in total",
  },
];
