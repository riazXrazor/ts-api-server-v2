import { Get, Route, Tags, SuccessResponse, Post, Body, Controller } from "tsoa";

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
}

export interface INewUser {
  name: string;
  email: string;
}
@Route("users")
export class UsersController extends Controller  {
  @Get("/")
  @Tags("Users")
  public async GetUsers(): Promise<IUser[]> {
    return [
      {
        email: "asdasdas",
        first_name: "riaz",
        last_name: "ok",
      },
    ];
  }
  @Get("/new")
  @Tags("Users")
  public async GetNewUsers(): Promise<INewUser[]> {
    return [
      {
        email: "asdasdas",
        name: "riaz",
      },
    ];
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post("/create")
  public async createUser(@Body() requestBody: INewUser): Promise<INewUser> {
      this.setStatus(201);
      return requestBody;
  }
}
