import { firestore } from 'firebase-admin';
import IRepository from './IRepository';
import Deal from '../Models/Deal';
import { asyncForEach } from '../utils';

export default class DealRepository implements IRepository<Deal> {
  private db: firestore.Firestore;
  private collectionName = 'deals';

  constructor(db: firestore.Firestore) {
    this.db = db;
  }

  get(id: string): Promise<Deal> {
    throw new Error('Method not implemented.');
  }

  // TODO: Add Pagination
  async getAll(): Promise<Deal[]> {
    const deals = await this.db.collection(this.collectionName).get();
    return Object.values(deals);
  }

  async save(entity: Deal): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .doc(entity.id)
      .set(entity, { merge: false });
  }

  async saveAll(entities: Deal[]): Promise<void> {
    await asyncForEach(entities, async (entity: Deal) => {
      await this.save(entity);
    });
  }
}
