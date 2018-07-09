import { firestore } from 'firebase-admin';
import FirebaseRepository from './FirebaseRepository';
import Deal from '../Models/Deal';

export default class DealRepository extends FirebaseRepository<Deal> {
  constructor(db: firestore.Firestore) {
    super(db, 'deals');
  }
}
