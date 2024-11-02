import Stripe from "stripe";
export interface Subscription {
  id: string;
  status: Stripe.Subscription.Status;
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
