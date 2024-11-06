import { RunProps, Tool } from "@memomate/openai";

export class CreateContactTool extends Tool {
  run(parameters: RunProps): Promise<string> {
    throw new Error("Method not implemented.");
  }
}