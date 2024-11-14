import { DashboardStats } from "../components/DashboardStats";
import { getDashboardStats } from "../actions/dashboard.action";
import { getUserId } from "@/core/utils/get-user-id";
import Error from "@/core/components/errors/error";

export default async function DashboardPage() {
  const userId = await getUserId();
  const [error, stats] = await getDashboardStats(userId);

  if (error) return <Error message={error.message} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
        Panel de Control
      </h1>
      
      <div className="space-y-8">
        <DashboardStats stats={stats} />
        
        {/* Aquí podemos agregar más secciones en el futuro como:
         - Gráficos de uso
         - Recordatorios próximos
         - Actividad reciente
         */}
      </div>
    </div>
  );
}
