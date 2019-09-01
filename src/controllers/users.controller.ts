import { Controller, IResponse } from "#controllers/controller.controller";
import { User } from "#models/user";
import { ServerError } from "#utils";
import {Body, Get, Post, Route, Security, SuccessResponse, Tags  } from "tsoa";

export interface IUser {
  id: number;
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
  public async GetUsers(): Promise<IResponse<IUser[]>> {
    const users = await User.find({});
    return this.response(users);
  }
  @Get("/new")
  @Tags("Users")
  public async GetNewUsers(): Promise<IResponse<IUser>> {
    const user = await User.findOne(1);
    if (!user) {
      throw new ServerError(`no user found with id ${1}`);
    }
    return this.response(user);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post("/create")
  @Security("api_key")
  public async createUser(@Body() requestBody: INewUser): Promise<INewUser> {
      this.setStatus(201);
      return requestBody;
  }
}
