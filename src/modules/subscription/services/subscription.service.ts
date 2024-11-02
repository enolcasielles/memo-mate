import { prisma } from "@/core/lib/prisma";
import { Subscription } from "../types/subscription.types";
import { ActionResponse } from "@/core/responses/action.response";
import { buildCustomError, CustomError } from "@/core/errors/custom-error";
import { getUserId } from "@/core/utils/get-user-id";

export async function getSubscription(): Promise<ActionResponse<Subscription>> {
  try {
    const userId = await getUserId();

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) return [null, null];

    return [
      null,
      {
        id: subscription.id,
        status: subscription.status as Subscription["status"],
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        priceId: subscription.stripePriceId,
      },
    ];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al recuperar la suscripción" }, null];
  }
}
