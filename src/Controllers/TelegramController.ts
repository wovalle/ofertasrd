import { Message } from 'node-telegram-bot-api';
import { v4 } from 'uuid';

import ITelegramService from '../Services/ITelegramService';
import IDealRepository from '../Repositories/IDealRepository';
import IUserRepository from '../Repositories/IUserRepository';
import Resources from '../Resources';
import { TelegramCommands } from '../Enums/TelegramCommand';

export default (
  dealRepository: IDealRepository,
  userRepository: IUserRepository,
  telegramService: ITelegramService
) => ({
  onMessage: async (message: Message) => {
    switch (message.text) {
      case TelegramCommands.start: {
        const user = await userRepository.byTelegramId(message.from!.id);

        if (!user) {
          await userRepository.save({
            telegramId: message.from!.id,
            id: v4(),
            locale: message.from!.language_code || 'en',
          });
        }

        await telegramService.sendMessage(
          message.from!.id,
          Resources.en.telegram.afterStart
        );
        break;
      }

      case TelegramCommands.deals: {
        const user = await userRepository.byTelegramId(message.from!.id);

        if (!user) {
          await telegramService.sendMessage(
            message.from!.id,
            Resources.en.telegram.invalidUser
          );
          break;
        }

        const deals = await dealRepository.getActive(3);
        let dealsMessage = deals
          .map(Resources.en.telegram.dealToText)
          .join('\n\n');

        if (!deals.length) {
          dealsMessage = Resources.en.telegram.emptyDeals;
        }

        await telegramService.sendMessage(message.from!.id, dealsMessage, {
          parse_mode: 'Markdown',
        });
        break;
      }

      default:
        telegramService.sendMessage(
          message.from!.id,
          Resources.en.telegram.invalidCommand
        );
    }
  },
});
