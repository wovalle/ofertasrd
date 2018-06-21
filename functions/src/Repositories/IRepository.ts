export default interface IRepository<T> {
  get(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  saveAll(entities: T[]): Promise<void>;
}
