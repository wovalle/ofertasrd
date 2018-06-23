import { firestore } from 'firebase-admin';
import Repository from './Repository';
import User from '../Models/User';

export default class UserRepository extends Repository<User> {
  constructor(db: firestore.Firestore) {
    super(db, 'users');
  }
}
