import { Users, Bell, MessageCircle, CreditCard } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { DashboardStats as DashboardStatsType } from "../actions/dashboard.action";

interface Props {
  stats: DashboardStatsType;
}

export function DashboardStats({ stats }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Contactos"
        value={stats.totalContacts}
        icon={Users}
        description="Contactos registrados"
        actionUrl="/dashboard/contacts"
        actionText="Ver contactos"
      />
      <StatsCard
        title="Créditos"
        value={stats.hasActiveSubscription ? "Ilimitados" : stats.credits}
        icon={CreditCard}
        description={stats.hasActiveSubscription ? "Suscripción activa" : "Sin suscripción"}
        actionUrl="/dashboard/subscription"
        actionText="Gestionar suscripción"
      />
      <StatsCard
        title="Recordatorios Activos"
        value={stats.activeReminders}
        icon={Bell}
        description={`De un total de ${stats.totalReminders} recordatorios`}
      />
      <StatsCard
        title="Mensajes"
        value={stats.messageCount}
        icon={MessageCircle}
        description="Interacciones totales"
      />
    </div>
  );
} 