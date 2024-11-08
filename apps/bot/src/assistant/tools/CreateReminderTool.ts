import prisma from "@memomate/database";
import { RunProps, Tool } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";

interface CreateReminderRunProps extends RunProps {
  contactId: string;
  message: string;
  remindAt: string; // Fecha en formato ISO
  metadata: ThreadMetadata;
}

export class CreateReminderTool extends Tool {
  constructor() {
    super({
      name: "CreateReminder",
      description: "Esta herramienta crea un nuevo recordatorio asociado a un contacto.",
      parameters: {
        type: "object",
        properties: {
          contactId: {
            type: "string",
            description: "El ID del contacto al que se asociará el recordatorio.",
          },
          message: {
            type: "string",
            description: "Mensaje del recordatorio que describe qué hay que recordar.",
          },
          remindAt: {
            type: "string",
            description: "Fecha y hora en formato ISO cuando se debe enviar el recordatorio.",
          },
        },
        required: ["contactId", "message", "remindAt"],
      },
    });
  }

  async run(parameters: CreateReminderRunProps): Promise<string> {
    try {
      console.log("Creando recordatorio...");
      const { contactId, message, remindAt, metadata } = parameters;

      // Verificar que el contacto existe
      const contact = await prisma.contact.findUnique({
        where: { 
          id: contactId,
          userId: metadata.userId // Aseguramos que el contacto pertenece al usuario
        },
      });

      if (!contact) {
        return `No se encontró el contacto con ID: ${contactId}`;
      }

      // Crear el recordatorio
      await prisma.reminder.create({
        data: {
          userId: metadata.userId,
          contactId,
          message,
          remindAt: new Date(remindAt),
          completed: false,
        },
      });

      return `Recordatorio creado correctamente para ${contact.name}: "${message}" programado para ${new Date(remindAt).toLocaleString()}`;
    } catch (e) {
      console.error(e);
      return "Error al crear el recordatorio.";
    }
  }
} 