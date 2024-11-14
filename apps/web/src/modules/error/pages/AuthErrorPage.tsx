import Error from "@/core/components/errors/error";

interface Props {
  searchParams: {
    type: string;
  };
}

export default function AuthErrorPage({searchParams: {type}}: Props) {
  const message = type === "INVALID_TOKEN" ? "El link de acceso es inválido o expiró. Crea un nuevo link de acceso desde el bot de MemoMate en Telegram enviando el comando /setup." : "No tienes permisos para acceder a esta página.";
  return <Error statusCode={401} message={message} actionUrl="/" actionText="Volver a Inicio" />;
}
