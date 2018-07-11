import { firestore } from 'firebase-admin';
import FirebaseRepository from './FirebaseRepository';
import Deal from '../Models/Deal';

export default class DealRepository extends FirebaseRepository<Deal> {
  constructor(db: firestore.Firestore) {
    super(db, 'deals');
  }

  async getActive(limit: number = 20): Promise<Deal[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('endDate', '>=', new Date())
      .orderBy('endDate', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(d => d.data() as Deal);
  }
}
