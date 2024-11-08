import prisma from "@memomate/database";
import { RunProps, Tool, Embeddings } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";
import PineconeService from "../../pinecone";

interface CreateContactRunProps extends RunProps {
  name: string;
  relation: string;
  location: string;
  metadata: ThreadMetadata;
}

export class CreateContactTool extends Tool {
  constructor() {
    super({
      name: "CreateContact",
      description:
        "Esta herramienta crea un nuevo contacto en la base de datos.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "El nombre del contacto que se desea crear.",
          },
          relation: {
            type: "string",
            description:
              "La relación del contacto con el usuario. Ejemplo: 'Amigo', 'Familiar', 'Trabajo', etc.",
          },
          location: {
            type: "string",
            description:
              "La ubicación del contacto. Puede ser una ciudad, un país, etc. Ejemplos: 'Madrid', 'Asturias', 'Argentina', etc.",
          },
        },
        required: ["name"],
      },
    });
  }

  async run(parameters: CreateContactRunProps): Promise<string> {
    try {
      const { metadata, name, relation, location } = parameters;
      
      // Crear el contacto en la base de datos
      const contact = await prisma.contact.create({
        data: {
          name,
          relation,
          location,
          userId: metadata.userId
        }
      });

      // Generar el texto para el embedding
      const contactText = `Nombre: ${name}${relation ? `, Relación: ${relation}` : ''}${location ? `, Ubicación: ${location}` : ''}`;
      
      // Generar embedding usando OpenAI
      const embeddings = new Embeddings();
      const embeddingValue = await embeddings.generateEmbedding(contactText);
      
      // Indexar en Pinecone
      await PineconeService.getInstance().upsertContact(
        metadata.userId,
        contact.id,
        embeddingValue
      );

      return `He creado el contacto ${name} correctamente.`;
    } catch (e) {
      console.error(e);
      return `No se ha podido crear el contacto.`;
    }
  }
}