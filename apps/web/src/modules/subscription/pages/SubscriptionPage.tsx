import Error from "@/core/components/errors/error";
import { SubscriptionStatus } from "../components/SubscriptionStatus";
import SubscriptionProvider from "../contexts/SubscriptionContext";
import { getSubscription } from "../services/subscription.service";
import { Sparkles } from "lucide-react";

export default async function SubscriptionPage() {
  const [error, subscription] = await getSubscription();

  if (error) return <Error message={error.message} />;

  return (
    <SubscriptionProvider subscription={subscription}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            Gestión de Suscripción
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Administra tu plan Premium y mantén el control de tu suscripción en todo momento
          </p>
        </div>

        {/* Content Section */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent rounded-3xl -z-10" />
          
          {/* Main content */}
          <div className="relative z-10">
            <SubscriptionStatus />
          </div>
        </div>

        {/* Optional: Additional Info Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            ¿Necesitas ayuda? Contacta con nuestro{" "}
            <a href="/support" className="text-blue-500 hover:text-blue-600 underline">
              equipo de soporte
            </a>
          </p>
        </div>
      </div>
    </SubscriptionProvider>
  );
}
