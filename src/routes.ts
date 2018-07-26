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

    const parsedDeals = viagrupoParser.parse(html.data);
    console.info(
      `HANDLER: html downloaded. Deals parsed: ${parsedDeals.length}.`
    );

    const activeDealsIds = await dealRepository.getAllActiveIds();
    const dealIsSaved = (deal: Deal) => activeDealsIds.some(d => d === deal.id);

    const remainingDeals = parsedDeals.filter(d => !dealIsSaved(d));
    console.info(`Saving ${remainingDeals.length} new deals`);

    await dealRepository.saveAll(remainingDeals);
    /*
      TODO: find matching users and notify the deals saved,
      calling another function maybe?
    */
    res.send('OK');
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
        telegramService.sendMessage(
          message.from!.id,
          Resources.en.telegram.invalidCommand
        );
    }
    // TODO: proper error handling
    res.status(200).send();
  }),
});
