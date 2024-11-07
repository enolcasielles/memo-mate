import { Agent, Thread } from "@memomate/openai";
import path from "path";
import { ThreadMetadata } from "../types/thread-metadata";
import { CreateContactTool } from "./tools/CreateContactTool";

const agent = new Agent({
  id: process.env.OPENAI_ASSISTANT_ID,
  name: "MemoMate Assistant",
  description: path.join(__dirname, "description.md"),
  instructions: path.join(__dirname, "instructions.md"),
  model: "gpt-4o-mini",
  tools: [
    new CreateContactTool()
  ],
});

export class MemoMateAssistant {
  private agent: Agent;
  private static instance: MemoMateAssistant;

  private constructor() {
    this.agent = agent;
  }

  static getInstance(): MemoMateAssistant {
    if (!MemoMateAssistant.instance) {
      MemoMateAssistant.instance = new MemoMateAssistant();
    }
    return MemoMateAssistant.instance;
  }

  async init() {
    try {
      await this.agent.init();
      console.log("Asistente inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar el asistente:", error);
      throw error;
    }
  }

  async sendMessage(userId: string,threadId: string, message: string): Promise<string> {
    try {
      const thread = new Thread<ThreadMetadata>({
        id: threadId,
        agent: this.agent,
        metadata: {
          userId: userId,
        },
      });
      await thread.init();
      const response = await thread.send(message);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Error al enviar mensaje";
    }
  }
}