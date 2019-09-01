import { Controller as BaseController } from "tsoa";
export interface IMeta {
  message: string;
  status: number;
}
export interface IResponse<T> {
 meta: IMeta;
 data: T;
}

export class Controller extends BaseController {
  protected response(data: any, message: string = "success", status: number = 200): any {
    // this.setStatus(status);
    return {
      data ,
      meta: {
        message,
        status,
      },
    };
  }
}
