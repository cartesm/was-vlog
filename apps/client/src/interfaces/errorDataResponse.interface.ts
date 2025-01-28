export interface IRespData<T> {
  data?: T;
  error?: string[];
}

export interface IErrorResp {
  message: string;
  error: string;
  statusCode: number;
}
