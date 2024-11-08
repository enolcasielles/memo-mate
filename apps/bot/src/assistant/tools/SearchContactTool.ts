import { RunProps, Tool, Embeddings } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";
import PineconeService from "../../pinecone";

interface SearchContactRunProps extends RunProps {
  name: string;
  relation?: string;
  location?: string;
  metadata: ThreadMetadata;
}

export class SearchContactTool extends Tool {
  constructor() {
    super({
      name: "SearchContact",
      description: "Esta herramienta busca un contacto existente en la base de datos.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "El nombre del contacto que se desea buscar.",
          },
          relation: {
            type: "string",
            description: "La relación del contacto con el usuario (opcional). Ejemplo: 'Amigo', 'Familiar', 'Trabajo', etc.",
          },
          location: {
            type: "string",
            description: "La ubicación del contacto (opcional). Puede ser una ciudad, un país, etc.",
          },
        },
        required: ["name"],
      },
    });
  }

  async run(parameters: SearchContactRunProps): Promise<string> {
    try {
      console.log("Buscando contacto...");
      const { metadata, name, relation, location } = parameters;
      
      // Generar el texto para la búsqueda
      const searchText = `Nombre: ${name}${relation ? `, Relación: ${relation}` : ''}${location ? `, Ubicación: ${location}` : ''}`;
      
      // Generar embedding usando OpenAI
      const embeddings = new Embeddings();
      const queryEmbedding = await embeddings.generateEmbedding(searchText);
      
      // Buscar en Pinecone
      const results = await PineconeService.getInstance().searchSimilarContacts(
        metadata.userId,
        queryEmbedding,
        1 // Solo necesitamos el más similar
      );

      if (results.length > 0 && results[0].score && results[0].score > 0.7) {
        return `Contacto encontrado con ID: ${results[0].id}`;
      }

      return "No se encontró ningún contacto que coincida con los criterios de búsqueda.";
    } catch (e) {
      console.error(e);
      return "Error al buscar el contacto.";
    }
  }
} 