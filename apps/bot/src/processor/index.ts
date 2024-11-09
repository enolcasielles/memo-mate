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
      const chatId = ctx.message.chat.id;
      const message = ctx.message.text;
  
      const user = await this._getOrCreateUser(telegramUserId, chatId);
  
      const response = await this.assistant.sendMessage(user.id, user.openaiThreadId, message);
      ctx.reply(response);
    } catch (error) {
      console.error(error);
    }
  }

  private async _getOrCreateUser(telegramUserId: number, chatId: number) {
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
        telegramChatId: chatId,
        openaiThreadId: threadId,
      },
    });

    return newUser;
  }
}
