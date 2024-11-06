import { Context } from "telegraf";
import { MemoMateAssistant } from "../assistant";
import { TextMessageContext } from "../types/telegraf";
import prisma from "@memomate/database";
import { Thread } from "@memomate/openai";

export class MemoMateProcessor {

  constructor(private assistant: MemoMateAssistant) {}

  public async handleStart(ctx: Context) {
    ctx.reply('Welcome');
  }

  public async handleHelp(ctx: Context) {
    ctx.reply('Help 2');
  }

  public async handleMessage(ctx: TextMessageContext) {
    try {
      const telegramUserId = ctx.message.from.id;
      const message = ctx.message.text;
  
      const user = await this._getOrCreateUser(telegramUserId);
  
      const response = await this.assistant.sendMessage(user.openaiThreadId, message);
      ctx.reply(response);
    } catch (error) {
      console.error(error);
    }
  }

  private async _getOrCreateUser(telegramUserId: number) {
    const user = await prisma.user.findUnique({
      where: {
        telegramUserId: telegramUserId,
      },
    });

    if (user) return user;

    const threadId = await Thread.create();
    const newUser = await prisma.user.create({
      data: {
        telegramUserId: telegramUserId,
        openaiThreadId: threadId,
      },
    });

    return newUser;
  }
}
