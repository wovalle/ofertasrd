import * as functions from 'firebase-functions';
import * as cheerio from 'cheerio';
import * as TelegramBot from 'node-telegram-bot-api';
import ViagrupoParser from './Parsers/Viagrupo';
import { v4 } from 'uuid';

import IHttp from './IHttp';

import DealRepository from './Repositories/DealRepository';
import UserRepository from './Repositories/UserRepository';
import Deal from './Models/Deal';
import User from './Models/User';

import TelegramService from './Services/TelegramService';

import { asyncForEach } from './utils';
import Resources from './Resources';

// Foreach parser, make an async call. Call parser.isApplicable afterwards.
export default (
  http: IHttp,
  telegramService: TelegramService,
  dealRepository: DealRepository,
  userRepository: UserRepository
) => ({
  viagrupo: functions.https.onRequest(async (req, res) => {
    const html = await http.get('http://www.viagrupo.com/santo-domingo/active');
    console.info('HANDLER: html downloaded, starting parser');
    const viagrupoParser = new ViagrupoParser(cheerio, {
      getCurrent: () => new Date(),
    });

    const deals = viagrupoParser.parse(html.data);

    console.info('HANDLER: html parsed saving to db');
    await dealRepository.saveAll(deals);

    res.send('OK');
  }),
  onDealCreate: functions.firestore
    .document('deals')
    .onCreate(async snapshot => {
      const deal = snapshot.data() as Deal;
      console.log('TODO: Emit notifications for document ', deal);

      const users = await userRepository.getAll();

      await asyncForEach(users, async (user: User) => {
        const message = `New Deal: ${deal.url}`;
        await telegramService.sendMessage(user.telegramId, message);
      });
    }),
  onTelegramMessage: functions.https.onRequest(async (req, res) => {
    const { message }: { message: TelegramBot.Message } = req.body;
    console.log('Got Message: ', message.text, message.date);

    switch (message.text) {
      case TelegramService.Commands.start: {
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

      case TelegramService.Commands.deals: {
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
        await telegramService.sendMessage(
          message.from!.id,
          Resources.en.telegram.invalidCommand
        );
    }
    // TODO: proper error handling
    res.status(200).send();
  }),
});
