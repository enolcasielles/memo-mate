import * as fs from "fs";
import {
  Assistant,
  AssistantCreateParams,
  AssistantUpdateParams,
} from "openai/resources/beta/assistants";
import { Tool } from "./Tool";
import { openaiClient } from ".";

interface Props {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model?: string;
  tools: Array<Tool>;
  files?: Array<string>;
}

export class Agent {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
  tools: Array<Tool>;

  assistant: Assistant;

  constructor({ id, name, description, instructions, model, tools }: Props) {
    this.id = id;
    this.name = name;
    this.description = description ? fs.readFileSync(description, "utf-8") : "";
    this.instructions = instructions
      ? fs.readFileSync(instructions, "utf-8")
      : "";
    this.model = model ?? "gpt-4-turbo-2024-04-09";
    this.tools = tools ?? [];
  }

  async init() {
    let openAiAssistant = await openaiClient.beta.assistants.retrieve(this.id);
    const shouldUpdate = this.shouldUpdate(openAiAssistant);
    if (shouldUpdate) {
      openAiAssistant = await openaiClient.beta.assistants.update(
        this.id,
        this.generateBody() as AssistantUpdateParams,
      );
    }
    this.assistant = openAiAssistant;
  }

  addTool(tool: Tool) {
    this.tools.push(tool);
  }

  private generateBody(): AssistantCreateParams | AssistantUpdateParams {
    return {
      model: this.model,
      name: this.name,
      description: this.description,
      instructions: this.instructions,
      tools: this.tools.map((tool) => {
        return {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        };
      }),
    };
  }

  private shouldUpdate(openAiAssistant: Assistant): boolean {
    if (this.name !== openAiAssistant.name) return true;
    if (this.description !== openAiAssistant.description) return true;
    if (this.instructions !== openAiAssistant.instructions) return true;
    if (this.model !== openAiAssistant.model) return true;
    if (this.tools.length !== openAiAssistant.tools.length) return true;
    return false;
  }
}
