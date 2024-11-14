"use client";

import Error from "@/core/components/errors/error";

function Error500({
	error,
}: {
	error: Error & { digest?: string };
}) {
  return (
    <Error 
      statusCode={500} 
      message={
        process.env.NODE_ENV === "production"
          ? "Se ha producido un error inesperado. Inténtalo de nuevo más tarde."
          : error.message
      }
      actionUrl="/"
      actionText="Volver a Inicio"
    />
  );
}

export default Error500;
