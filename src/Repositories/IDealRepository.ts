import Deal from '../Models/Deal';
import IRepository from './IRepository';

export default interface IDealRepository extends IRepository<Deal> {
  getActive(limit: number): Promise<Deal[]>;
  getAllActiveIds(): Promise<string[]>;
}
