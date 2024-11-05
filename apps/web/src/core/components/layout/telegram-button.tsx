import { Bot } from "lucide-react";

export function TelegramButton() {
  return (
    <a
      href="https://t.me/memomate_bot"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
    >
      {/* Aquí iría el icono de Telegram */}
      <Bot />
      <span className="sr-only">Abrir chat en Telegram</span>
    </a>
  );
}
