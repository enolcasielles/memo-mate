import { CronJob } from 'cron';
import { NotificationService } from '../services/notification.service';
import { CreditService } from '../services/credit.service';
import { Telegraf } from 'telegraf';

export class CronManager {
  private static instance: CronManager;
  private notificationService: NotificationService;
  private creditService: CreditService;

  private constructor(bot: Telegraf) {
    this.notificationService = NotificationService.getInstance(bot);
    this.creditService = CreditService.getInstance();
  }

  static getInstance(bot: Telegraf): CronManager {
    if (!CronManager.instance) {
      CronManager.instance = new CronManager(bot);
    }
    return CronManager.instance;
  }

  startJobs() {
    // Cron para procesar recordatorios (cada minuto)
    new CronJob(
      '0 * * * * *',
      () => this.notificationService.processReminders(),
      null,
      true,
      'Europe/Madrid'
    );

    // Cron para renovar créditos (todos los días a las 3 AM)
    new CronJob(
      '0 3 * * *',
      () => this.creditService.renewCredits(),
      null,
      true,
      'Europe/Madrid'
    );
  }
} 