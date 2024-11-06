"use server";

import { buildCustomError, CustomError } from "@memomate/core";
import { ActionResponse } from "@memomate/core";
import { getUserId } from "@/core/utils/get-user-id";
import { stripe } from "@/core/lib/stripe";

export interface CreateCheckoutSessionResponse {
  url: string;
}

export async function createCheckoutSessionAction(): Promise<
  ActionResponse<CreateCheckoutSessionResponse>
> {
  try {
    const userId = await getUserId();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_URL}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_URL}/dashboard/subscription`,
      metadata: { userId },
    });

    return [null, { url: session.url }];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al crear la sesión de pago" }, null];
  }
}
