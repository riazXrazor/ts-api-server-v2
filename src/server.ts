/* tslint:disable */
import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import fastifySwagger from 'fastify-swagger'; 
import RegisterRoutes from "./routes";

// import './controllers/users.controller';

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true
});


server.register(RegisterRoutes);
server.register(fastifySwagger, {
  mode: 'static',
  exposeRoute: true,
  routePrefix: '/docs',
  specification: {
    path: './src/swagger.json',
    postProcessor: function(swaggerObject: any) {
      return swaggerObject
    },
    baseDir: '/'
  },
});

const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

start();
