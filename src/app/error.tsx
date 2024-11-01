"use client";

import Error500 from "@/core/components/errors/error500";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <Error500
      message={
        process.env.NODE_ENV === "production"
          ? "Se ha producido un error inesperado. Inténtalo de nuevo más tarde."
          : error.message
      }
      digest={error.digest}
    />
  );
}
