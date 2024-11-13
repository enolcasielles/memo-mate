"use client";

import { format } from "date-fns";
import { Button } from "@/core/components/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/base/card";
import { useSubscription } from "../contexts/SubscriptionContext";
import { NoActiveSubscription } from "./NoActiveSubscription";
import { Calendar, CreditCard, AlertCircle } from "lucide-react";
import { cn } from "@/core/lib/utils";

export function SubscriptionStatus() {
  const { subscription, manageSubscription, activateSubscription } = useSubscription();

  if (!subscription) {
    return <NoActiveSubscription />
  }

  const isActive = subscription.status === "active";
  const willCancelAtPeriodEnd = subscription.cancelAtPeriodEnd;

  const getStatusInfo = () => {
    if (isActive && willCancelAtPeriodEnd) {
      return {
        icon: AlertCircle,
        title: "Cancelación Programada",
        message: `Tu suscripción se cancelará el ${format(subscription.currentPeriodEnd, "dd/MM/yyyy")}`,
        iconColor: "text-yellow-500",
        bgColor: "bg-yellow-100"
      };
    } else if (isActive) {
      return {
        icon: Calendar,
        title: "Suscripción Activa",
        message: `Próxima renovación: ${format(subscription.currentPeriodEnd, "dd/MM/yyyy")}`,
        iconColor: "text-green-500",
        bgColor: "bg-green-100"
      };
    } else {
      return {
        icon: AlertCircle,
        title: "Suscripción Expirada",
        message: "Tu suscripción ha expirado",
        iconColor: "text-red-500",
        bgColor: "bg-red-100"
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
        <div className={`absolute inset-0 ${statusInfo.bgColor} opacity-10 rounded-full`}></div>
      </div>

      <CardHeader className="space-y-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${statusInfo.bgColor}`}>
            <StatusIcon className={`w-6 h-6 ${statusInfo.iconColor}`} />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{statusInfo.title}</CardTitle>
            <p className="text-gray-600 mt-1">{statusInfo.message}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <CreditCard className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">Plan Premium - 9,99€/mes</span>
        </div>

        <Button
          onClick={isActive ? manageSubscription : activateSubscription}
          variant={isActive ? "outline" : "default"}
          className={cn(
            "w-full py-6 rounded-xl transition-all duration-200",
            isActive 
              ? "hover:bg-gray-100" 
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          )}
        >
          {isActive ? "Gestionar Suscripción" : "Renovar Suscripción"}
        </Button>
      </CardContent>
    </Card>
  );
}
