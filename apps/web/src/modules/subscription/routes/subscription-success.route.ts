import { apiError } from "@memomate/core";
import { CustomError } from "@memomate/core";
import { verifySubscription } from "@/modules/subscription/services/verify-subscription.service";
import { NextResponse } from "next/server";

export default async function SubscriptionSuccessRoute(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return NextResponse.redirect("/dashboard/subscription");

    await verifySubscription(sessionId);

    return NextResponse.redirect(
      new URL("/dashboard/subscription", request.url),
    );
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
