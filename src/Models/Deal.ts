export const enum DealProvider {
  Viagrupo = 1,
}

export default class Deal {
  provider: DealProvider;
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  endDate: Date;

  get url() {
    return `http://viagrupo.com${this.id}`;
  }
}
