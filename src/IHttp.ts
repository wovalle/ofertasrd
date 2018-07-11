export default interface IHttp {
  get(url: string): Promise<IHttpResponse>;
}

interface IHttpResponse {
  data: any;
  status: number;
}
