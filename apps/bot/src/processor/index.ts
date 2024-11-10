import { Context } from "telegraf";
import { MemoMateAssistant } from "../assistant";
import { TextMessageContext } from "../types/telegraf";
import prisma from "@memomate/database";
import { Thread } from "@memomate/openai";
import { welcomeTemplate } from "./templates/welcome";
import { helpTemplate } from "./templates/help";

export class MemoMateProcessor {

  constructor(private assistant: MemoMateAssistant) {}

  public async handleStart(ctx: Context) {
    const telegramUserId = ctx.message.from.id;
    const chatId = ctx.message.chat.id;

    const user = await this._getOrCreateUser(telegramUserId, chatId);

    if (user.hasCompletedSetup) {
      ctx.reply('¡Hola! Parece que ya has completado el setup. ¿Qué deseas hacer hoy? Si quieres volver a configurar tu cuenta, puedes enviar el comando /setup');
    } else {
      const link = await this.createSessionUrl(user.id);
      const message = welcomeTemplate(link);
      ctx.reply(message, {
        parse_mode: 'HTML'
      });
      await prisma.user.update({
        where: { id: user.id },
        data: {
          hasCompletedSetup: false // TODO: Cambiar a true
        }
      })
    }
  }

  public async handleHelp(ctx: Context) {
    const message = helpTemplate();
    ctx.reply(message, {
      parse_mode: 'HTML'
    });
  }

  public async handleSetup(ctx: Context) {
    const telegramUserId = ctx.message.from.id;
    const user = await prisma.user.findUnique({
      where: {
        telegramUserId: telegramUserId,
      },
    });
    if (!user) {
      ctx.reply('Parece que no tienes una cuenta. Por favor, usa el comando /start para crear una.');
      return;
    }
    const link = await this.createSessionUrl(user.id);
    ctx.reply(`¡Hola! Para configurar tu cuenta, por favor visita el siguiente enlace:\n\n<a href="${link}">${link}</a>`, {
      parse_mode: 'HTML'
    });
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

  private async createSessionUrl(userId: string) {
    const session = await prisma.session.create({
      data: {
        userId: userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      }
    });
    const link = `${process.env.FRONTEND_URL}/login?token=${session.id}`;
    return link;
  }
}
