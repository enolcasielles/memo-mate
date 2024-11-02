"use client";

import { format } from "date-fns";
import { Button } from "@/core/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/base/card";
import { useSubscription } from "../contexts/SubscriptionContext";

export function SubscriptionStatus() {
  const { subscription, manageSubscription, activateSubscription } =
    useSubscription();

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin suscripción activa</CardTitle>
          <CardDescription>
            Suscríbete para acceder a todas las funcionalidades premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={activateSubscription}>Suscribirse ahora</Button>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === "active";
  const willCancelAtPeriodEnd = subscription.cancelAtPeriodEnd;

  let message = "";
  if (isActive && willCancelAtPeriodEnd) {
    message = `Tu suscripción se cancelará el ${format(
      subscription.currentPeriodEnd,
      "dd/MM/yyyy",
    )}`;
  } else if (isActive) {
    message = `Tu suscripción se renovará el ${format(
      subscription.currentPeriodEnd,
      "dd/MM/yyyy",
    )}`;
  } else {
    message = "Tu suscripción ha expirado";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isActive ? "Suscripción Activa" : "Suscripción Expirada"}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={isActive ? manageSubscription : activateSubscription}
          variant={isActive ? "outline" : "default"}
        >
          {isActive ? "Gestionar Suscripción" : "Renovar Suscripción"}
        </Button>
      </CardContent>
    </Card>
  );
}
