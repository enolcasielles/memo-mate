import { RunProps, Tool } from "@memomate/openai";

export class GetCurrentDateTool extends Tool {
  constructor() {
    super({
      name: "GetCurrentDate",
      description: "Esta herramienta devuelve la fecha y hora actual en formato ISO.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    });
  }

  async run(_parameters: RunProps): Promise<string> {
    try {
      console.log("Obteniendo fecha actual...");
      const currentDate = new Date().toISOString();
      return currentDate;
    } catch (e) {
      console.error(e);
      return "Error al obtener la fecha actual.";
    }
  }
} 