//import { CronJob } from 'cron'; // Necesitamos instalar el paquete `cron`
import { CronJob } from 'cron';
import { NotificationService } from '../services/notification.service';
import { Telegraf } from 'telegraf';

export class CronManager {
  private static instance: CronManager;
  private notificationService: NotificationService;

  private constructor(bot: Telegraf) {
    this.notificationService = NotificationService.getInstance(bot);
  }

  static getInstance(bot: Telegraf): CronManager {
    if (!CronManager.instance) {
      CronManager.instance = new CronManager(bot);
    }
    return CronManager.instance;
  }

  startJobs() {
    new CronJob(
      '0 * * * * *', // Cada minuto
      () => this.notificationService.processReminders(),
      null,
      true,
      'Europe/Madrid'
    );
  }
} 