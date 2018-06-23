import { firestore } from 'firebase-admin';
import Repository from './Repository';
import Deal from '../Models/Deal';

export default class DealRepository extends Repository<Deal> {
  constructor(db: firestore.Firestore) {
    super(db, 'deals');
  }
}
