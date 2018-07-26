import * as functions from 'firebase-functions';
import * as TelegramBot from 'node-telegram-bot-api';

import IHttp from './IHttp';

import ViagrupoControllerFactory from './Controllers/ViagrupoController';
import TelegramControllerFactory from './Controllers/TelegramController';

import DealRepository from './Repositories/DealRepository';
import UserRepository from './Repositories/UserRepository';

import TelegramService from './Services/TelegramService';
/* 
  TODO: Foreach parser, make an async call.
  Call parser.isApplicable afterwards.
*/

export default (
  http: IHttp,
  telegramService: TelegramService,
  dealRepository: DealRepository,
  userRepository: UserRepository
) => ({
  viagrupo: functions.https.onRequest(async (_, res) => {
    const viagrupoController = ViagrupoControllerFactory(http, dealRepository);
    await viagrupoController.parseDeals();
    /*
      TODO: find matching users and notify the deals saved,
      calling another function maybe?
    */
    return res.send('OK');
  }),
  onTelegramMessage: functions.https.onRequest(async (req, res) => {
    const { message }: { message: TelegramBot.Message } = req.body;
    console.log('Got Message: ', message.text, message.date);

    const telegramController = TelegramControllerFactory(
      dealRepository,
      userRepository,
      telegramService
    );

    await telegramController.onMessage(message);
    // TODO: proper error handling
    res.status(200).send();
  }),
});
