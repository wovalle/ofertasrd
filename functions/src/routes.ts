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
import { asyncForEach } from './utils';

// Foreach parser, make an async call. Call parser.isApplicable afterwards.
export default (
  http: IHttp,
  telegramBot: TelegramBot,
  dealRepository: DealRepository,
  userRepository: UserRepository
) => ({
  viagrupo: functions.https.onRequest(async (req, res) => {
    const html = await http.get('http://www.viagrupo.com/santo-domingo/active');
    const viagrupoParser = new ViagrupoParser(cheerio);

    const deals = viagrupoParser.parse(html.data);

    await dealRepository.saveAll(deals);

    res.send(deals);
  }),
  onDealCreate: functions.firestore
    .document('deals')
    .onCreate(async snapshot => {
      const deal = snapshot.data() as Deal;
      console.log('TODO: emit notifications for document ', deal);

      const users = await userRepository.getAll();

      await asyncForEach(users, async (user: User) => {
        await telegramBot.sendMessage(
          `${user.telegramId}`,
          `New Deal: ${deal.url}`
        );
      });
    }),
  onTelegramMessage: functions.https.onRequest(async (req, res) => {
    const { message }: { message: TelegramBot.Message } = req.body;
    console.log('got Message: ', message.text, message.date);

    if (message.text === '/register') {
      const user = await userRepository.byTelegramId(message.from!.id);

      if (!user) {
        await userRepository.save({
          telegramId: message.from!.id,
          id: v4(),
        });
      }
    }
    // TODO: proper error handling
    res.status(200).send();
  }),
});
