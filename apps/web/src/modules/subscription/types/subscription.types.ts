import { StripeSubscriptionStatus } from "@/core/lib/stripe";

export interface Subscription {
  id: string;
  status: StripeSubscriptionStatus
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionPrice {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
}
