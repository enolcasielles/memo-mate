import prisma from "@memomate/database";
import { RunProps, Tool } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";

interface CreateEventRunProps extends RunProps {
  contactId: string;
  description: string;
  eventDate?: string; // Formato ISO
  metadata: ThreadMetadata;
}

export class CreateEventTool extends Tool {
  constructor() {
    super({
      name: "CreateEvent",
      description: "Esta herramienta crea un nuevo evento asociado a un contacto.",
      parameters: {
        type: "object",
        properties: {
          contactId: {
            type: "string",
            description: "El ID del contacto al que se asociará el evento.",
          },
          description: {
            type: "string",
            description: "Descripción del evento.",
          },
          eventDate: {
            type: "string",
            description: "Fecha del evento en formato ISO (opcional). Si no se proporciona, se usará la fecha actual.",
          },
        },
        required: ["contactId", "description"],
      },
    });
  }

  async run(parameters: CreateEventRunProps): Promise<string> {
    try {
      console.log("Creando evento...");
      const { contactId, description, eventDate } = parameters;

      // Verificar que el contacto existe
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
      });

      if (!contact) {
        return `No se encontró el contacto con ID: ${contactId}`;
      }

      // Crear el evento
      await prisma.event.create({
        data: {
          contactId,
          description,
          eventDate: eventDate ? new Date(eventDate) : new Date(),
        },
      });

      return `Evento creado correctamente: "${description}" para el contacto ${contact.name}`;
    } catch (e) {
      console.error(e);
      return "Error al crear el evento.";
    }
  }
} 