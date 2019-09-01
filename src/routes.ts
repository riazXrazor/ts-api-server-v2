/* tslint:disable */
import { initializeDbConnection } from "#config/database";
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { UsersController } from './controllers/users.controller';

const models: TsoaRoute.Models = {
  "IMeta": {
    "properties": {
      "message": { "dataType": "string", "required": true },
      "status": { "dataType": "double", "required": true },
    },
  },
  "IUser": {
    "properties": {
      "id": { "dataType": "double", "required": true },
      "first_name": { "dataType": "string", "required": true },
      "last_name": { "dataType": "string", "required": true },
      "email": { "dataType": "string", "required": true },
    },
  },
  "IResponseIUserArray": {
    "properties": {
      "meta": { "ref": "IMeta", "required": true },
      "data": { "dataType": "array", "array": { "ref": "IUser" }, "required": true },
    },
  },
  "IResponseIUser": {
    "properties": {
      "meta": { "ref": "IMeta", "required": true },
      "data": { "ref": "IUser", "required": true },
    },
  },
  "INewUser": {
    "properties": {
      "name": { "dataType": "string", "required": true },
      "email": { "dataType": "string", "required": true },
    },
  },
};




export default function(fastify: any, _opts: any, done: any) {
  fastify.decorateRequest('validatedArgs', [])
  fastify.decorateRequest('getValidatedArgs', getValidatedArgs)
  initializeDbConnection();
  fastify.route({
    method: 'GET',
    url: '/api/users',
    preHandler: [
      validateRequest,
    ],
    handler: function(request: any, response: any) {
      const controller = new UsersController();

      const promise = controller.GetUsers.apply(controller, request.validatedArgs as any);
      promiseHandler(controller, promise, response);
    }
  })

  fastify.route({
    method: 'GET',
    url: '/api/users/new',
    preHandler: [
      validateRequest,
    ],
    handler: function(request: any, response: any) {
      const controller = new UsersController();

      const promise = controller.GetNewUsers.apply(controller, request.validatedArgs as any);
      promiseHandler(controller, promise, response);
    }
  })

  fastify.route({
    method: 'POST',
    url: '/api/users/create',
    preHandler: [
      validateRequest,
      authenticateMiddleware([{ "api_key": [] }]),
    ],
    handler: function(request: any, response: any) {
      const controller = new UsersController();

      const promise = controller.createUser.apply(controller, request.validatedArgs as any);
      promiseHandler(controller, promise, response);
    }
  })


  function authenticateMiddleware(_securities: TsoaRoute.Security[] = []) {
    return AuthRequest
  }


  function AuthRequest(request: any, _reply: any, done: any) {

    if (request.headers && !request.headers.authorization) {
      done(new Error("Unauth"));
    }

    done();
  }


  function validateRequest(request: any, reply: any, done: any) {
    const args = {
    };

    try {
      request.getValidatedArgs(args, request)
    } catch (err) {
      reply.code(400).send(err)
    }
    done();
  }

  function promiseHandler(controllerObj: any, promise: any, response: any) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode;
        if (controllerObj instanceof Controller) {
          const controller = controllerObj as Controller
          const headers = controller.getHeaders();
          Object.keys(headers).forEach((name: string) => {
            response.header(name, headers[name]);
          });

          statusCode = controller.getStatus();
        }

        if (data || data === false) {
          response.code(statusCode || 200).send(data);
        } else {
          response.code(statusCode || 204).send();
        }
      })
      .catch((error: any) => response.code(500).send(error));
  }

  function getValidatedArgs(args: any, request: any): void {
    const errorFields: FieldErrors = {};
    const values = Object.keys(args).map(function(key) {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return ValidateParam(args[key], request.query[name], models, name, errorFields, undefined, { "controllerPathGlobs": ["./src/controllers/**/*.controller.ts"], "specVersion": 3 });
        case 'path':
          return ValidateParam(args[key], request.params[name], models, name, errorFields, undefined, { "controllerPathGlobs": ["./src/controllers/**/*.controller.ts"], "specVersion": 3 });
        case 'header':
          return ValidateParam(args[key], request.headers[name], models, name, errorFields, undefined, { "controllerPathGlobs": ["./src/controllers/**/*.controller.ts"], "specVersion": 3 });
        case 'body':
          return ValidateParam(args[key], request.body, models, name, errorFields, undefined, { "controllerPathGlobs": ["./src/controllers/**/*.controller.ts"], "specVersion": 3 });
        case 'body-prop':
          return ValidateParam(args[key], request.body[name], models, name, errorFields, undefined, { "controllerPathGlobs": ["./src/controllers/**/*.controller.ts"], "specVersion": 3 });
      }
    });

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, '');
    }
    request.validatedArgs = values;
  }

  done();
}
