import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@memomate/database";
import { stripe } from "@/core/lib/stripe";
import { apiError, DEFAULT_CREDITS } from "@memomate/core";
import { CustomError } from "@memomate/core";
import { addMonths } from "date-fns";

export default async function StripeWebhookRoute(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "customer.subscription.deleted" || 
        event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      
      if (subscription.status !== "active") {
        await prisma.user.updateMany({
          where: {
            stripeSubscriptionId: subscription.id as string,
          },
          data: {
            stripeSubscriptionId: null,
            renewAt: addMonths(new Date(), 1),
            credits: DEFAULT_CREDITS,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) return apiError(error);
    return apiError(
      new CustomError({
        message: "Error interno del servidor",
        statusCode: 500,
      }),
    );
  }
} 