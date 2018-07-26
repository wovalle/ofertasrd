import { SendMessageOptions } from 'node-telegram-bot-api';

export default interface ITelegramService {
  sendMessage(
    chatId: number | Number,
    message: string,
    options?: SendMessageOptions
  ): void;
}
