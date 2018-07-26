import { firestore } from 'firebase-admin';
import FirebaseRepository from './FirebaseRepository';
import Deal from '../Models/Deal';
import IDealRepository from './IDealRepository';

export default class DealRepository extends FirebaseRepository<Deal>
  implements IDealRepository {
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

  async getAllActiveIds(): Promise<string[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('endDate', '>=', new Date())
      .orderBy('endDate', 'desc')
      .select('id')
      .get();

    return snapshot.docs.map(d => d.data().id as string);
  }
}
