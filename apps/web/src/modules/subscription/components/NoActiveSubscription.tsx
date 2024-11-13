import { Button } from "@/core/components/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/base/card";
import { useSubscription } from "../contexts/SubscriptionContext";
import { Check } from "lucide-react";

export function NoActiveSubscription() {   
  const { activateSubscription } = useSubscription(); 

  return (
    <Card className="overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
        <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-full"></div>
      </div>
      
      <CardHeader className="space-y-4">
        <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          MemoMate Premium
        </CardTitle>
        <div className="space-y-2">
          <p className="text-2xl font-bold">9,99€<span className="text-base font-normal text-gray-600">/mes</span></p>
          <p className="text-gray-600">Mejora tu experiencia con todas las funcionalidades premium</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <ul className="space-y-4">
          {[
            "Almacenamiento ilimitado de contactos y eventos",
            "Recordatorios personalizados para fechas importantes",
            "Resúmenes detallados del historial de cada contacto",
            "Gestión avanzada de relaciones personales",
            "Notificaciones proactivas sobre eventos relevantes"
          ].map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <Check className="w-3 h-3 text-blue-500" />
              </div>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={activateSubscription}
          className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        >
          Activar Premium ahora
        </Button>
      </CardContent>
    </Card>
  );
}