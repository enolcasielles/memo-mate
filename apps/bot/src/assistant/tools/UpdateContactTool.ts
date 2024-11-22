import prisma from "@memomate/database";
import { RunProps, Tool, Embeddings } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";
import PineconeService from "../../pinecone";

interface UpdateContactRunProps extends RunProps {
  contactId: string;
  name?: string;
  relation?: string;
  location?: string;
  metadata: ThreadMetadata;
}

export class UpdateContactTool extends Tool {
  constructor() {
    super({
      name: "UpdateContact",
      description: "Esta herramienta actualiza la información de un contacto existente.",
      parameters: {
        type: "object",
        properties: {
          contactId: {
            type: "string",
            description: "El ID del contacto que se desea actualizar.",
          },
          name: {
            type: "string",
            description: "El nuevo nombre del contacto (opcional).",
          },
          relation: {
            type: "string",
            description: "La nueva relación del contacto con el usuario (opcional).",
          },
          location: {
            type: "string",
            description: "La nueva ubicación del contacto (opcional).",
          },
        },
        required: ["contactId"],
      },
    });
  }

  async run(parameters: UpdateContactRunProps): Promise<string> {
    try {
      console.log("Actualizando contacto...");
      const { contactId, name, relation, location, metadata } = parameters;

      // Verificar que el contacto existe y pertenece al usuario
      const existingContact = await prisma.contact.findUnique({
        where: { 
          id: contactId,
          userId: metadata.userId
        },
      });

      if (!existingContact) {
        return `No se encontró el contacto con ID: ${contactId}`;
      }

      // Actualizar el contacto
      const updatedContact = await prisma.contact.update({
        where: { id: contactId },
        data: {
          ...(name && { name }),
          ...(relation && { relation }),
          ...(location && { location }),
        },
      });

      // Generar nuevo embedding si se actualizó algún campo
      if (name || relation || location) {
        const contactText = `Nombre: ${updatedContact.name}${updatedContact.relation ? `, Relación: ${updatedContact.relation}` : ''}${updatedContact.location ? `, Ubicación: ${updatedContact.location}` : ''}`;
        const embeddings = new Embeddings();
        const embeddingValue = await embeddings.generateEmbedding(contactText);
        
        await PineconeService.getInstance().upsertContact(
          metadata.userId,
          contactId,
          embeddingValue
        );
      }

      return `Contacto actualizado correctamente: ${updatedContact.name}`;
    } catch (e) {
      console.error(e);
      return "Error al actualizar el contacto.";
    }
  }
} 