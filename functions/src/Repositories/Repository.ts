import { firestore } from 'firebase-admin';
import IRepository from './IRepository';
import { asyncForEach } from '../utils';

export default abstract class FirestoreRepository<T extends { id: string }>
  implements IRepository<T> {
  private db: firestore.Firestore;
  private collection: string;

  constructor(db: firestore.Firestore, collection: string) {
    this.db = db;
    this.collection = collection;
  }

  async get(id: string): Promise<T> {
    return this.db
      .collection(this.collection)
      .doc(id)
      .get()
      .then(d => (d as any) as T);
  }

  // TODO: Add Pagination
  async getAll(): Promise<T[]> {
    const docs = await this.db.collection(this.collection).get();
    return Object.values(docs);
  }

  async save(entity: T): Promise<void> {
    await this.db
      .collection(this.collection)
      .doc(entity.id)
      .set(entity);
  }

  async saveAll(entities: T[]): Promise<void> {
    await asyncForEach(entities, async (entity: T) => {
      await this.save(entity);
    });
  }
}
