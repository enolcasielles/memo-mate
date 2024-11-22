import prisma from "@memomate/database";
import { RunProps, Tool } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";
import PineconeService from "../../pinecone";

interface DeleteContactRunProps extends RunProps {
  contactId: string;
  metadata: ThreadMetadata;
}

export class DeleteContactTool extends Tool {
  constructor() {
    super({
      name: "DeleteContact",
      description: "Esta herramienta elimina un contacto existente y toda su información asociada. **Importante: Antes de eliminar un contacto, debes asegurarte de que el usuario haya confirmado la eliminación.**",
      parameters: {
        type: "object",
        properties: {
          contactId: {
            type: "string",
            description: "El ID del contacto que se desea eliminar.",
          },
        },
        required: ["contactId"],
      },
    });
  }

  async run(parameters: DeleteContactRunProps): Promise<string> {
    try {
      console.log("Eliminando contacto...");
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

      // Eliminar el contacto y sus datos asociados
      await prisma.$transaction([
        prisma.event.deleteMany({ where: { contactId } }),
        prisma.reminder.deleteMany({ where: { contactId } }),
        prisma.contact.delete({ where: { id: contactId } })
      ]);

      // Eliminar el embedding de Pinecone
      await PineconeService.getInstance().deleteContact(
        contactId
      );

      return `El contacto ${contact.name} y toda su información asociada han sido eliminados correctamente.`;
    } catch (e) {
      console.error(e);
      return "Error al eliminar el contacto.";
    }
  }
} 