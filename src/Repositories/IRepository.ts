export default interface IRepository<T extends { id: string }> {
  get(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  add(entity: T): Promise<void>;
  saveAll(entities: T[]): Promise<void>;
}
