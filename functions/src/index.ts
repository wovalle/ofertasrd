import initializeRoutes from './routes';
import http from 'axios';

export const routes = initializeRoutes(http);
