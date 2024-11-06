import 'dotenv/config'
import { MemoMateProcessor } from './processor'
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { MemoMateAssistant } from './assistant';


const run = async () => {
  const assistant = MemoMateAssistant.getInstance();
  await assistant.init();
  const processor = new MemoMateProcessor(assistant);
  
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start((ctx) => processor.handleStart(ctx));
  bot.help((ctx) => processor.handleHelp(ctx));
  bot.on(message('text'), (ctx) => processor.handleMessage(ctx));
  bot.launch();
  
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

run();

