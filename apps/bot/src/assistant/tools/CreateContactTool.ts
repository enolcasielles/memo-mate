import prisma from "@memomate/database";
import { RunProps, Tool } from "@memomate/openai";
import { ThreadMetadata } from "../../types/thread-metadata";

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
      console.log(parameters);
      const { metadata, name, relation, location } = parameters;
      await prisma.contact.create({
        data: {
          name,
          relation,
          location,
          userId: metadata.userId
        }
      });
      return `He creado el contacto ${name} correctamente.`;
    } catch (e) {
      console.error(e);
      return `No se ha podido crear el contacto.`;
    }
  }
}