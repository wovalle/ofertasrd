import { database } from 'firebase-admin';
import IRepository from './IRepository';
import Deal from '../Models/Deal';
import { asyncForEach } from '../utils';

export default class DealRepository implements IRepository<Deal> {
  private db: database.Database;
  private ref = '/deals';

  constructor(db: database.Database) {
    this.db = db;
  }

  get(id: string): Promise<Deal> {
    throw new Error('Method not implemented.');
  }

  // TODO: Add Pagination
  async getAll(): Promise<Deal[]> {
    const deals = await this.db.ref(this.ref).once('value');
    return Object.values(deals);
  }

  async save(entity: Deal): Promise<void> {
    const dealRef = this.db.ref(`${this.ref}/${entity.id}`);
    dealRef.set(entity);
    return dealRef.set(entity);
  }

  async saveAll(entities: Deal[]): Promise<void> {
    await asyncForEach(entities, async (entity: Deal) => {
      await this.save(entity);
    });
  }

  async whereIn(slugs: string[]): Promise<Deal[]> {
    const dealsRef = await this.db.ref(this.ref).orderByKey();

    console.log(dealsRef);
  }
}
