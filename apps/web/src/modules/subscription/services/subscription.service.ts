import prisma from "@memomate/database";
import { Subscription } from "../types/subscription.types";
import { ActionResponse } from "@memomate/core";
import { buildCustomError, CustomError } from "@memomate/core";
import { getUserId } from "@/core/utils/get-user-id";
import { stripe } from "@memomate/core"

export async function getSubscription(): Promise<ActionResponse<Subscription>> {
  try {
    const userId = await getUserId();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user)
      throw new CustomError({
        message: "Usuario no encontrado",
        statusCode: 404,
      });

    const stripeSub = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
    );

    return [
      null,
      {
        id: stripeSub.id,
        status: stripeSub.status,
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    ];
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al recuperar la suscripción" }, null];
  }
}
