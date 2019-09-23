import { Controller as BaseController } from "tsoa";
export interface IMeta {
  message: string;
  status: number;
}
export interface IError {
  field: string;
  message: string;
}
export interface IResponse<T> {
 errors: IError;
 meta: IMeta;
 data: T;
}

export class Controller extends BaseController {
  public fastify: any;
  constructor(fastify?: any) {
    super();
    if (fastify) {
      this.fastify = fastify;
    }
  }
  public response(data: any, message: string | object = "success", status: number = 200, errors: any = []): any {
    return {
      data ,
      errors,
      meta: {
        message,
        status,
      },
    };
  }
}
