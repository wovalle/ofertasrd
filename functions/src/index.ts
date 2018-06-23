import * as functions from 'firebase-functions';
import http from 'axios';
import * as admin from 'firebase-admin';
import * as TelegramBot from 'node-telegram-bot-api';

import DealRepository from './Repositories/DealRepository';
import UserRepository from './Repositories/UserRepository';
import initializeRoutes from './routes';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const telegramBot = new TelegramBot(functions.config().telegram.key);

const dealRepository = new DealRepository(db);
const userRepository = new UserRepository(db);

export const routes = initializeRoutes(
  http,
  telegramBot,
  dealRepository,
  userRepository
);
