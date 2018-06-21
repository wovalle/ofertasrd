import * as functions from 'firebase-functions';
import http from 'axios';
import * as admin from 'firebase-admin';

import DealRepository from './Repositories/DealRepository';
import initializeRoutes from './routes';

admin.initializeApp(functions.config().firebase);

const db = admin.database();
const dealRepository = new DealRepository(db);

export const routes = initializeRoutes(http, dealRepository);
