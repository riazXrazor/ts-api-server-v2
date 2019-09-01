/* tslint:disable */
import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import fastifySwagger from 'fastify-swagger'; 
import fastifyJwt from 'fastify-jwt'; 
import RegisterRoutes from "./routes";
import { config } from "dotenv"
config();
const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true
});

server.register(fastifyJwt, {
  secret: process.env["APPKEY"] || "secret"
})
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
  server.log.error(error);
});
process.on("unhandledRejection", error => {
  server.log.error(error || {});
});

start();
