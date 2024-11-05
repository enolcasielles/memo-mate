import { buildCustomError, CustomError } from "@/core/errors/custom-error";
import { prisma } from "@/core/lib/prisma";
import { stripe } from "@/core/lib/stripe";
import { ActionResponse } from "@/core/responses/action.response";
import { getUserId } from "@/core/utils/get-user-id";

export async function verifySubscription(
  sessionId: string,
): Promise<ActionResponse<void>> {
  try {
    const userId = await getUserId();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verificar que el userId coincida con el metadata
    if (session.metadata?.userId !== userId) {
      throw new CustomError({
        message: "Usuario no autorizado",
        statusCode: 403,
      });
    }

    // Obtener los detalles de la suscripción
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // Actualizar el usuario con el ID de suscripción de Stripe
    await prisma.user.update({
      where: { id: userId },
      data: { stripeSubscriptionId: subscription.id },
    });

    return [null, null];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al verificar la suscripción" }, null];
  }
}
