"use client";

import Error from "@/core/components/errors/error";

function Error404() {
  return (
    <Error statusCode={404} message="No hemos encontrado la página que buscas. Parece que te has perdido en el camino." actionUrl="/" actionText="Volver a Inicio" />
  );
}

export default Error404;
