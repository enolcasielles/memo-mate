import prisma from "@memomate/database";
import { RunProps, Tool } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";

interface GetContactEventsRunProps extends RunProps {
  contactId: string;
  metadata: ThreadMetadata;
}

export class GetContactEventsTool extends Tool {
  constructor() {
    super({
      name: "GetContactEvents",
      description: "Esta herramienta recupera los últimos eventos asociados a un contacto específico.",
      parameters: {
        type: "object",
        properties: {
          contactId: {
            type: "string",
            description: "El ID del contacto del que se quieren recuperar los eventos.",
          },
        },
        required: ["contactId"],
      },
    });
  }

  async run(parameters: GetContactEventsRunProps): Promise<string> {
    try {
      console.log("Recuperando eventos del contacto...");
      const { contactId, metadata } = parameters;

      // Verificar que el contacto existe y pertenece al usuario
      const contact = await prisma.contact.findUnique({
        where: { 
          id: contactId,
          userId: metadata.userId
        },
      });

      if (!contact) {
        return `No se encontró el contacto con ID: ${contactId}`;
      }

      // Recuperar los últimos 10 eventos ordenados por fecha
      const events = await prisma.event.findMany({
        where: {
          contactId: contactId
        },
        orderBy: {
          eventDate: 'desc'
        },
        take: 10
      });

      if (events.length === 0) {
        return `No hay eventos registrados para ${contact.name}.`;
      }

      // Formatear la respuesta
      const formattedEvents = events.map(event => {
        const fecha = event.eventDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        return `- ${fecha}: ${event.description}`;
      }).join('\n');

      return `Eventos registrados para ${contact.name}:\n${formattedEvents}`;
    } catch (e) {
      console.error(e);
      return "Error al recuperar los eventos del contacto.";
    }
  }
} 