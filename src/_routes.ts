/* tslint:disable */
import { initializeDbConnection } from "#config/database";
import { Controller, TsoaRoute } from 'tsoa';
import { Controller as BaseController } from './controllers/controller.controller';
import { UsersController } from './controllers/users.controller';

export default function(fastify: any, _opts: any, done: any) {
  fastify.addSchema({
    $id: 'errors',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        field: { type: 'string' },
        message: { type: 'string' }
      }
    }
  })
  fastify.addSchema({
    $id: 'data',
    type: ['array','object'],
    items: {},
    properties: {}
  })
  fastify.addSchema({
    $id: 'INewUser',
    type: ['array','object'],
    items: {},
    properties: {
      "name": { "type": "string", },
      "email": { "type": "string" },
    }
  })
  
  fastify.addSchema({
    $id: 'meta',
    type: 'object',
    properties: {
      message: { type: 'string' },
      status: { type: 'number' }
    }
  })

  
  initializeDbConnection();

  fastify.route({
    method: 'GET',
    url: '/api/users',
    schema: {
      response: {
        '2xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
        '4xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
        '5xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
      }
    },
    preHandler: [
    ],
    attachValidation: true,
    handler: function(request: any, response: any) {
      if (request.validationError) {
        handleValidationError(request, response);
        return;
      }

      const args = getArgs({}, request)
      const controller = new UsersController(fastify);

      const promise = controller.GetUsers.apply(controller, args as any);
      promiseHandler(controller, promise, response);
    }
  })

  fastify.route({
    method: 'GET',
    url: '/api/users/new',
    schema: {
      response: {
        '2xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
        '4xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
        '5xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
      }
    },
    preHandler: [
    ],
    attachValidation: true,
    handler: function(request: any, response: any) {
      if (request.validationError) {
        handleValidationError(request, response);
        return;
      }

      const args = getArgs({}, request)
      const controller = new UsersController(fastify);

      const promise = controller.GetNewUsers.apply(controller, args as any);
      promiseHandler(controller, promise, response);
    }
  })

  fastify.route({
    method: 'POST',
    url: '/api/users/create',
    schema: {
      body: { "type": "object", "properties": { "name": { "type": "string" }, "email": { "type": "string" } }, "required": ["name", "email"] },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            data: 'INewUser#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
        '4xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
        '5xx': {
          type: 'object',
          properties: {
            data: 'data#',
            errors: 'errors#',
            meta: 'meta#',
          }
        },
      }
    },
    preHandler: [
      authenticateMiddleware([{ "api_key": [] }]),
    ],
    attachValidation: true,
    handler: function(request: any, response: any) {
      if (request.validationError) {
        handleValidationError(request, response);
        return;
      }

      const args = getArgs({ requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "INewUser" }, }, request)
      const controller = new UsersController(fastify);
       
      const promise = controller.createUser.apply(controller, args);
      promiseHandler(controller, promise, response);
    }
  })





  fastify.setErrorHandler((error: any, _request: any, reply: any) => {
    fastify.log.error("Error:", error)
    const controller = new BaseController();
    const arg: any = [[], "Internal Server Error", 500];
    const promise = controller.response.apply(controller, arg);
    reply.code(500).send(promise);
  });

  fastify.setNotFoundHandler((_request: any, reply: any) => {
    const controller = new BaseController();
    const arg: any = [[], "Endpoint not found", 404];
    const promise = controller.response.apply(controller, arg);
    reply.code(404).send(promise);
  })

  function handleValidationError(request: any, response: any) {
    fastify.log.error("validationError:", request.validationError)
    const controller = new BaseController();
    const arg: any = [[], "validationError", 400, getErrors(request.validationError.validation)];
    const promise = controller.response.apply(controller, arg);
    response.code(400).send(promise);
  }

  function getErrors(ErrorObj: any) {
    return ErrorObj.map((err: any) => {
      return {
        field: err.params.missingProperty,
        message: err.message
      };
    })
  }

  function authenticateMiddleware(_securities: TsoaRoute.Security[] = []) {
    return AuthRequest
  }


  function AuthRequest(request: any, reply: any, done: any) {
    request.jwtVerify().then(() => { done(); }).catch((e: any) => {
      const controller = new BaseController();
      const arg: any = [[], e.message, 401];
      const promise = controller.response.apply(controller, arg);
      reply.code(401).send(promise);
      done();
    });

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
      .catch((err: any) => {
        const controller = new BaseController();
        const arg: any = [[], err.message || err.name, err.status];
        const promise = controller.response.apply(controller, arg);
        response.code(500).send(promise)
      });
  }

  function getArgs(args: any, request: any): any {

    const values = Object.keys(args).map(function(key) {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return request.query[name]
        case 'path':
          return request.params[name]
        case 'header':
          return request.headers[name]
        case 'body':
          return request.body
        case 'body-prop':
          return request.body[name]
      }
    });
    
    return values;
  }


  done();
}
