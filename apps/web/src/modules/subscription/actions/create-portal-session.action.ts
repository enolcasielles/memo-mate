"use server";

import { buildCustomError, CustomError } from "@memomate/core";
import prisma from "@memomate/database";
import { ActionResponse } from "@memomate/core";
import { getUserId } from "@/core/utils/get-user-id";
import { stripe } from "@/core/lib/stripe";

export interface CreatePortalSessionResponse {
  url: string;
}

export async function createPortalSessionAction(): Promise<
  ActionResponse<CreatePortalSessionResponse>
> {
  try {
    const userId = await getUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeSubscriptionId: true },
    });

    if (!user?.stripeSubscriptionId) {
      throw new CustomError({
        message: "No se encontró una suscripción",
        statusCode: 404,
      });
    }

    const subscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
    );

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer.toString(),
      return_url: `${process.env.WEB_URL}/dashboard/subscription`,
    });

    return [null, { url: session.url }];
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al crear la sesión del portal" }, null];
  }
}
