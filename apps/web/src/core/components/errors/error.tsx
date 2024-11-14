"use client";

import { Button } from "../base/button";
import { ArrowLeft } from "lucide-react";

interface ErrorProps {
  statusCode?: number;
  message?: string;
  actionUrl?: string;
  actionText?: string;
}

function Error({ statusCode = 500, message = "Error interno del servidor", actionUrl = "/", actionText = "Volver a Inicio" }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-transparent">
      <div className="text-center px-4 max-w-3xl">
        <h1 className="text-8xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          {statusCode}
        </h1>
        <h2 className="text-4xl font-bold mb-4 text-gray-800">¡Oops!</h2>
        <p className="text-xl text-gray-600 mb-8">
          {message}
        </p>
        <div className="relative inline-block">
          <Button 
            size="lg"
            onClick={() => {
              window.location.href = actionUrl;
            }}
            className="rounded-full text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {actionText}
          </Button>
          {/* Efecto decorativo */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 blur-3xl opacity-20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default Error;
