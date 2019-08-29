
/* tslint:disable */
import chalk from "chalk";
import prettyHrtime from "pretty-hrtime";
import { generateRoutes, generateSwaggerSpec, RoutesConfig, SwaggerConfig } from "tsoa";
import * as handlebars from 'handlebars';
handlebars.registerHelper('toUpperCase', (context: any) => {
  return context.toUpperCase();
});
(async () => {
  const swaggerOptions: SwaggerConfig = {
    basePath: "/api",
    controllerPathGlobs: [
      "./src/controllers/**/*.controller.ts",
    ],
    entryFile: "./src/server.ts",
    outputDirectory: "src",
    schemes: [
      "http",
    ],
    specVersion: 3,
  };

  const routeOptions: RoutesConfig = {
    basePath: "/api",
    entryFile: "./src/server.ts",
    middlewareTemplate: "./build/route-template.hbs",
    routesDir: "./src",
  };
  try {
    let fstart = process.hrtime();
    let start = process.hrtime();

    await generateSwaggerSpec(swaggerOptions, routeOptions);

    let end = process.hrtime(start);
      console.log(chalk.greenBright(`✓ Generated OpenAPI spec (${prettyHrtime(end)})`));
    start = process.hrtime();

    await generateRoutes(routeOptions, swaggerOptions);

    end = process.hrtime(start);
      console.log(chalk.greenBright(`✓ Generated routes (${prettyHrtime(end)})`));
    end = process.hrtime(fstart);
      console.log(chalk.greenBright(`✓ Generated Client (${prettyHrtime(end)})`));
  } catch (e) {
      console.log(chalk.red(e.getMessage()))
  }
})();
