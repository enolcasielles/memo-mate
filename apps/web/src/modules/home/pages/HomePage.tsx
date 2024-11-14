import { Button } from "@/core/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/base/card";
import { cn } from "@/core/lib/utils";
import { ArrowRight, MessageCircle, Calendar, Bell } from "lucide-react";
import { getUserId } from "@/core/utils/get-user-id";
import Link from "next/link";

export default async function HomePage() {
  const titleClasses = "relative text-4xl font-extrabold text-center mb-12 inline-block";
  const titleWrapperClasses = "flex justify-center items-center flex-col";

  let isAuthenticated = false;
  try {
    await getUserId();
    isAuthenticated = true;
  } catch (error) {
    isAuthenticated = false;
  }

  const renderCtaButton = (noUserText: string) => {
    if (isAuthenticated) {
      return (
        <Link href="/dashboard">
          <Button 
            size="lg" 
            className="rounded-full text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Ir al Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      )
    }
    else {
      return (
        <a href="https://t.me/MemoMateBot?start=setup" target="_blank">
          <Button 
            size="lg" 
            className="rounded-full text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {noUserText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </a>
      )
    }
  }

  return (
    <div className={cn("min-h-screen")}>
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16 pt-20">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              MemoMate
            </h1>
            <p className="text-2xl mb-12 text-gray-700 font-medium">
              Tu asistente personal para mejorar tus relaciones
            </p>
            <div className="relative inline-block">
              {renderCtaButton("Comenzar ahora")}
              {/* Efecto decorativo opcional */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 blur-3xl opacity-20 rounded-full"></div>
            </div>
          </div>
          
          {/* Decoración opcional */}
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className={titleWrapperClasses}>
            <h2 className={titleClasses}>
              Características principales
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <MessageCircle className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Chatbot en Telegram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Interactúa de forma natural con MemoMate a través de Telegram para gestionar tus relaciones personales.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <Calendar className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Gestión de eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Registra y recuerda eventos importantes relacionados con tus contactos.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <Bell className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Recordatorios inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Recibe recordatorios personalizados para mantener y mejorar tus relaciones personales.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Example Section */}
        <section className="mb-16">
          <div className={titleWrapperClasses}>
            <h2 className={titleClasses}>
              Cómo funciona
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></span>
            </h2>
          </div>
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ejemplo de uso</CardTitle>
              <CardDescription className="text-lg">
                Mira cómo MemoMate procesa y almacena la información
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Usuario mensaje */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] shadow-sm">
                    "Ayer me encontré con mi primo Marcos, que va a empezar a trabajar en otra empresa."
                  </div>
                </div>

                {/* MemoMate procesa */}
                <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-500 mb-1">MemoMate procesa:</p>
                  <p className="text-gray-700">
                    Identifica a "Marcos" como un contacto y registra el cambio de empleo como un evento importante.
                  </p>
                </div>

                {/* Usuario pregunta */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] shadow-sm">
                    "Recuérdame las últimas novedades sobre mi primo Marcos."
                  </div>
                </div>

                {/* MemoMate responde */}
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">MemoMate</span>
                    </div>
                    "La última novedad es que Marcos va a empezar a trabajar en otra empresa."
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className={titleWrapperClasses}>
            <h2 className={titleClasses}>
              ¿Listo para mejorar tus relaciones personales?
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></span>
            </h2>
          </div>
          <p className="mb-8">
            Únete a MemoMate hoy y comienza a fortalecer tus conexiones de
            manera inteligente.
          </p>
          {renderCtaButton("Prueba MemoMate gratis")}
        </section>
      </main>
    </div>
  );
}
