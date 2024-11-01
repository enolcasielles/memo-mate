import { Button } from "@/core/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/base/card";
import { ArrowRight, MessageCircle, Calendar, Bell } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">MemoMate</h1>
          <p className="text-xl mb-8">
            Tu asistente personal para mejorar tus relaciones
          </p>
          <Button size="lg">
            Comenzar ahora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Características principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-6 w-6" />
                  Chatbot en Telegram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Interactúa de forma natural con MemoMate a través de Telegram
                  para gestionar tus relaciones personales.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-6 w-6" />
                  Gestión de eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Registra y recuerda eventos importantes relacionados con tus
                  contactos.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-6 w-6" />
                  Recordatorios inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Recibe recordatorios personalizados para mantener y mejorar
                  tus relaciones personales.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Example Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Cómo funciona
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Ejemplo de uso</CardTitle>
              <CardDescription>
                Mira cómo MemoMate procesa y almacena la información
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Tú dices:</p>
                  <p className="bg-blue-100 p-2 rounded">
                    "Ayer me encontré con mi primo Marcos, que va a empezar a
                    trabajar en otra empresa."
                  </p>
                </div>
                <div>
                  <p className="font-semibold">MemoMate procesa:</p>
                  <p className="bg-green-100 p-2 rounded">
                    Identifica a "Marcos" como un contacto y registra el cambio
                    de empleo como un evento importante.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Más tarde, tú preguntas:</p>
                  <p className="bg-blue-100 p-2 rounded">
                    "Recuérdame las últimas novedades sobre mi primo Marcos."
                  </p>
                </div>
                <div>
                  <p className="font-semibold">MemoMate responde:</p>
                  <p className="bg-green-100 p-2 rounded">
                    "La última novedad es que Marcos va a empezar a trabajar en
                    otra empresa."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">
            ¿Listo para mejorar tus relaciones personales?
          </h2>
          <p className="mb-8">
            Únete a MemoMate hoy y comienza a fortalecer tus conexiones de
            manera inteligente.
          </p>
          <Button size="lg">
            Prueba MemoMate gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </main>
    </div>
  );
}
