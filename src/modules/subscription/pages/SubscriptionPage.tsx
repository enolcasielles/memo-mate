import { SubscriptionStatus } from "../components/SubscriptionStatus";
import SubscriptionProvider from "../contexts/SubscriptionContext";
import Error500 from "@/core/components/errors/error500";
import { getSubscription } from "../services/subscription.service";
import { verifySubscription } from "../services/verify-subscription.service";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  // Si hay un session_id, verificar y crear la suscripción
  if (searchParams.session_id) {
    const [error] = await verifySubscription(searchParams.session_id);
    if (error) return <Error500 message={error.message} />;
  }

  const [error, subscription] = await getSubscription();

  if (error) return <Error500 message={error.message} />;

  return (
    <SubscriptionProvider subscription={subscription}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de Suscripción</h1>
        <div className="max-w-2xl mx-auto">
          <SubscriptionStatus />
        </div>
      </div>
    </SubscriptionProvider>
  );
}
