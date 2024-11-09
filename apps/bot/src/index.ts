import 'dotenv/config'
import { MemoMateProcessor } from './processor'
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { MemoMateAssistant } from './assistant';
import PineconeService from './pinecone';
import { CronManager } from './cron';

const run = async () => {
  // Inicializar bot
  const bot = new Telegraf(process.env.BOT_TOKEN);
  
  // Inicializar servicios
  const assistant = MemoMateAssistant.getInstance();
  const pinecone = PineconeService.getInstance();
  const cronManager = CronManager.getInstance(bot);
  
  await Promise.all([
    assistant.init(),
    pinecone.init()
  ]);
  
  const processor = new MemoMateProcessor(assistant);
  
  bot.start((ctx) => processor.handleStart(ctx));
  bot.help((ctx) => processor.handleHelp(ctx));
  bot.on(message('text'), (ctx) => processor.handleMessage(ctx));
  
  // Iniciar cron jobs
  cronManager.startJobs();
  
  bot.launch();
  
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

run();

