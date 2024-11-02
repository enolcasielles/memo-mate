"use server";

import { prisma } from "@/core/lib/prisma";
import { ActionResponse } from "@/core/responses/action.response";
import { buildCustomError, CustomError } from "@/core/errors/custom-error";
import { getUserId } from "@/core/utils/get-user-id";
import { stripe } from "@/core/lib/stripe";

export interface CreateCheckoutSessionResponse {
  url: string;
}

export interface CreatePortalSessionResponse {
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
      success_url: `${process.env.WEB_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.WEB_URL}/dashboard/subscription?canceled=true`,
      metadata: { userId },
    });

    return [null, { url: session.url }];
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al crear la sesión de pago" }, null];
  }
}

export async function createPortalSessionAction(): Promise<
  ActionResponse<CreatePortalSessionResponse>
> {
  try {
    const userId = await getUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user.subscription?.stripeCustomerId) {
      throw new CustomError({
        message: "No se encontró una suscripción",
        statusCode: 404,
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
    });

    return [null, { url: session.url }];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al crear la sesión del portal" }, null];
  }
}
