import http from 'axios';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import TelegramService from './Services/TelegramService';
import DealRepository from './Repositories/DealRepository';
import UserRepository from './Repositories/UserRepository';
import initializeRoutes from './routes';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const dealRepository = new DealRepository(db);
const userRepository = new UserRepository(db);

const telegramService = new TelegramService(functions.config().telegram.key);

// TODO: initialize individuals routes depending on the url?
export const routes = initializeRoutes(
  http,
  telegramService,
  dealRepository,
  userRepository
);
