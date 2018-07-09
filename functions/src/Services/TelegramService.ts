import * as TelegramBot from 'node-telegram-bot-api';

enum Commands {
  start = '/start',
  deals = '/deals',
}

export default class TelegramService {
  public static Commands = Commands;
  private bot: TelegramBot;

  constructor(private key: string) {
    this.bot = new TelegramBot(key);
  }

  sendMessage(chatId: number, message: string) {
    this.bot.sendMessage(chatId, message);
  }
}
