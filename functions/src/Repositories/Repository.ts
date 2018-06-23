import { firestore } from 'firebase-admin';
import IRepository from './IRepository';
import { asyncForEach } from '../utils';

export default abstract class FirestoreRepository<T extends { id: string }>
  implements IRepository<T> {
  constructor(protected db: firestore.Firestore, protected collection: string) {
    this.db = db;
    this.collection = collection;
  }

  async get(id: string): Promise<T> {
    return this.db
      .collection(this.collection)
      .doc(id)
      .get()
      .then(d => d.data() as T);
  }

  // TODO: Add Pagination
  async getAll(): Promise<T[]> {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map(d => d.data() as T);
  }

  async add(entity: T): Promise<void> {
    await this.db.collection(this.collection).add(entity);
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
