import { Thread as OpenAiThread } from "openai/resources/beta/threads/threads";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Agent } from "./Agent";
import { openaiClient } from ".";

type ThreadParams = {
  id: string;
  agent: Agent;
};

const MAX_RETRIES = 3;

export class Thread {
  id: string;
  agent: Agent;

  thread: OpenAiThread;
  run: Run;

  constructor({ id, agent }: ThreadParams) {
    this.id = id;
    this.agent = agent;
  }

  static async create() {
    const thread = await openaiClient.beta.threads.create();
    return thread.id;
  }

  async init() {
    if (!this.id) throw new Error("Thread id not set");
    this.thread = await openaiClient.beta.threads.retrieve(this.id);
  }

  async send(message: string, retries: number = 1): Promise<string> {
    if (!this.agent) throw new Error("Assistant not set");
    if (!this.thread) await this.init();
    await openaiClient.beta.threads.messages.create(this.id, {
      role: "user",
      content: message,
    });
    this.run = await openaiClient.beta.threads.runs.create(this.id, {
      assistant_id: this.agent.id,
    });
    while (true) {
      await this.waitUntilDone();
      if (this.run.status === "completed") {
        const _message = await this.extractMessage();
        return _message;
      } else if (this.run.status === "requires_action") {
        await this.processAction();
      } else {
        const err = "Run failed: " + this.run.status;
        console.log(err);
        if (retries < MAX_RETRIES) {
          console.log("Retrying in 30s...");
          await new Promise((resolve) => setTimeout(resolve, 30000));
          return this.send(message, retries + 1);
        }
        const _message = this.generateFailedMessage();
        return _message;
      }
    }
  }

  private async waitUntilDone() {
    while (["queued", "in_progress", "cancelling"].includes(this.run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.run = await openaiClient.beta.threads.runs.retrieve(
        this.id,
        this.run.id,
      );
    }
  }

  private async extractMessage() {
    const messages = await openaiClient.beta.threads.messages.list(this.id);
    const content = messages.data[0].content[0];
    if (content.type === "text") {
      return content.text.value;
    } else {
      throw new Error(
        "Framework does not support messages different than text yet.",
      );
    }
  }

  private generateFailedMessage() {
    return "Lo siento pero no puedo procesar tu mensaje en este momento. Por favor inténtalo de nuevo más tarde.";
  }

  private async processAction() {
    const toolsToExecute =
      await this.run.required_action.submit_tool_outputs.tool_calls;
    const toolsResults = [];
    for (const toolToExecute of toolsToExecute) {
      const toolName = toolToExecute.function.name;
      const tool = this.agent.tools.find((t) => t.name === toolName);
      const toolResult = tool
        ? await tool.run({
            ...JSON.parse(toolToExecute.function.arguments),
            callerAgent: this.agent,
          })
        : "ERROR: no existe ninguna herramienta con el nombre que has indicado. Inténtalo de nuevo con el nombre correcto. La lista de herramientas disponibles es la siguiente: " +
          this.agent.tools.map((t) => t.name).join(", ");
      toolsResults.push({
        tool_call_id: toolToExecute.id,
        output: toolResult.toString(),
      });
    }
    this.run = await openaiClient.beta.threads.runs.submitToolOutputs(
      this.id,
      this.run.id,
      {
        tool_outputs: toolsResults,
      },
    );
  }
}
