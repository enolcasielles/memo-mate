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
  const { subscription, handleManageSubscription, handleSubscribe } =
    useSubscription();

  if (!subscription || subscription.status === "none") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin suscripción activa</CardTitle>
          <CardDescription>
            Suscríbete para acceder a todas las funcionalidades premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSubscribe}>Suscribirse ahora</Button>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === "active";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isActive ? "Suscripción Activa" : "Suscripción Expirada"}
        </CardTitle>
        <CardDescription>
          {isActive
            ? `Tu suscripción se renovará el ${format(
                subscription.currentPeriodEnd,
                "dd/MM/yyyy",
              )}`
            : "Tu suscripción ha expirada"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleManageSubscription}
          variant={isActive ? "outline" : "default"}
        >
          {isActive ? "Gestionar Suscripción" : "Renovar Suscripción"}
        </Button>
      </CardContent>
    </Card>
  );
}
