/* tslint:disable */
import chalk from "chalk";
import prettyHrtime from "pretty-hrtime";
import { generateRoutes, generateSwaggerSpec, RoutesConfig, SwaggerConfig } from "tsoa";
import * as handlebars from 'handlebars';
import { config } from "dotenv"
import { ApiKeySecurity } from "swagger-schema-official";
config();
handlebars.registerHelper('toUpperCase', (context: any) => {
  return context.toUpperCase();
});
(async () => {

  const SecurityDef: ApiKeySecurity = {
    type: "apiKey",
    name: "Authorization",
    in: "header",
    description: "access token from the login"
  }

  const swaggerOptions: SwaggerConfig = {
    basePath: process.env['BASE_PATH'],
    controllerPathGlobs: [
      "./src/controllers/**/*.controller.ts",
    ],
    entryFile: "./src/server.ts",
    outputDirectory: "src",
    schemes: [
      "http",
    ],
    specVersion: 3,
    noImplicitAdditionalProperties: 'silently-remove-extras',
    securityDefinitions: {
      "api_key" : SecurityDef
    }
  };

  const routeOptions: RoutesConfig = {
    basePath: process.env['BASE_PATH'],
    entryFile: "./src/server.ts",
    middlewareTemplate: "./build/route-template.hbs",
    routesDir: "./src",
  };

  const ignorePaths: string[] = [
    "**/node_modules/**"
  ];
  try {
    let fstart = process.hrtime();
    let start = process.hrtime();

    await generateSwaggerSpec(swaggerOptions, routeOptions, {}, ignorePaths);

    let end = process.hrtime(start);
      console.log(chalk.greenBright(`✓ Generated OpenAPI spec (${prettyHrtime(end)})`));
    start = process.hrtime();

    await generateRoutes(routeOptions, swaggerOptions);

    end = process.hrtime(start);
      console.log(chalk.greenBright(`✓ Generated routes (${prettyHrtime(end)})`));
    end = process.hrtime(fstart);
      console.log(chalk.greenBright(`✓ Generated Client (${prettyHrtime(end)})`));
  } catch (e) {
      console.log(chalk.red(e))
  }
})();
