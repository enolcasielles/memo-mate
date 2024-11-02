export type SubscriptionStatus = "active" | "expired" | "none";

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  priceId: string;
}

export interface SubscriptionPrice {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
}
