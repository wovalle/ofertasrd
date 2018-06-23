import { firestore } from 'firebase-admin';
import Repository from './Repository';
import User from '../Models/User';

export default class UserRepository extends Repository<User> {
  constructor(db: firestore.Firestore) {
    super(db, 'users');
  }

  byTelegramId(telegramId: number): Promise<User> {
    return this.db
      .collection(this.collection)
      .where('telegramId', '==', telegramId)
      .get()
      .then(d => d.docs[0].data() as User);
  }
}
