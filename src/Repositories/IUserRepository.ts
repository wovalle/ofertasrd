import IRepository from './IRepository';
import User from '../Models/User';

export default interface IUserRepository extends IRepository<User> {
  byTelegramId(telegramId: number): Promise<User>;
}
