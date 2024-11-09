import { Telegraf } from 'telegraf';
import prisma from '@memomate/database';

export class NotificationService {
  private bot: Telegraf;
  private static instance: NotificationService;

  private constructor(bot: Telegraf) {
    this.bot = bot;
  }

  static getInstance(bot: Telegraf): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(bot);
    }
    return NotificationService.instance;
  }

  async testCron() {
    console.log('testCron');
  }

  async processReminders() {
    try {
      // Obtener recordatorios pendientes
      const pendingReminders = await prisma.reminder.findMany({
        where: {
          completed: false,
          remindAt: {
            lte: new Date()
          }
        },
        include: {
          user: true,
          contact: true
        }
      });

      // Procesar cada recordatorio
      for (const reminder of pendingReminders) {
        try {
          // Construir el mensaje
          let message = `🔔 Recordatorio: ${reminder.message}`;
          if (reminder.contact) {
            message += `\nContacto: ${reminder.contact.name}`;
          }

          // Enviar la notificación
          await this.bot.telegram.sendMessage(
            reminder.user.telegramChatId.toString(),
            message
          );

          // Marcar como completado
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { completed: true }
          });

        } catch (error) {
          console.error(`Error procesando recordatorio ${reminder.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error en el procesamiento de recordatorios:', error);
    }
  }
} 